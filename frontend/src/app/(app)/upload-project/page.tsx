"use client";

import { useState } from "react";
import {
  ChevronRight,
  CircleHelp,
  CloudUpload,
  FileText,
  Info,
  UsersRound,
} from "lucide-react";

type ParsedData = {
  title: string;
  abstract: string;
  keywords: string[];
  introduction: string;
};

const UploadProject = () => {
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
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl 3xl:text-5xl">
        Upload <span className="text-secondary-dark">Academic Project</span>
      </h1>

      {/* Upload Instructions */}
      <div className="mt-8 bg-linear-to-br from-secondary-dark/90 to-secondary p-8 rounded-lg font-roboto font-semibold text-lg">
        <div className="flex gap-4 items-center">
          <Info className="size-8" />
          <span className="text-xl font-extrabold">Upload Progression</span>
        </div>
        <p className="mt-4 text-lg">
          You have chosen to upload a project and for that you need to complete
          the forms in this page. The different forms can be completed in any
          order. <br />
          Once complete, the project can be viewed in your profile.
        </p>
      </div>

      <div className="flex gap-6 mt-10 font-roboto">
        {/* Sidebar - steps */}
        <div className="w-1/4">
          <h1 className="font-bold text-xl">Things you need to do</h1>
          <ul className="mt-8 flex flex-col gap-5">
            <div>
              <h2 className="text-text text-lg font-bold">Invite Teammates</h2>
              <p>Incomplete</p>
            </div>
            <div>
              <h2 className="text-text text-lg font-bold">Project Details</h2>
              <p>Incomplete</p>
            </div>
            <div>
              <h2 className="text-text text-lg font-bold">Upload Project</h2>
              <p>{file ? "Ready" : "Incomplete"}</p>
            </div>
          </ul>

          <h1 className="font-bold text-xl mt-10">Documents</h1>
          <p className="mt-4">{file ? file.name : "No document uploaded"}</p>
        </div>

        {/* Main Form Cards */}
        <div className="w-3/4 flex flex-col gap-5">
          {/* Team Section (Placeholder) */}
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className="flex justify-between">
              <div className="flex items-center gap-6">
                <UsersRound className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Invite Teammates</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>
            <p className="mt-5 mb-2 text-text-dark font-semibold">
              You do not have any teammates yet.
            </p>
            <button className="flex gap-2 bg-secondary text-sm rounded-full px-5 py-2 font-bold">
              ADD TEAMMATE
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Project Details (Placeholder) */}
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className="flex justify-between">
              <div className="flex items-center gap-6">
                <FileText className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Project Details</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>
            <div className="flex flex-wrap gap-10 mt-5">
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-base">Course</label>
                <input
                  type="text"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-base">
                  Specialization
                </label>
                <input
                  type="text"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-base">
                  Year Published
                </label>
                <input
                  type="text"
                  placeholder="MM / YYYY"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
            </div>
          </div>

          {/* Upload Project */}
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className="flex justify-between">
              <div className="flex items-center gap-6">
                <CloudUpload className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Upload Project</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>

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
                className="mt-4 w-full bg-secondary text-white font-bold py-3 rounded disabled:opacity-50"
              >
                {loading ? "Processing..." : "UPLOAD"}
              </button>
            </div>
          </div>

          {/* Parsed Text Result */}
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <h2 className="text-xl font-bold mb-4">Parsed Document Preview</h2>
            {parsedData
              ? (
                <>
                  <p className="mb-2">
                    <span className="font-semibold">Title:</span>{" "}
                    {parsedData.title}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Abstract:</span>{" "}
                    {parsedData.abstract}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Keywords:</span>{" "}
                    {parsedData.keywords.join(", ")}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Introduction:</span>{" "}
                    {parsedData.introduction}
                  </p>
                </>
              )
              : <p className="text-gray-500">Parsed text will appear here.</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadProject;
