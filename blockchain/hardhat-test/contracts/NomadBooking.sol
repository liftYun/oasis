// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract NomadBooking is
    ReentrancyGuard,
    Pausable,
    AutomationCompatibleInterface,
    ERC165
{
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    address public immutable admin;

    mapping(address => uint256) public nonces;
    bytes32 private constant LOCK_TYPEHASH =
        keccak256(
            "LockBooking(bytes32 resId,address host,uint256 amount,uint256 fee,uint64 checkIn,uint64 checkOut,PolicySnap policy,uint256 nonce)"
        );
    bytes32 private constant POLICY_TYPEHASH =
        keccak256(
            "PolicySnap(uint32 before1,uint32 before2,uint32 before3,uint32 before4,uint16 amtPct1,uint16 amtPct2,uint16 amtPct3,uint16 amtPct4,uint16 amtPct5,uint16 feePct1,uint16 feePct2,uint16 feePct3,uint16 feePct4,uint16 feePct5)"
        );
    bytes32 private immutable DOMAIN_SEPARATOR;

    IERC20 public immutable USDC;
    address public immutable feeRecipient;
    uint256 public immutable graceSeconds;
    bool public supportsPermit;

    enum Status {
        None,
        Locked,
        Released,
        Refunded
    }

    struct PolicySnap {
        // 남은 시간이 이 값(초) 이상이면 해당 구간
        uint32 before1; // 예: 7일
        uint32 before2; // 예: 5일
        uint32 before3; // 예: 3일
        uint32 before4; // 예: 1일
        // 금액/수수료 환불 비율 (bps, 10000=100%)
        uint16 amtPct1; // >= before1
        uint16 amtPct2; // >= before2
        uint16 amtPct3; // >= before3
        uint16 amtPct4; // >= before4
        uint16 amtPct5; // <  before4 (당일)
        uint16 feePct1;
        uint16 feePct2;
        uint16 feePct3;
        uint16 feePct4;
        uint16 feePct5;
    }
    struct Booking {
        address guest;
        address host;
        uint256 amount;
        uint256 fee;
        uint64 checkIn;
        uint64 checkOut;
        Status status;
        PolicySnap policy;
    }

    struct LockParams {
        address guest;
        bytes32 resId;
        address host;
        uint256 amount;
        uint256 fee;
        uint64 checkIn;
        uint64 checkOut;
        PolicySnap policy;
    }

    struct Split {
        uint8 tier;
        uint256 guestAmt;
        uint256 hostAmt;
        uint256 guestFee;
        uint256 treasuryFee;
    }

    mapping(bytes32 => Booking) public bookings;
    bytes32[] public activeBookings;
    mapping(bytes32 => uint256) private bookingIndex;
    mapping(address => bytes32[]) private guestBookingIds;
    mapping(address => bytes32[]) private hostBookingIds;

    event BookingLocked(
        bytes32 indexed resId,
        address indexed guest,
        address indexed host,
        uint256 amount,
        uint256 fee
    );
    event Released(
        bytes32 indexed resId,
        address toHost,
        uint256 amount,
        address feeTo,
        uint256 fee
    );
    event CanceledWithPolicy(
        bytes32 indexed resId,
        uint8 tier,
        uint256 refundToGuestAmt,
        uint256 payToHostAmt,
        uint256 refundToGuestFee,
        uint256 payToTreasuryFee
    );
    event Refunded(bytes32 indexed resId, address toGuest, uint256 total);

    constructor(
        address usdc,
        address feeTo,
        uint256 _graceSeconds,
        address _admin
    ) {
        require(
            usdc != address(0) && feeTo != address(0) && _admin != address(0),
            "bad"
        );
        USDC = IERC20(usdc);
        feeRecipient = feeTo;
        graceSeconds = _graceSeconds;
        admin = _admin;
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("NomadBooking")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }


    function lock(
        bytes32 resId,
        address host,
        uint256 amount,
        uint256 fee,
        uint64 checkIn,
        uint64 checkOut,
        PolicySnap calldata policy
    ) external nonReentrant whenNotPaused {
        _lockBooking(resId, host, amount, fee, checkIn, checkOut, policy);
    }


    function _lockBooking(
        bytes32 resId,
        address host,
        uint256 amount,
        uint256 fee,
        uint64 checkIn,
        uint64 checkOut,
        PolicySnap calldata policy
    ) internal {
        require(bookings[resId].guest == address(0), "exists");
        require(host != address(0) && amount > 0, "params");
        // require(msg.sender != host, "self");
        require(checkIn < checkOut, "time");

        address guest = msg.sender;
        Booking storage b = bookings[resId];

        b.guest = guest;
        b.host = host;
        b.amount = amount;
        b.fee = fee;
        b.checkIn = checkIn;
        b.checkOut = checkOut;
        b.status = Status.Locked;

        b.policy = policy;

        uint256 total = amount + fee;
        USDC.safeTransferFrom(guest, address(this), total);

        bookingIndex[resId] = activeBookings.length;
        activeBookings.push(resId);
        guestBookingIds[guest].push(resId);
        hostBookingIds[host].push(resId);

        emit BookingLocked(resId, guest, host, amount, fee);
    }

    function _lockBookingForUser(LockParams memory p) internal {
        require(bookings[p.resId].guest == address(0), "exists");
        require(p.host != address(0) && p.amount > 0, "params");
        require(p.guest != p.host, "self");
        require(p.checkIn < p.checkOut, "time");

        Booking storage b = bookings[p.resId];
        b.guest = p.guest;
        b.host = p.host;
        b.amount = p.amount;
        b.fee = p.fee;
        b.checkIn = p.checkIn;
        b.checkOut = p.checkOut;
        b.status = Status.Locked;
        b.policy = p.policy;

        USDC.safeTransferFrom(p.guest, address(this), p.amount + p.fee);
        bookingIndex[p.resId] = activeBookings.length;
        activeBookings.push(p.resId);
        guestBookingIds[p.guest].push(p.resId);
        hostBookingIds[p.host].push(p.resId);
        emit BookingLocked(p.resId, p.guest, p.host, p.amount, p.fee);
    }

    function _hashPolicy(
        PolicySnap calldata policy
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    POLICY_TYPEHASH,
                    policy.before1,
                    policy.before2,
                    policy.before3,
                    policy.before4,
                    policy.amtPct1,
                    policy.amtPct2,
                    policy.amtPct3,
                    policy.amtPct4,
                    policy.amtPct5,
                    policy.feePct1,
                    policy.feePct2,
                    policy.feePct3,
                    policy.feePct4,
                    policy.feePct5
                )
            );
    }

    // ---------- Release ----------
    function release(bytes32 resId) external nonReentrant whenNotPaused {
        Booking storage b = bookings[resId];
        require(b.status == Status.Locked, "state");

        require(block.timestamp >= b.checkOut, "before-checkout");
        bool hostOnlyWindow = block.timestamp <
            uint256(b.checkOut) + graceSeconds;
        if (hostOnlyWindow) require(msg.sender == b.host, "host-only");

        b.status = Status.Released;
        if (b.amount > 0) USDC.safeTransfer(b.host, b.amount);
        if (b.fee > 0) USDC.safeTransfer(feeRecipient, b.fee);

        _removeActiveBooking(resId);
        emit Released(resId, b.host, b.amount, feeRecipient, b.fee);
    }

    // ---------- Refund Early ----------
    function refundEarly(bytes32 resId) external nonReentrant whenNotPaused {
        Booking storage b = bookings[resId];
        require(b.status == Status.Locked, "state");
        require(msg.sender == b.guest, "only-guest");
        require(block.timestamp < b.checkIn, "after-checkin");

        b.status = Status.Refunded;
        uint256 total = b.amount + b.fee;
        USDC.safeTransfer(b.guest, total);

        _removeActiveBooking(resId);
        emit Refunded(resId, b.guest, total);
    }

    // ---------- Cancel With Policy ----------
    function cancelWithPolicy(
        bytes32 resId
    ) external nonReentrant whenNotPaused {
        Booking storage b = bookings[resId];
        require(b.status == Status.Locked, "state");
        require(
            msg.sender == b.guest ||
                msg.sender == b.host ||
                msg.sender == admin,
            "no-auth"
        );

        Split memory s = _computePolicySplit(b);

        b.status = Status.Refunded;

        if (s.guestAmt > 0) USDC.safeTransfer(b.guest, s.guestAmt);
        if (s.hostAmt > 0) USDC.safeTransfer(b.host, s.hostAmt);
        if (s.guestFee > 0) USDC.safeTransfer(b.guest, s.guestFee);
        if (s.treasuryFee > 0) USDC.safeTransfer(feeRecipient, s.treasuryFee);

        _removeActiveBooking(resId);
        emit CanceledWithPolicy(
            resId,
            s.tier,
            s.guestAmt,
            s.hostAmt,
            s.guestFee,
            s.treasuryFee
        );
    }

    function _removeActiveBooking(bytes32 resId) internal {
        uint256 index = bookingIndex[resId];
        uint256 lastIndex = activeBookings.length - 1;

        if (index != lastIndex) {
            bytes32 lastResId = activeBookings[lastIndex];
            activeBookings[index] = lastResId;
            bookingIndex[lastResId] = index;
        }
        activeBookings.pop();
        delete bookingIndex[resId];
    }

    // ---------- Compute Policy ----------
    function _computePolicySplit(
        Booking storage b
    ) internal view returns (Split memory s) {
        PolicySnap storage p = b.policy;

        uint256 remaining = block.timestamp >= b.checkIn
            ? 0
            : (uint256(b.checkIn) - block.timestamp);

        uint16 amtPct;
        uint16 feePct;

        // 상단 구간부터 순차 매칭 (remaining은 "남은 시간")
        if (remaining >= p.before1) {
            s.tier = 1;
            amtPct = p.amtPct1;
            feePct = p.feePct1;
        } else if (remaining >= p.before2) {
            s.tier = 2;
            amtPct = p.amtPct2;
            feePct = p.feePct2;
        } else if (remaining >= p.before3) {
            s.tier = 3;
            amtPct = p.amtPct3;
            feePct = p.feePct3;
        } else if (remaining >= p.before4) {
            s.tier = 4;
            amtPct = p.amtPct4;
            feePct = p.feePct4;
        } else {
            // 당일 (before4 미만)
            s.tier = 5;
            amtPct = p.amtPct5;
            feePct = p.feePct5;
        }

        unchecked {
            s.guestAmt = (b.amount * amtPct) / 10_000;
            s.hostAmt = b.amount - s.guestAmt;
            s.guestFee = (b.fee * feePct) / 10_000;
            s.treasuryFee = b.fee - s.guestFee;
        }
    }

    // ==== [주소별 예약 ID 조회: 전체/페이지네이션] ====
    function guestBookingCount(address guest) external view returns (uint256) {
        return guestBookingIds[guest].length;
    }

    function hostBookingCount(address host) external view returns (uint256) {
        return hostBookingIds[host].length;
    }

    function getGuestBookingIds(
        address guest
    ) external view returns (bytes32[] memory ids) {
        bytes32[] storage arr = guestBookingIds[guest];
        uint256 len = arr.length;
        ids = new bytes32[](len);
        for (uint256 i = 0; i < len; ++i) {
            ids[i] = arr[i];
        }
    }

    function getHostBookingIds(
        address host
    ) external view returns (bytes32[] memory ids) {
        bytes32[] storage arr = hostBookingIds[host];
        uint256 len = arr.length;
        ids = new bytes32[](len);
        for (uint256 i = 0; i < len; ++i) {
            ids[i] = arr[i];
        }
    }

    // ---------- Chainlink Automation ----------
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 length = activeBookings.length;
        for (uint256 i = 0; i < length; ++i) {
            bytes32 resId = activeBookings[i];
            Booking storage b = bookings[resId];
            if (
                b.status == Status.Locked &&
                block.timestamp >= b.checkOut &&
                block.timestamp >= (uint256(b.checkOut) + graceSeconds)
            ) {
                upkeepNeeded = true;
                performData = abi.encode(resId);
                break;
            }
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        bytes32 resId = abi.decode(performData, (bytes32));
        Booking storage b = bookings[resId];
        require(b.status == Status.Locked, "state");
        require(
            block.timestamp >= (uint256(b.checkOut) + graceSeconds),
            "grace-period"
        );

        b.status = Status.Released;
        if (b.amount > 0) USDC.safeTransfer(b.host, b.amount);
        if (b.fee > 0) USDC.safeTransfer(feeRecipient, b.fee);

        _removeActiveBooking(resId);
        emit Released(resId, b.host, b.amount, feeRecipient, b.fee);
    }

    // ---------- Admin ----------
    function pause() external {
        require(msg.sender == admin, "only-admin");
        _pause();
    }

    function unpause() external {
        require(msg.sender == admin, "only-admin");
        _unpause();
    }

    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external {
        require(msg.sender == admin, "only-admin");
        require(token != address(0) && to != address(0), "bad address");
        require(token != address(USDC), "cannot-withdraw-usdc");
        IERC20(token).safeTransfer(to, amount);
    }

    // ---------- View helpers ----------
    function getBooking(bytes32 resId) external view returns (Booking memory) {
        return bookings[resId];
    }

    function canRelease(bytes32 resId) external view returns (bool) {
        Booking storage b = bookings[resId];
        if (b.status != Status.Locked) return false;
        if (block.timestamp < b.checkOut + graceSeconds) return false;
        return true;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // ---------- Meta Transaction helpers ----------
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    function getDomainSeparator() external view returns (bytes32) {
        return DOMAIN_SEPARATOR;
    }

    // ---------- Permit 관련 헬퍼 함수들 ----------
    function getPermitTypeHash() external pure returns (bytes32) {
        return
            keccak256(
                "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
            );
    }

    function getUSDCAddress() external view returns (address) {
        return address(USDC);
    }

    function checkPermitSupport() external view returns (bool) {
        return supportsPermit;
    }
}
