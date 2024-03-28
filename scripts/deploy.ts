import hre from "hardhat"; //contains ethers library to interact with our smart contract

async function main() {
    const MataraToken = await hre.ethers.getContractFactory("MataraToken");
    const mataraToken = await MataraToken.deploy(100000000, 50); //100M

    await mataraToken.waitForDeployment();
    console.log("Matara Token deployed: ", await mataraToken.getAddress());
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})