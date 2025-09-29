import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";

// 빠르게 돌리기용 any (TypeChain 도입 시 NomadBooking/MockERC20 타입으로 교체 가능)
type BN = bigint;

describe("NomadBooking (time-safe)", function () {
    before(async () => {
        await printNetworkBanner();
    });

    // 상수
    const GRACE_SECONDS = 3600; // 1 hour
    const USDC_DECIMALS = 6;

    // 정책 구조 (컨트랙트의 struct와 필드 순서/이름 동일해야 함)
    const defaultPolicy = {
        before1: 7 * 24 * 3600,
        before2: 5 * 24 * 3600,
        before3: 3 * 24 * 3600,
        before4: 1 * 24 * 3600,
        amtPct1: 9000,
        amtPct2: 8000,
        amtPct3: 5000,
        amtPct4: 2000,
        amtPct5: 0,
        feePct1: 8000,
        feePct2: 5000,
        feePct3: 3000,
        feePct4: 0,
        feePct5: 0,
    };

    // ✅ 정책 로직을 테스트에서 계산하는 헬퍼
    function pickPolicyPerc(
        secsUntilCheckIn: number,
        p = defaultPolicy
    ): { amtPct: BN; feePct: BN } {
        if (secsUntilCheckIn >= p.before1) return { amtPct: 9000n, feePct: 8000n };
        if (secsUntilCheckIn >= p.before2) return { amtPct: 8000n, feePct: 5000n };
        if (secsUntilCheckIn >= p.before3) return { amtPct: 5000n, feePct: 3000n };
        if (secsUntilCheckIn >= p.before4) return { amtPct: 2000n, feePct: 0n };
        return { amtPct: 0n, feePct: 0n };
    }

    async function printNetworkBanner() {
        const net = await ethers.provider.getNetwork();
        const fee = await ethers.provider.getFeeData();
        const latest = await ethers.provider.getBlock("latest");
        const client = await ethers.provider.send("web3_clientVersion", []);

        // 가스 모드 표시 (EIP-1559 여부)
        const eip1559 =
            latest?.baseFeePerGas != null ||
            (fee.maxFeePerGas != null && fee.maxPriorityFeePerGas != null);

        console.log("========== Network ==========");
        console.log(`name      : ${hre.network.name}`);
        console.log(`chainId   : ${net.chainId.toString()}`);
        console.log(`client    : ${client}`);
        console.log(`eip-1559  : ${eip1559 ? "yes" : "no"}`);
        if (eip1559) {
            console.log(
                `fee(max/maxPrio): ${fee.maxFeePerGas ?? 0n} / ${fee.maxPriorityFeePerGas ?? 0n} wei`
            );
            console.log(`baseFee    : ${latest?.baseFeePerGas ?? 0n} wei`);
        } else {
            console.log(`gasPrice   : ${fee.gasPrice ?? 0n} wei`);
        }
        console.log("=============================");
    }

    // === tx 비용 측정 헬퍼 ===
    async function measureTx<T extends { wait: (confirms?: number) => Promise<any> }>(
        txPromise: Promise<T>
    ) {
        const tx = await txPromise;
        const receipt = await tx.wait(); // 1 confirmation
        const gasUsed: bigint = receipt.gasUsed; // bigint
        let effectiveGasPrice: bigint | null = receipt.effectiveGasPrice ?? null;
        if (effectiveGasPrice == null) {
            const fd = await ethers.provider.getFeeData();
            effectiveGasPrice = (fd.gasPrice ?? fd.maxFeePerGas ?? 0n);
        }

        const feeWei = gasUsed * effectiveGasPrice;
        return {
            txHash: receipt.transactionHash,
            gasUsed,
            effectiveGasPrice,
            feeWei,
        };
    }

    // 보기 좋게 출력
    function prettyCost(
        label: string,
        c: { gasUsed: bigint; effectiveGasPrice: bigint; feeWei: bigint }
    ) {
        const gwei = Number(c.effectiveGasPrice) / 1e9;
        const eth = Number(c.feeWei) / 1e18; // (큰 수면 소수 정밀도 깨질 수 있음 → 로그용)
        console.log(
            `[${label}] gasUsed=${c.gasUsed} | gasPrice≈${gwei.toFixed(2)} gwei | fee≈${eth.toFixed(6)} ETH`
        );
    }


    async function deployFixture() {
        const [owner, guest, host, feeRecipient, admin] = await ethers.getSigners();

        // MockERC20 배포
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const mockUSDC: any = await MockERC20.deploy("Mock USDC", "USDC", USDC_DECIMALS);
        await mockUSDC.waitForDeployment();

        // NomadBooking 배포 (constructor: token, feeRecipient, graceSeconds, admin)
        const NomadBooking = await ethers.getContractFactory("NomadBooking");
        const nomadBooking: any = await NomadBooking.deploy(
            await mockUSDC.getAddress(),
            await feeRecipient.getAddress(),
            GRACE_SECONDS,
            await admin.getAddress()
        );
        await nomadBooking.waitForDeployment();

        // 게스트에 토큰 지급 + approve
        const mintAmount = ethers.parseUnits("1000", USDC_DECIMALS);
        await mockUSDC.mint(await guest.getAddress(), mintAmount);
        await mockUSDC.connect(guest).approve(await nomadBooking.getAddress(), ethers.MaxUint256);

        return { owner, guest, host, feeRecipient, admin, mockUSDC, nomadBooking };
    }

    describe("예약 Lock 기능", function () {
        it("게스트가 예약을 Lock하면 예약금이 컨트랙트에 보관된다", async function () {
            const { guest, host, mockUSDC, nomadBooking } = await loadFixture(deployFixture);

            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("reservation1"));

            const now = Number(await time.latest());
            const checkIn = now + 24 * 3600;
            const checkOut = now + 48 * 3600;

            await expect(
                nomadBooking.connect(guest).lock(resId, await host.getAddress(), amount, fee, checkIn, checkOut, defaultPolicy)
            )
                .to.emit(nomadBooking, "BookingLocked")
                .withArgs(resId, await guest.getAddress(), await host.getAddress(), amount, fee);

            const contractBal: BN = await mockUSDC.balanceOf(await nomadBooking.getAddress());
            expect(contractBal).to.equal(amount + fee);

            const booking = await nomadBooking.getBooking(resId);
            expect(booking.guest).to.equal(await guest.getAddress());
            expect(booking.host).to.equal(await host.getAddress());
            expect(booking.amount).to.equal(amount);
            expect(booking.fee).to.equal(fee);
            expect(booking.status).to.equal(1); // Locked
        });

        it("이미 존재하는 예약 ID로는 Lock 불가", async function () {
            const { guest, host, nomadBooking } = await loadFixture(deployFixture);

            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("reservation1"));

            const now = Number(await time.latest());
            const checkIn = now + 24 * 3600;
            const checkOut = now + 48 * 3600;

            await nomadBooking.connect(guest).lock(resId, await host.getAddress(), amount, fee, checkIn, checkOut, defaultPolicy);

            await expect(
                nomadBooking.connect(guest).lock(resId, await host.getAddress(), amount, fee, checkIn, checkOut, defaultPolicy)
            ).to.be.revertedWith("exists");
        });

        it("잘못된 파라미터로는 Lock 불가", async function () {
            const { guest, host, nomadBooking } = await loadFixture(deployFixture);

            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("reservation1"));

            const now = Number(await time.latest());
            const checkInWrong = now + 48 * 3600; // later
            const checkOutWrong = now + 24 * 3600; // earlier

            await expect(
                nomadBooking.connect(guest).lock(resId, await host.getAddress(), amount, fee, checkInWrong, checkOutWrong, defaultPolicy)
            ).to.be.revertedWith("time");

            await expect(
                nomadBooking.connect(guest).lock(resId, await host.getAddress(), 0, fee, now + 24 * 3600, now + 48 * 3600, defaultPolicy)
            ).to.be.revertedWith("params");
        });
    });

    describe("환불 기능", function () {
        async function createLockedBooking() {
            const fx = await loadFixture(deployFixture);
            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("test_reservation"));

            const now = Number(await time.latest());
            const checkIn = now + 24 * 3600;
            const checkOut = now + 48 * 3600;

            await fx.nomadBooking.connect(fx.guest).lock(
                resId,
                await fx.host.getAddress(),
                amount,
                fee,
                checkIn,
                checkOut,
                defaultPolicy
            );

            return { ...fx, resId, amount, fee, checkIn, checkOut };
        }

        it("체크인 전 조기 환불 가능", async function () {
            const { guest, nomadBooking, mockUSDC, resId, amount, fee } = await createLockedBooking();

            const before = await mockUSDC.balanceOf(await guest.getAddress());
            await expect(nomadBooking.connect(guest).refundEarly(resId))
                .to.emit(nomadBooking, "Refunded")
                .withArgs(resId, await guest.getAddress(), amount + fee);

            const after = await mockUSDC.balanceOf(await guest.getAddress());
            expect(after).to.equal(before + amount + fee);

            const booking = await nomadBooking.getBooking(resId);
            expect(booking.status).to.equal(3); // Refunded
        });

        it("체크인 후에는 조기 환불 불가", async function () {
            const { guest, nomadBooking, checkIn, resId } = await createLockedBooking();
            await time.increaseTo(checkIn + 1); // 체인 시간을 앞으로 이동
            await expect(nomadBooking.connect(guest).refundEarly(resId)).to.be.revertedWith("after-checkin");
        });

        it("정책 환불 정상 작동 (헬퍼 계산 적용)", async function () {
            const { guest, host, feeRecipient, mockUSDC, nomadBooking, resId, amount, fee, checkIn } =
                await createLockedBooking();

            const gBefore = await mockUSDC.balanceOf(await guest.getAddress());
            const hBefore = await mockUSDC.balanceOf(await host.getAddress());
            const tBefore = await mockUSDC.balanceOf(await feeRecipient.getAddress());

            await expect(nomadBooking.connect(guest).cancelWithPolicy(resId)).to.emit(
                nomadBooking,
                "CanceledWithPolicy"
            );

            // ✅ 현재 시각 기준으로 check-in까지 남은 시간에서 정책 퍼센트 계산
            const now2 = Number(await time.latest());
            const secsUntilCheckIn = checkIn - now2;
            const { amtPct, feePct } = pickPolicyPerc(secsUntilCheckIn);

            const gAfter = await mockUSDC.balanceOf(await guest.getAddress());
            const hAfter = await mockUSDC.balanceOf(await host.getAddress());
            const tAfter = await mockUSDC.balanceOf(await feeRecipient.getAddress());

            const expectedGuestRefund = (amount * amtPct) / 10000n;
            const expectedFeeRefund = (fee * feePct) / 10000n;
            const expectedHostPayment = amount - expectedGuestRefund;
            const expectedTreasury = fee - expectedFeeRefund;

            expect(gAfter).to.equal(gBefore + expectedGuestRefund + expectedFeeRefund);
            expect(hAfter).to.equal(hBefore + expectedHostPayment);
            expect(tAfter).to.equal(tBefore + expectedTreasury);
        });

        it("게스트가 아니면 조기 환불 불가", async function () {
            const { host, nomadBooking, resId } = await createLockedBooking();
            await expect(nomadBooking.connect(host).refundEarly(resId)).to.be.revertedWith("only-guest");
        });
    });

    describe("릴리즈 기능", function () {
        async function createShortBooking() {
            const fx = await loadFixture(deployFixture);
            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("short_reservation"));

            const now = Number(await time.latest());
            const checkIn = now + 1; // 곧바로
            const checkOut = now + 2;

            await fx.nomadBooking.connect(fx.guest).lock(
                resId,
                await fx.host.getAddress(),
                amount,
                fee,
                checkIn,
                checkOut,
                defaultPolicy
            );

            return { ...fx, resId, amount, fee, checkIn, checkOut };
        }

        it("체크아웃 직후(grace 내) 호스트만 릴리즈 가능", async function () {
            const { host, feeRecipient, mockUSDC, nomadBooking, resId, amount, fee, checkOut } = await createShortBooking();

            await time.increaseTo(checkOut + 1);

            const hBefore = await mockUSDC.balanceOf(await host.getAddress());
            const tBefore = await mockUSDC.balanceOf(await feeRecipient.getAddress());

            await expect(nomadBooking.connect(host).release(resId))
                .to.emit(nomadBooking, "Released")
                .withArgs(resId, await host.getAddress(), amount, await feeRecipient.getAddress(), fee);

            const hAfter = await mockUSDC.balanceOf(await host.getAddress());
            const tAfter = await mockUSDC.balanceOf(await feeRecipient.getAddress());
            expect(hAfter).to.equal(hBefore + amount);
            expect(tAfter).to.equal(tBefore + fee);
        });

        it("grace 내 비호스트 릴리즈 불가", async function () {
            const { guest, nomadBooking, resId, checkOut } = await createShortBooking();
            await time.increaseTo(checkOut + 1);
            await expect(nomadBooking.connect(guest).release(resId)).to.be.revertedWith("host-only");
        });

        it("grace 이후엔 누구나 릴리즈 가능", async function () {
            const { guest, host, nomadBooking, mockUSDC, resId, amount, checkOut } = await createShortBooking();
            await time.increaseTo(checkOut + GRACE_SECONDS + 1);

            // ❗ 컨트랙트에서 token() getter가 없을 수 있으므로 mockUSDC로 직접 확인
            const hBefore = await mockUSDC.balanceOf(await host.getAddress());

            await expect(nomadBooking.connect(guest).release(resId)).to.emit(nomadBooking, "Released");

            const hAfter = await mockUSDC.balanceOf(await host.getAddress());
            expect(hAfter).to.equal(hBefore + amount);
        });
    });

    describe("관리자 기능", function () {
        it("pause 중에는 예약 불가", async function () {
            const { admin, guest, host, nomadBooking } = await loadFixture(deployFixture);
            await nomadBooking.connect(admin).pause();

            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("paused_reservation"));

            const now = Number(await time.latest());
            await expect(
                nomadBooking.connect(guest).lock(
                    resId,
                    await host.getAddress(),
                    amount,
                    fee,
                    now + 24 * 3600,
                    now + 48 * 3600,
                    defaultPolicy
                )
            ).to.be.revertedWith("Pausable: paused");
        });

        it("unpause 후 다시 예약 가능", async function () {
            const { admin, guest, host, nomadBooking } = await loadFixture(deployFixture);
            await nomadBooking.connect(admin).pause();
            await nomadBooking.connect(admin).unpause();

            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("resume_reservation"));

            const now = Number(await time.latest());
            await expect(
                nomadBooking.connect(guest).lock(
                    resId,
                    await host.getAddress(),
                    amount,
                    fee,
                    now + 24 * 3600,
                    now + 48 * 3600,
                    defaultPolicy
                )
            ).to.emit(nomadBooking, "BookingLocked");
        });

        it("비관리자는 pause/unpause 불가", async function () {
            const { guest, host, nomadBooking } = await loadFixture(deployFixture);
            await expect(nomadBooking.connect(guest).pause()).to.be.revertedWith("only-admin");
            await expect(nomadBooking.connect(host).unpause()).to.be.revertedWith("only-admin");
        });
    });
    describe("비용 측정(Amoy/로컬 공통)", function () {
        it("lock / refundEarly / release 비용 측정", async function () {
            const { guest, host, feeRecipient, mockUSDC, nomadBooking } = await loadFixture(deployFixture);

            // 예약 파라미터
            const amount: BN = ethers.parseUnits("100", USDC_DECIMALS);
            const fee: BN = ethers.parseUnits("10", USDC_DECIMALS);
            const resId = ethers.keccak256(ethers.toUtf8Bytes("cost_bench"));

            const now = Number(await time.latest());
            const checkIn = now + 10;         // 10초 뒤
            const checkOut = now + 20;        // 20초 뒤

            // 1) lock
            const c1 = await measureTx(
                nomadBooking.connect(guest).lock(
                    resId,
                    await host.getAddress(),
                    amount,
                    fee,
                    checkIn,
                    checkOut,
                    defaultPolicy
                )
            );
            prettyCost("lock", c1);

            // 2) refundEarly (체크인 전)
            const c2 = await measureTx(
                nomadBooking.connect(guest).refundEarly(resId)
            );
            prettyCost("refundEarly", c2);

            // 다시 락 잡고 release 측정
            const resId2 = ethers.keccak256(ethers.toUtf8Bytes("cost_bench_2"));
            await nomadBooking.connect(guest).lock(
                resId2,
                await host.getAddress(),
                amount,
                fee,
                now + 5,
                now + 6,
                defaultPolicy
            );

            // 체크아웃 + grace 후로 이동 → 누구나 release 가능
            await time.increaseTo(now + 6 + GRACE_SECONDS + 1);

            // 3) release
            const c3 = await measureTx(
                nomadBooking.connect(guest).release(resId2)
            );
            prettyCost("release", c3);

            // 간단 검증
            const hBal = await mockUSDC.balanceOf(await host.getAddress());
            expect(hBal).to.be.greaterThan(0n);
        });
    });

});
