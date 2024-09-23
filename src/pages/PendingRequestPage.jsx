import { useState, useEffect } from "react";
import { Spinner, Button } from "@nextui-org/react";
import Container from "../components/Container";
import { useSmartContracts } from "../SmartContractProvider";

import { getKeyPair, encryptSymmetricKey, decryptSymmetricKey } from "../utils";

const PendingRequestsPage = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const smartContractContext = useSmartContracts();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const signer = smartContractContext.signer;
      const dataContract = smartContractContext.contracts.DataContract;
      const permissionsContract =
        smartContractContext.contracts.PermissionContract;
      const registryContract = smartContractContext.contracts.RegistryContract;

      if (!permissionsContract) return;

      const requests = await permissionsContract.getPendingRequests();

      console.log("requests: ", requests);

      let requestWithFiles = [];
      const myData = await registryContract.checkUser(signer.address);
      const publicKey = myData[2];

      console.log("Public Key: ", publicKey);

      if (requests) {
        for (let i = 0; i < requests.length; i++) {
          const request = requests[i];

          const file = await dataContract.searchData(
            request.fileHash,
            publicKey
          );
          requestWithFiles.push({ request: requests[i], file });
        }
      }

      console.log("Request WIth Files:", requestWithFiles);
      setRequests(requestWithFiles);

      setLoading(false);
    };
    fetchData();
  }, [smartContractContext]);

  const handleApprove = async (request, index) => {
    setLoading(true);
    const signer = smartContractContext.signer;
    const permissionsContract =
      smartContractContext.contracts.PermissionContract;
    const registryContract = smartContractContext.contracts.RegistryContract;

    // decrypt the symmetric key
    const keyPair = getKeyPair(signer.address);
    const symmetricKey = await decryptSymmetricKey(
      request.file.encryptedSymmetricKey,
      keyPair.privateKey
    );

    console.log("Symmetric Key: ", symmetricKey);

    // encrypt it back with the requester's public key
    const requesterData = await registryContract.checkUser(
      request.request.requester
    );
    console.log("Requester Data: ", requesterData);
    console.log("Requester Pulbic Key: ", requesterData[2]);

    const requesterPublicKey = JSON.parse(requesterData[2]);

    console.log("Requester Public Key: ", requesterPublicKey);

    const encryptedSymmetricKey = await encryptSymmetricKey(
      symmetricKey,
      requesterPublicKey
    );

    console.log("Encrypted Symmetric Key: ", encryptedSymmetricKey);

    // call the grantPermission method
    const tx = await permissionsContract.grantPermission(
      index,
      encryptedSymmetricKey
    );
    await tx.wait();

    alert("Permission granted successfully");
  };

  return (
    <Container>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="p-8">
          <h2 className="text-2xl mb-4">Pending Requests</h2>
          <ul>
            {requests.map((request, index) => (
              <li key={index} className="mt-2 border-1 p-3 rounded">
                <p>By: {request.request.requester}</p>
                <p>File: {request.file.fileName}</p>

                <Button
                  flat
                  auto
                  onClick={() => handleApprove(request, index)}
                  className="mt-3"
                >
                  Approve
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default PendingRequestsPage;
