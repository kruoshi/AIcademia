"use client";

import { useState } from "react";

type ParsedData = {
  title: string;
  abstract: string;
  keywords: string[];
  introduction: string;
};

export default function UploadProjectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setParsedData(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("OCR processing failed");
      const data: ParsedData = await res.json();
      setParsedData(data);
    } catch (err) {
      console.error(err);
      alert("There was an error processing your document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">
          Add <span className="text-yellow-500">Academic Work</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Upload your paper in PDF format
        </p>

        <div className="mt-6">
          <div
            className={"relative border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center " +
              (file
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-white")}
          >
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />

            {file
              ? (
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-green-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="mt-2 font-semibold text-green-700">
                    {file.name}
                  </p>
                  <p
                    className="mt-1 text-sm text-gray-500 hover:underline cursor-pointer"
                    onClick={() => setFile(null)}
                  >
                    Change file
                  </p>
                </div>
              )
              : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mt-2">Upload File</p>
                  <p className="text-sm">25 MB max file size</p>
                </>
              )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-4 w-full bg-yellow-500 text-black font-bold py-3 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "UPLOAD"}
          </button>
        </div>
      </main>

      <aside className="w-1/3 bg-gray-50 p-8 overflow-auto">
        {parsedData
          ? (
            <div>
              <h2 className="text-xl font-bold">Document Title</h2>
              <p className="mt-2 text-gray-800">{parsedData.title}</p>

              <h3 className="mt-6 font-semibold">Abstract</h3>
              <p className="mt-2 text-gray-700 text-sm">
                {parsedData.abstract}
              </p>

              <h3 className="mt-6 font-semibold">Keywords</h3>
              <p className="mt-2 text-gray-700 text-sm">
                {parsedData.keywords.join(", ")}
              </p>

              <h3 className="mt-6 font-semibold">Introduction</h3>
              <p className="mt-2 text-gray-700 text-sm">
                {parsedData.introduction}
              </p>
            </div>
          )
          : (
            <p className="text-center text-gray-500">
              Parsed text will appear here.
            </p>
          )}
      </aside>
    </div>
  );
}
