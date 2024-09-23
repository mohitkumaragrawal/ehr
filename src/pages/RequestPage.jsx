import { useState, useRef } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import Container from "../components/Container";

import { useSmartContracts } from "../SmartContractProvider";

const RequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [files, setFiles] = useState([]);
  const smartContractContext = useSmartContracts();

  const { contracts } = smartContractContext;
  const dataContract = contracts.DataContract;
  const permissionsContract = contracts.PermissionContract;

  const ownerOfFiles = useRef();

  const fetchFiles = async (id) => {
    setLoading(true);

    const files = await dataContract.viewUserFiles(id);
    if (files) {
      setFiles(files);
      ownerOfFiles.current = id;
    }

    setLoading(false);
  };

  const requestPermission = async (fileHash) => {
    setLoading(true);
    const tx = await permissionsContract.requestPermission(
      ownerOfFiles.current,
      fileHash
    );

    await tx.wait();
    setLoading(false);
    alert("Request sent to the owner of the file");
  };

  const handleSubmit = () => {
    fetchFiles(accountId);
  };

  return (
    <Container>
      <div className="p-8 w-1/3">
        <h2 className="text-2xl mb-4">Request Files</h2>
        <Input
          placeholder="Enter Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <Button onClick={handleSubmit} className="mt-4">
          Submit
        </Button>
        {loading ? (
          <Spinner size="lg" className="mt-4" />
        ) : (
          <ul>
            {files.map((file, index) => (
              <li
                key={index}
                className="mt-2 flex justify-between gap-3 border-1 rounded p-5"
              >
                <div>
                  <p className="font-bold text-lg">{file.fileName}</p>
                  <p className="text-sm">Type: {file.dataType}</p>
                </div>
                <Button
                  flat
                  auto
                  onClick={() => requestPermission(file.dataHash)}
                >
                  Request
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
};

export default RequestPage;
