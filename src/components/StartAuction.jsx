import { useParams } from "react-router-dom";
import NFTImage from "./NFTImage";
import { Button, Input } from "@nextui-org/react";

import FireMen from "../artifacts/contracts/FireMen.sol/FireMen.json";
import EnglishAuction from "../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { NFT_CONTRACT_ADDRESS } from "../environment";

const contractAddress = NFT_CONTRACT_ADDRESS;
const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, FireMen.abi, signer);

const DEFAULT_DURATION = 6000;

export default function StartAuction() {
  const { tokenId } = useParams();

  const [signerAddress, setSignerAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");

  const [duration, setDuration] = useState(DEFAULT_DURATION);

  const [message, setMessage] = useState("");

  const getSigner = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setSignerAddress(account);
  };

  const getOwner = async () => {
    const result = await contract.ownerOf(tokenId);
    setOwnerAddress(result);
  };

  const deployAuctionContract = async () => {
    const EnglishAuctionFactory = new ethers.ContractFactory(
      EnglishAuction.abi,
      EnglishAuction.bytecode,
      signer
    );

    const auctionContract = await EnglishAuctionFactory.deploy(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      ethers.parseEther("0.05")
    );

    console.log(auctionContract.target);

    // we need to first approve the contract
    await contract.approve(auctionContract.target, tokenId);

    // now start the auction

    await auctionContract.start(duration);

    setMessage(
      `Auction started at ${auctionContract.target} for ${duration} seconds. Link: http://localhost:5173/auction/${auctionContract.target}, Go to that link and share it to your participants.`
    );
  };

  useEffect(() => {
    getSigner();
    getOwner();
  }, []);

  return (
    <>
      <div className="flex gap-3 justify-center max-w-5xl mx-auto my-20 px-20">
        <div className="flex-grow-[2]">
          <h1 className="text-3xl font-bold">Start Auction</h1>

          <div className="mt-5">
            Owned By:
            <p className="text-gray-500 uppercase">{ownerAddress}</p>
            Current Signer:
            <p className="text-gray-500 uppercase">{signerAddress}</p>
          </div>

          {signerAddress.toLowerCase() === ownerAddress.toLowerCase() ? (
            <>
              <Input
                type="number"
                isRequired
                label="Duration (in seconds)"
                defaultValue={duration}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-7"
              />

              <Button
                className="mt-5"
                onClick={deployAuctionContract}
                disabled={duration < 10}
              >
                Start Auction
              </Button>
            </>
          ) : (
            <p className="text-red-500">
              Only the owner of the NFT can start an auction.
            </p>
          )}
        </div>
        <div className="flex-1 mx-auto">
          <NFTImage tokenId={tokenId} canAuction={false} />
        </div>
      </div>
      <p className="max-w-5xl mx-auto my-20 px-20">{message}</p>
    </>
  );
}
