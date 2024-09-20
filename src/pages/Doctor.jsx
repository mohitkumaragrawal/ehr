import { Input, Button } from "@nextui-org/react";

import { ethers } from "ethers";
import contracts from "../contracts.json";

import Ehr from "../artifacts/contracts/EHR.sol/EHR.json";
import { useEffect, useState } from "react";

import * as ipfs from "../ipfs";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const ehr = new ethers.Contract(contracts.ehr, Ehr.abi, signer);

function HealthRecord({ name, hash }) {
  return (
    <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-md">
      <a
        href={`http://localhost:8080/ipfs/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        <h1 className="text-xl flex justify-between w-full">
          <div className="font-bold">Health Record File</div>
          <div className="opacity-70">{name}</div>
        </h1>
      </a>
    </div>
  );
}

export default function Doctor() {
  const [doctorData, setDoctorData] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // get the doctor hash;
    const fetchData = async () => {
      const isDoc = await ehr.isDr(signer.address);
      if (!isDoc) {
        alert("You are not a doctor");
        window.location.href = "/";
      }

      const hash = await ehr.getDr(signer.address);
      console.log("Doctor hash:", hash);

      // fetch
      const res = await fetch("http://localhost:8080/ipfs/" + hash);
      const data = await res.json();
      console.log(data);

      setDoctorData(data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // first check if the doctor has access
    // if not access then request access
    // else show the user details;

    const hasAccess = await ehr.hasPermission(userAddress, signer.address);
    console.log("Has access:", hasAccess);

    // hit ipfs server to get the user data

    ehr.connect(signer.address);

    if (!hasAccess) {
      console.log("Requesting access");
      const res = await ehr.requestPermission(userAddress);
      await res.wait();
    } else {
      // get the user data;
      const userHash = await ehr.getAuthorizedUserHash(userAddress);

      const data = await ipfs.getJson(userHash);
      setUserData(data);
    }

    // if (hasAccess) {
    //   const data = await ehr.getAuthorizedUserHash(userAddress);
    //   console.log("user data: ", data);
    // } else {
    //   console.log("Requesting access");
    //   const res = await ehr.requestPermission(userAddress);
    //   alert("Request sent to the user, waiting for their response...", res);
    // }
  };

  if (!doctorData) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="flex flex-col mx-auto max-w-6xl py-10">
        <div className="rounded-md bg-zinc-800 p-4 text-center flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <div
            className="w-36 h-36 mt-6 rounded-full border-2 border-gray-500"
            style={{
              backgroundImage: `url(http://localhost:8080/ipfs/${doctorData?.profilePic})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <p>{doctorData.name}</p>
          <p>Account : {doctorData.address}</p>
        </div>

        <div className="mt-10">
          <h1 className="text-2xl font-bold">Access Patient Health Record</h1>

          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Patient Address"
              className="w-full"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
            <div className="flex flex-row-reverse">
              <Button color="warning" type="submit">
                Request Access
              </Button>
            </div>
          </form>
        </div>

        {userData && (
          <div className="mt-10 flex gap-5 flex-col">
            {userData.healthRecords.map((r) => (
              <HealthRecord name={r.name} hash={r.hash} key={r.hash} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
