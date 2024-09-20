export async function uploadJson(jsonData) {
  const blob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  try {
    const formData = new FormData();
    formData.append("file", blob, "data.json");

    const response = await fetch("http://localhost:5001/api/v0/add", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload JSON data to IPFS. Status: ${response.status}`
      );
    }

    const responseData = await response.json();
    console.log("JSON data uploaded to IPFS. CID:", responseData.Hash);
    return responseData.Hash; // return the Content Identifier (CID) of the uploaded data
  } catch (error) {
    console.error("Error uploading JSON data to IPFS:", error);
    return null;
  }
}

export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5001/api/v0/add", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload JSON data to IPFS. Status: ${response.status}`
      );
    }

    const responseData = await response.json();
    console.log("JSON data uploaded to IPFS. CID:", responseData.Hash);
    return responseData.Hash; // return the Content Identifier (CID) of the uploaded data
  } catch (error) {
    console.error("Error uploading JSON data to IPFS:", error);
    return null;
  }
}

export async function getJson(cid) {
  if (!cid) {
    return null;
  }
  try {
    const response = await fetch(`http://localhost:8080/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch JSON data from IPFS. Status: ${response.status}`
      );
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching JSON data from IPFS:", error);
    return null;
  }
}
