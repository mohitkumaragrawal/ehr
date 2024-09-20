import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@nextui-org/react";

export default function WalletBalance() {
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log(account);

    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log(provider);

    const balance = await provider.getBalance(account);
    console.log(balance);

    setBalance(parseFloat(ethers.formatEther(balance)).toFixed(3));
  };

  return (
    <div className="flex flex-col bg-gray-900 px-4 py-2 rounded-md">
      {balance === "" ? (
        <Button onClick={getBalance}>Get Balance</Button>
      ) : (
        <div className="flex gap-3 items-center">
          <span>Balance: {balance} ETH</span>
          <Button onClick={getBalance}>Get Balance</Button>
        </div>
      )}
    </div>
  );
}
