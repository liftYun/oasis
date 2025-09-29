import hre, { ethers } from "hardhat";
import type { TransactionResponse } from "ethers";

type BN = bigint;
const USDC_DECIMALS = 6;

// ★ 데모용: 긴 대기 방지
const GRACE_SECONDS = Number(process.env.GRACE_SECONDS ?? "12");

// 배너
async function banner() {
    const net = await ethers.provider.getNetwork();
    const fee = await ethers.provider.getFeeData();
    const latest = await ethers.provider.getBlock("latest");
    console.log("========== Network ==========");
    console.log(`name      : ${hre.network.name}`);
    console.log(`chainId   : ${net.chainId.toString()}`);
    console.log(`eip-1559  : ${latest?.baseFeePerGas != null ? "yes" : "no"}`);
    console.log(`fee(max/maxPrio): ${fee.maxFeePerGas ?? 0n} / ${fee.maxPriorityFeePerGas ?? 0n} wei`);
    console.log(`baseFee    : ${latest?.baseFeePerGas ?? 0n} wei`);
    console.log("=============================\n");
}

async function isContract(addr: string) {
    const code = await ethers.provider.getCode(addr);
    return code && code !== "0x";
}

async function fundIfEOA(from: any, to: string, eth: string) {
    if (await isContract(to)) {
        console.log(`(skip funding ${to}) contract address detected`);
        return;
    }
    const tx = await from.sendTransaction({ to, value: ethers.parseEther(eth) });
    await tx.wait();
}

// 벽시계(ms) 측정
async function timeTx(
    label: string,
    txPromise: Promise<TransactionResponse>
) {
    const t0 = Date.now();
    const tx = await txPromise;
    const sentAt = Date.now();
    const receipt = await tx.wait(); // 1 confirmation
    const minedAt = Date.now();

    const wallSendMs = sentAt - t0;
    const wallMineMs = minedAt - sentAt;

    if (!receipt) {
        throw new Error("Transaction receipt is null");
    }
    const gasUsed: BN = receipt.gasUsed;
    const egp: BN =
        (receipt as any).effectiveGasPrice ??
        (await ethers.provider.getFeeData()).gasPrice ??
        0n;

    const block = await ethers.provider.getBlock(receipt.blockNumber);
    const baseFee = block?.baseFeePerGas ?? 0n;

    // tx.hash는 TransactionResponse에서 안전하게 접근 가능합니다.
    console.log(`[${label}] hash=${tx.hash}`);
    console.log(
        `  전송=${wallSendMs}ms, 채굴=${wallMineMs}ms (총=${wallSendMs + wallMineMs}ms)`
    );
    console.log(
        `  사용 가스=${gasUsed} | 유효 가스 가격≈${Number(egp) / 1e9} Gwei | 수수료≈${Number(gasUsed * egp) / 1e18} ETH`
    );
    console.log(`  블록=${receipt.blockNumber} | 기본 수수료=${baseFee} wei\n`);

    return { wallMineMs, gasUsed, egp };
}

function policy() {
    return {
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
}

function q(arr: number[], p: number) {
    const a = [...arr].sort((x, y) => x - y);
    const i = Math.min(a.length - 1, Math.max(0, Math.floor(p * (a.length - 1))));
    return a[i];
}
async function main() {
    await banner();

    const provider = ethers.provider;
    const owner = new ethers.Wallet(process.env.PRIVATE_KEY_OWNER!, provider);
    const guest = new ethers.Wallet(process.env.PRIVATE_KEY_GUEST!, provider);
    // Correctly initialize host as a new random wallet, not the owner
    const host = ethers.Wallet.createRandom().connect(provider);

    if (!owner || !guest) {
        throw new Error("환경 변수 PRIVATE_KEY_OWNER와 PRIVATE_KEY_GUEST를 확인해주세요.");
    }

    const feeRecipient = ethers.Wallet.createRandom().connect(provider);

    console.log("roles:");
    console.log(`  owner        : ${await owner.getAddress()}`);
    console.log(`  guest        : ${guest.address}`);
    console.log(`  host         : ${host.address}`); // This will be a new, random address
    console.log(`  feeRecipient : ${feeRecipient.address}\n`);

    // Fund all EOA wallets with MATIC for gas fees
    await fundIfEOA(owner, guest.address, "0.05");
    await fundIfEOA(owner, host.address, "0.02"); // This will now fund the new host wallet
    await fundIfEOA(owner, feeRecipient.address, "0.01");

    // Deploy NomadBooking or use existing one
    const usdcAddrEnv = process.env.USDC_ADDRESS ?? "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
    const bookingAddrEnv = process.env.NOMAD_BOOKING ?? "";

    let usdcAddr: string = usdcAddrEnv;
    let bookingAddr: string;

    if (bookingAddrEnv) {
        bookingAddr = bookingAddrEnv;
        console.log(`기존 컨트랙트 사용:\n  USDC: ${usdcAddr}\n  Booking: ${bookingAddr}\n`);
    } else {
        const NomadBooking = await ethers.getContractFactory("NomadBooking", owner);
        const nomadBooking: any = await NomadBooking.deploy(
            usdcAddr,
            feeRecipient.address,
            GRACE_SECONDS,
            await owner.getAddress()
        );
        await nomadBooking.waitForDeployment();
        bookingAddr = await nomadBooking.getAddress();
        console.log(`배포 완료:\n  USDC: ${usdcAddr}\n  Booking: ${bookingAddr}\n`);
    }

    // Get USDC and NomadBooking contract instances
    const usdc = await ethers.getContractAt("IERC20", usdcAddr, owner);
    const booking = await ethers.getContractAt("NomadBooking", bookingAddr, owner);

    // Guest needs to approve the booking contract to spend their USDC
    console.log("Approving NomadBooking contract to spend guest's USDC...");
    const approveTx = await usdc.connect(guest).approve(bookingAddr, ethers.MaxUint256);
    await approveTx.wait();
    console.log("Approval successful.");

    const amount = ethers.parseUnits("1", USDC_DECIMALS);
    const feeAmt = ethers.parseUnits("0", USDC_DECIMALS);

    const N = Number(process.env.N ?? "3");
    const latencies: number[] = [];

    for (let i = 0; i < N; i++) {
        console.log(`--- iteration ${i + 1}/${N} ---`);
        const now = Math.floor(Date.now() / 1000);
        const resId = ethers.keccak256(ethers.toUtf8Bytes(`res-${Date.now()}-${i}`));
        const checkIn = now + 10;
        const checkOut = now + 20;

        // 1) lock
        const r1 = await timeTx(
            "lock",
            booking.connect(guest).lock(resId, host.address, amount, feeAmt, checkIn, checkOut, policy())
        );
        latencies.push(r1.wallMineMs);

        // ... (The rest of your code)
    }

    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    console.log(`=== latency summary (ms) ===`);
    console.log(
        `count=${latencies.length} | avg=${avg.toFixed(1)} | p50=${q(latencies, 0.5).toFixed(1)} | p95=${q(latencies, 0.95).toFixed(1)}`
    );
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});