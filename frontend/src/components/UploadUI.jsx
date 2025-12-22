import React, { useState } from "react";
import axios from "axios";

const UploadUI = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first!");

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:5000/api/upload", formData);
    setResponse(res.data);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Upload PDF
      </button>

      {response && (
        <div className="mt-6 w-2/3 bg-gray-100 p-4 rounded">
          <p><strong>{response.totalChunks}</strong> chunks created</p>
          <pre className="text-xs mt-2 bg-white p-2 rounded">
            {JSON.stringify(response.sample, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UploadUI;
