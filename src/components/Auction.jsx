import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import EnglishAuction from "../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json";
import NFTImage from "./NFTImage";
import { Button, Input } from "@nextui-org/react";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

export default function Auction() {
  const { address } = useParams();

  const auctionContractRef = useRef(null);

  // const [auctionContract, setAuctionContract] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const [tokenId, setTokenId] = useState(null);
  const [seller, setSeller] = useState("");

  const [bidAmount, setBidAmount] = useState(0.05);

  const intervalRef = useRef(null);

  const getAuctionContract = async () => {
    const contract = new ethers.Contract(address, EnglishAuction.abi, signer);
    auctionContractRef.current = contract;

    const tokenId = await contract.nftId();
    setTokenId(Number(tokenId));

    const seller = await contract.seller();
    setSeller(seller);

    const endTime = await contract.endAt();
    const currentTime = Math.floor(Date.now() / 1000);
    setTimeLeft(Number(endTime) - currentTime);

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
  };

  const getHighestBid = async () => {
    const hBid = await auctionContractRef.current.highestBid();
    setHighestBid(ethers.formatEther(hBid));

    const hBidder = await auctionContractRef.current.highestBidder();
    setHighestBidder(hBidder);
  };

  const handleBidding = async () => {
    const valueToSend = ethers.parseEther(bidAmount.toString());
    await auctionContractRef.current.bid({ value: valueToSend });
  };

  const handleEnding = async () => {
    await auctionContractRef.current.end();
  };

  useEffect(() => {
    if (!address) return;

    const getStuff = async () => {
      await getAuctionContract();
      await getHighestBid();
    };
    getStuff();
  }, [address]);

  return (
    <>
      <div className="flex gap-3 justify-center max-w-5xl mx-auto my-20 px-20">
        <div className="flex-grow-[2]">
          <h1 className="text-3xl font-bold">Ongoing Auction</h1>

          <div className="mt-5">
            Seller:
            <p className="text-gray-500 uppercase mb-3">{seller}</p>
            Current Signer:
            <p className="text-gray-500 uppercase mb-3">{signer.address}</p>
            Highest Bidder:
            <p className="text-gray-500 uppercase mb-3">{highestBidder}</p>
            Highest Bid:
            <p className="text-gray-500 uppercase mb-3">{highestBid} ETH</p>
            Time Left:
            <p className="text-gray-500 uppercase mb-3">
              {Math.max(0, timeLeft)} seconds
            </p>
          </div>
        </div>
        <div className="flex-1 mx-auto">
          <NFTImage tokenId={tokenId} canAuction={false} />
        </div>
      </div>

      <div className="flex gap-3 justify-center max-w-5xl mx-auto my-20 px-20 items-center">
        <Input
          type="number"
          label="Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <Button onClick={handleBidding}>Bid</Button>
      </div>

      <div className="flex gap-3 justify-center max-w-5xl mx-auto my-20 px-20 items-center">
        <Button onClick={handleEnding}>End Auction</Button>
      </div>
    </>
  );
}
