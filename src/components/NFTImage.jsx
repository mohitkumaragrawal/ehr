import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";

import Mystery from "../assets/mystery.jpg";

import FireMen from "../artifacts/contracts/FireMen.sol/FireMen.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { IPFS_CONTENT_ID, NFT_CONTRACT_ADDRESS } from "../environment";
import { Link } from "react-router-dom";

const contractAddress = NFT_CONTRACT_ADDRESS;
const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, FireMen.abi, signer);

export default function NFTImage({ tokenId, handleMint, canAuction }) {
  const contentId = IPFS_CONTENT_ID;
  const metadataURI = `${contentId}/${tokenId}.json`;

  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted, tokenId]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    setIsMinted(result);
  };

  const mintToken = async () => {
    contract.connect(signer.address);
    const addr = signer.address;

    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.parseEther("0.25"),
    });
    await result.wait();
    getMintedStatus();
    handleMint();
  };

  const getUri = async () => {
    const uri = await contract.tokenURI(tokenId);
    const owner = await contract.ownerOf(tokenId);
    console.log(owner);
    console.log(uri);
  };

  if (!isMinted) {
    return (
      <Card>
        <CardHeader>Not Minted</CardHeader>
        <CardBody>
          <Image
            alt="NFT Image"
            className="object-cover rounded-xl"
            src={Mystery}
            width={270}
          />
        </CardBody>
        <CardFooter>
          <Button onClick={mintToken}>Mint</Button>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader>ID #{tokenId}</CardHeader>
        <CardBody>
          <Image
            alt="NFT Image"
            className="object-cover rounded-xl"
            src={imageURI}
            width={270}
          />
        </CardBody>
        <CardFooter className="flex gap-3">
          <Button className="w-full" onClick={getUri}>
            Taken! Show URI
          </Button>
          {canAuction && (
            <Link to={`/startAuction/${tokenId}`}>
              <Button>Auction</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    );
  }
}
