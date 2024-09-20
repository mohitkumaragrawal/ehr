import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";

import { ethers } from "ethers";
import contracts from "../contracts.json";

import Ehr from "../artifacts/contracts/EHR.sol/EHR.json";

import { uploadFile, uploadJson } from "../ipfs";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const ehr = new ethers.Contract(contracts.ehr, Ehr.abi, signer);

export default function AddDoctor() {
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    profilePic: null,
  });

  const checkAdmin = async () => {
    ehr.connect(signer.address);
    const isAdmin = await ehr.isAdmin();

    if (!isAdmin) {
      alert("Only admins can add doctor");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      ehr.connect(signer.address);
      // console.log(formState);
      console.log("Uploading doctor image..");

      const profileHash = await uploadFile(formState.profilePic);
      console.log("Doctor image uploaded to IPFS. CID:", profileHash);

      const doctorData = {
        name: formState.name,
        address: formState.address,
        profilePic: profileHash,
      };

      const doctorHash = await uploadJson(doctorData);
      console.log("Doctor data uploaded to IPFS. CID:", doctorHash);

      console.log("Adding doctor to blockchain...");
      const result = await ehr.addDrInfo(formState.address, doctorHash);
      await result.wait();

      console.log("Doctor added successfully!");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <main>
      <div className="flex flex-col mx-auto max-w-6xl py-10">
        <h1 className="text-3xl font-bold">Add Doctor</h1>

        <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Doctor's Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            className="w-full"
          />
          <Input
            isRequired
            label="Doctor's Address"
            value={formState.address}
            onChange={(e) =>
              setFormState({ ...formState, address: e.target.value })
            }
            className="w-full"
          />

          <Input
            isRequired
            label="Email"
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            className="w-full"
          />

          <div className="flex gap-4 items-center rounded-lg bg-zinc-800 px-4 py-3">
            <label htmlFor="profilePic" className="text-sm font-semibold">
              Profile Picture
            </label>

            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={(e) =>
                setFormState({ ...formState, profilePic: e.target.files[0] })
              }
            />
          </div>

          <div className="flex flex-row-reverse mt-4">
            <Button type="submit" color="warning">
              Add Doctor
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
