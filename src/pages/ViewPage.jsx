import { useState, useEffect } from "react";
import { Button, Spinner } from "@nextui-org/react";
import Container from "../components/Container";
import { useSmartContracts } from "../SmartContractProvider";
import { decryptAndDownloadFile } from "../utils";

const ViewPage = () => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const smartContractsContext = useSmartContracts();

  useEffect(() => {
    const fetchData = async () => {
      const dataContract = smartContractsContext.contracts.DataContract;
      if (!dataContract) return;

      const userFiles = await dataContract.viewUserFiles(
        smartContractsContext.signer.address
      );

      setFiles(userFiles);
      setLoading(false);
    };
    fetchData();
  }, [smartContractsContext]);

  const handleDownload = async (file) => {
    // Download logic

    await decryptAndDownloadFile(file, smartContractsContext);

    console.log("Downloading", file);
  };

  return (
    <Container>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="p-8">
          <h2 className="text-2xl mb-4">Your Health Records</h2>
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
                <Button flat auto onClick={() => handleDownload(file)}>
                  Download
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default ViewPage;
