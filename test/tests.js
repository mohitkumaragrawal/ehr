import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

// const { expect } = require("chai");
// const { ethers } = require("hardhat");

describe("HealthContractCaller", function () {
  it("Should call the function and return the result", async function () {
    const HealthContractCaller = await hardhat.ethers.getContractFactory(
      "HealthContractCaller"
    );
    const healthContractCaller = await HealthContractCaller.deploy();

    // await healthContractCaller.deployed();

    const result = await healthContractCaller.heartRateMonitor(10, 20, 50);
    expect(result).to.equal(1);

    // expect(await healthContractCaller.heartRateMonitor(40, 20, 50)).to.equal(0);
  });
});

// describe("FireMen", function () {
//   it("should mint and transfer and nft to someone", async function () {
//     const [owner, account1, account2, account3] =
//       await hardhat.ethers.getSigners();

//     const FireMen = await hardhat.ethers.getContractFactory("FireMen");
//     const firemen = await FireMen.deploy(owner.address);

//     expect(await firemen.balanceOf(account1.address)).to.equal(0);

//     const tx = await firemen.payToMint(account1.address, "testuri", {
//       value: ethers.parseEther("0.3"),
//     });

//     expect(await firemen.balanceOf(account1.address)).to.equal(1);

//     // now send the token to account2;

//     const newTokenId = 0;

//     const tokenOwner = await firemen.ownerOf(newTokenId);
//     expect(tokenOwner).to.equal(account1.address);

//     // await firemen.connect(account1).approve(account2.address, newTokenId);
//     await firemen
//       .connect(account1)
//       .transferFrom(account1.address, account2.address, newTokenId);

//     // check balance of both accounts;
//     expect(await firemen.balanceOf(account1.address)).to.equal(0);
//     expect(await firemen.balanceOf(account2.address)).to.equal(1);

//     // transfer it back to account1;

//     await firemen
//       .connect(account2)
//       .transferFrom(account2.address, account1.address, newTokenId);

//     // check the balance of account1;
//     expect(await firemen.balanceOf(account1.address)).to.equal(1);

//     // now let's try to host an auction
//     const EnglishAuction = await hardhat.ethers.getContractFactory(
//       "EnglishAuction"
//     );

//     const englishAuction = await EnglishAuction.connect(account1).deploy(
//       firemen.target,
//       newTokenId,
//       ethers.parseEther("0.1")
//     );

//     // first approve the auction contract to spend the token;
//     await firemen.connect(account1).approve(englishAuction.target, newTokenId);

//     // start the auction;
//     await englishAuction.connect(account1).start(6);

//     // now check the balance of the auction contract;
//     expect(await firemen.balanceOf(englishAuction.target)).to.equal(1);
//     expect(await firemen.ownerOf(newTokenId)).to.equal(englishAuction.target);

//     // now let's bid some ehters on the auction;

//     await englishAuction.connect(account2).bid({
//       value: ethers.parseEther("0.2"),
//     });

//     await englishAuction.connect(account3).bid({
//       value: ethers.parseEther("0.3"),
//     });

//     await englishAuction.connect(account2).bid({
//       value: ethers.parseEther("0.4"),
//     });

//     const result = await englishAuction.highestBid();
//     console.log("H: ", ethers.formatEther(result));

//     const result2 = await englishAuction.highestBidder();
//     console.log("HB: ", result2);

//     const timeLeft = await englishAuction.getEndTime();
//     console.log("time left: ", timeLeft.toString());

//     // wait for the auction to end;
//     await new Promise((resolve) => setTimeout(resolve, 5100));

//     // after that let's call the end method;
//     await englishAuction.connect(account1).end();

//     // the smart contract shouldn't have anything left;
//     expect(await firemen.balanceOf(englishAuction.target)).to.equal(0);
//     expect(await firemen.ownerOf(newTokenId)).to.equal(account2.address);

//     // now let's check the bids values
//   });
// });
