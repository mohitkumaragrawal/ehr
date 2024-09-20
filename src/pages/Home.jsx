import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import contracts from "../contracts.json";

import Ehr from "../artifacts/contracts/EHR.sol/EHR.json";
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

function DoctorRequest({ doctorAddress }) {
  const [doctorData, setDoctorData] = useState(null);

  const fetchData = async () => {
    console.log("GOT: ", doctorAddress);
    const isDoc = await ehr.isDr(doctorAddress);
    if (!isDoc) {
      setDoctorData(null);
      return;
    }

    const hash = await ehr.getDr(doctorAddress);
    console.log("Doctor hash:", hash);

    // fetch
    const res = await fetch("http://localhost:8080/ipfs/" + hash);
    const data = await res.json();
    console.log(data);

    setDoctorData(data);
  };

  useEffect(() => {
    fetchData();
  }, [doctorAddress]);

  const handleApprove = async () => {
    ehr.connect(signer.address);

    const res = await ehr.grantPermission(doctorAddress);
    await res.wait();

    alert("Permission granted");
  };

  if (doctorData == null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-md">
      <div className="flex gap-3 items-center">
        <div
          className="w-36 h-36 mt-6 rounded-full border-2 border-gray-500"
          style={{
            backgroundImage: `url(http://localhost:8080/ipfs/${doctorData?.profilePic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div>
          <p>{doctorData.name}</p>
          <p>Account : {doctorData.address}</p>
        </div>
      </div>
      <div className="flex gap-4 flex-row-reverse">
        <Button color="success" onClick={handleApprove}>
          Approve
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [userData, setUserData] = useState(null);

  const fetchRequests = async () => {
    ehr.connect(signer.address);
    const reqs = await ehr.getPendingDoctors();
    console.log(reqs);

    setRequests(reqs);
  };

  const fetchUser = async () => {
    ehr.connect(signer.address);
    const data = await ehr.getUserHash();
    console.log(data);

    if (!data) {
      setUserData({ healthRecords: [] });
    } else {
      const j = await ipfs.getJson(data);
      if (j) {
        console.log(j);
        setUserData(j);
      } else {
        setUserData({ healthRecords: [] });
      }
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchUser();
  }, []);

  // const uploadFile = async () => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   fetch("http://localhost:5001/api/v0/add", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("IPFS hash:", data.Hash);
  //       alert("File uploaded successfully! IPFS hash: " + data.Hash);
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading file:", error);
  //     });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file == null) {
      alert("Please select a file to upload");
      return;
    }

    console.log(file);
    console.log("Uploading file...");
    // uploadFile();

    const fileHash = await ipfs.uploadFile(file);

    console.log("File uploaded to IPFS. CID:", fileHash);

    const newUserData = {
      healthRecords: [
        ...userData.healthRecords,
        {
          name: file.name,
          hash: fileHash,
        },
      ],
    };

    const userHash = await ipfs.uploadJson(newUserData);
    console.log("User data uploaded to IPFS. CID:", userHash);

    // write it to the smart contract !!
    const res = await ehr.setUserHash(userHash);
    await res.wait();

    setUserData(newUserData);
    console.log("User data updated successfully!");
  };

  if (userData == null) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="mt-10 mb-5 text-lg font-bold mx-auto max-w-6xl">
        Your Address: {signer.address}
      </div>

      <div className="flex flex-col mx-auto max-w-6xl py-10">
        <h1 className="text-3xl font-bold">Upload Your Health Data</h1>

        <div>
          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
            <input
              type="file"
              id="file"
              name="file"
              className="rounded-md p-2 w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button color="warning" type="submit">
              Upload
            </Button>{" "}
          </form>{" "}
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-bold">Your Health Records</h1>

          <div className="flex flex-col flex-wrap gap-4 mt-6">
            {userData.healthRecords.map((r) => (
              <HealthRecord name={r.name} hash={r.hash} key={r.hash} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-bold">Pending Requests From Doctors</h1>

          <div className="flex flex-col flex-wrap gap-4 mt-6">
            {requests.map((r) => (
              <DoctorRequest doctorAddress={r} key={r} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
