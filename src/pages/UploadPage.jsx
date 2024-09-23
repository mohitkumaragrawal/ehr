import { useState, useEffect } from "react";
import { Button, Spinner, Input } from "@nextui-org/react";
import Container from "../components/Container";
import { useSmartContracts } from "../SmartContractProvider";
import { uploadData } from "../utils";

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const smartContractsContext = useSmartContracts();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    // Upload logic
    console.log("Uploading", fileName, file);
    if (file) {
      setLoading(true);
      await uploadData(file, smartContractsContext);
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="p-8 w-1/3">
          <h2 className="text-2xl mb-4">Upload File</h2>
          <Input type="file" onChange={handleFileChange} />
          <Input
            placeholder="Enter filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="mt-4 hidden"
          />
          <Button onClick={handleUpload} className="mt-4">
            Upload
          </Button>
        </div>
      )}
    </Container>
  );
};

export default UploadPage;
