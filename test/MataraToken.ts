import {expect} from "chai";
import hre from "hardhat"; //contains ethers library to interact with our smart contract
import {MataraToken} from "../typechain-types";
import {Signer} from "ethers";

describe("MataraToken contract", function () {
    //global vars
    let Token;
    let mataraToken: MataraToken;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    let tokenCap = 100000000;
    let tokenBlockReward = 50;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Token = await hre.ethers.getContractFactory("MataraToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        mataraToken = await Token.deploy(tokenCap, tokenBlockReward);
    })

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await mataraToken.owner()).to.equal(await owner.getAddress());
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await mataraToken.balanceOf(await owner.getAddress());
            expect(await mataraToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the max capped supply to the argument provided during deployment", async function () {
            const cap = await mataraToken.cap();
            expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
        });

        it("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await mataraToken.blockReward();
            expect(Number(hre.ethers.formatEther(blockReward))).to.equal(tokenBlockReward);
        })
    })

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await mataraToken.transfer(addr1.getAddress(), 50);
            const addr1Balance = await mataraToken.balanceOf(addr1.getAddress());
            expect(addr1Balance).to.equal(50);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await mataraToken.connect(addr1).transfer(addr2.getAddress(), 50);
            const addr2Balance = await mataraToken.balanceOf(addr2.getAddress());
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await mataraToken.balanceOf(owner.getAddress());
            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                mataraToken.connect(addr1).transfer(owner.getAddress(), 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance shouldn't have changed.
            expect(await mataraToken.balanceOf(owner.getAddress())).to.equal(
                initialOwnerBalance
            );
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await mataraToken.balanceOf(owner.getAddress());

            // Transfer 100 tokens from owner to addr1.
            await mataraToken.transfer(addr1.getAddress(), 100);

            // Transfer another 50 tokens from owner to addr2.
            await mataraToken.transfer(addr2.getAddress(), 50);

            // Check balances.
            const finalOwnerBalance = await mataraToken.balanceOf(owner.getAddress());
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

            const addr1Balance = await mataraToken.balanceOf(addr1.getAddress());
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await mataraToken.balanceOf(addr2.getAddress());
            expect(addr2Balance).to.equal(50);
        });
    });
});