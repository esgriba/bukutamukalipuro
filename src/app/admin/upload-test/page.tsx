"use client";

import React, { useState } from "react";
import AdminNav from "@/components/AdminNav";

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState("direct");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      let endpoint;
      switch (uploadMethod) {
        case "direct":
          endpoint = "/api/direct-upload";
          break;
        case "standard":
          endpoint = "/api/upload";
          break;
        case "local":
          endpoint = "/api/local-upload";
          break;
        default:
          endpoint = "/api/direct-upload";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          data,
          status: response.status,
          method: uploadMethod,
        });
      } else {
        setError(`Upload failed with status ${response.status}`);
        setResult({
          success: false,
          error: data,
          status: response.status,
          method: uploadMethod,
        });
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <AdminNav />
      <h1 className="text-2xl font-bold mb-6">Upload Test Page</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test File Upload</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload Method
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="direct"
                checked={uploadMethod === "direct"}
                onChange={() => setUploadMethod("direct")}
                className="mr-2"
              />
              Direct Upload (Simplified)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="standard"
                checked={uploadMethod === "standard"}
                onChange={() => setUploadMethod("standard")}
                className="mr-2"
              />
              Standard Upload
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="local"
                checked={uploadMethod === "local"}
                onChange={() => setUploadMethod("local")}
                className="mr-2"
              />
              Local Upload
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {file && (
          <p className="text-sm text-green-600 mb-4">
            Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-4 py-2 rounded text-white ${
            isUploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <h3 className="text-red-700 font-medium mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div
          className={`border rounded p-4 mb-6 ${
            result.success
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <h3
            className={`font-medium mb-2 ${
              result.success ? "text-green-700" : "text-orange-700"
            }`}
          >
            {result.success ? "Upload Successful" : "Upload Failed"}
          </h3>

          {result.success && result.data && result.data.url && (
            <div className="mb-4">
              <p className="mb-2">File uploaded successfully!</p>
              <img
                src={result.data.url}
                alt="Uploaded file"
                className="max-w-md max-h-64 border rounded shadow-sm"
              />
              <p className="text-sm text-gray-600 mt-2">
                URL: {result.data.url}
              </p>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-medium mb-1">Details:</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
