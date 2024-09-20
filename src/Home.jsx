import NFTImage from "./components/NFTImage";

import { ethers } from "ethers";
import FireMen from "./artifacts/contracts/FireMen.sol/FireMen.json";
import { useEffect, useState } from "react";

import { NFT_CONTRACT_ADDRESS } from "./environment";

const contractAddress = NFT_CONTRACT_ADDRESS;
const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();
const contract = new ethers.Contract(contractAddress, FireMen.abi, signer);

function Home() {
  const [count, setCount] = useState(0);
  const getCount = async () => {
    const cnt = await contract.count();
    setCount(Number(cnt));
  };

  const handleMint = () => {
    setCount((cnt) => cnt + 1);
  };

  useEffect(() => {
    getCount();
  }, [count]);

  const minted = [];
  for (let i = 0; i < Number(count) + 1; ++i) {
    minted.push(i);
  }

  return (
    <main>
      <div className="flex flex-wrap gap-3 mx-auto max-w-6xl items-center justify-center py-10">
        {minted.map((idx) => (
          <NFTImage
            key={idx}
            tokenId={idx}
            handleMint={handleMint}
            canAuction={true}
          />
        ))}
      </div>
    </main>
  );
}

export default Home;
