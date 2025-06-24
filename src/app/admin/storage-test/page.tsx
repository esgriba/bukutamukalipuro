"use client";

import React, { useState, useEffect } from "react";
import SupabaseSetupGuide from "@/components/SupabaseSetupGuide";
import AdminNav from "@/components/AdminNav";

export default function SupabaseStorageTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"standard" | "direct">(
    "standard"
  );

  const runBucketTest = async () => {
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/test-bucket");
      const data = await response.json();

      setResults(data);

      // Show the guide if we have RLS errors
      if (
        !data.success &&
        (data.uploadError?.message?.includes("row-level security") ||
          data.bucketCheck?.error?.includes("row-level security"))
      ) {
        setShowGuide(true);
      }
    } catch (err: any) {
      console.error("Error testing bucket:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const runDebugTest = async () => {
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("/api/debug-supabase");
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error("Error checking Supabase config:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const testUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Use the selected upload method
      const endpoint =
        uploadMethod === "standard" ? "/api/upload" : "/api/direct-upload";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResults({
        uploadTest: {
          method: uploadMethod,
          success: response.ok,
          status: response.status,
          data,
        },
      });
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Supabase Storage Test</h1>
      <AdminNav />

      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Storage Configuration Test</h2>
        <div className="space-y-4">
          <div>
            <button
              onClick={runBucketTest}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-3"
            >
              {loading ? "Testing..." : "Test Bucket Access"}
            </button>

            <button
              onClick={runDebugTest}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Checking..." : "Check Supabase Config"}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Test File Upload</h3>
            <div className="mb-4">
              <label className="block mb-2">Upload Method:</label>
              <select
                value={uploadMethod}
                onChange={(e) =>
                  setUploadMethod(e.target.value as "standard" | "direct")
                }
                className="border p-2 rounded w-full md:w-1/2"
              >
                <option value="standard">Standard Upload (Fixed API)</option>
                <option value="direct">Direct Upload</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Select a file to upload:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              onClick={testUpload}
              disabled={loading || !selectedFile}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Uploading..." : "Test Upload"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Results:</h3>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {showGuide && <SupabaseSetupGuide />}
    </div>
  );
}
