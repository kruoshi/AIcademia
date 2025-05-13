"use client"

import type React from "react"

import { useState } from "react"
import KeywordProcessor from "@/components/keyword-processor"
import EnvDebug from "@/components/env-debug"

type ParsedData = {
  title: string
  abstract: string
  keywords: string[]
  introduction: string
}

export default function UploadProjectPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [processingComplete, setProcessingComplete] = useState(false)
  const [showKeywordProcessor, setShowKeywordProcessor] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setParsedData(null)
    setProcessingComplete(false)
    setShowKeywordProcessor(false)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate OCR processing for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock parsed data
      const mockData: ParsedData = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        abstract: "This is a sample abstract extracted from the uploaded PDF.",
        keywords: ["sample", "academic", "research", "keywords"],
        introduction: "This is the introduction section of the paper...",
      }

      setParsedData(mockData)
    } catch (err) {
      console.error(err)
      alert("There was an error processing your document.")
    } finally {
      setLoading(false)
      // Run the keyword processor automatically in the finally block
      setShowKeywordProcessor(true)
    }
  }

  const onProcessingComplete = () => {
    setProcessingComplete(true)
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">
          Add <span className="text-yellow-500">Academic Work</span>
        </h1>
        <p className="text-gray-600 mt-2">Upload your paper in PDF format</p>

        <div className="mt-6">
          <div
            className={
              "relative border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center " +
              (file ? "border-green-500 bg-green-50" : "border-gray-300 bg-white")
            }
          >
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-green-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="mt-2 font-semibold text-green-700">{file.name}</p>
                <p className="mt-1 text-sm text-gray-500 hover:underline cursor-pointer" onClick={() => setFile(null)}>
                  Change file
                </p>
              </div>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

          <EnvDebug />
        </div>

        {showKeywordProcessor && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              Automatic Keyword Processing
              <span className="ml-2 text-sm font-normal text-gray-500">(Processing will start automatically)</span>
            </h2>
            <KeywordProcessor onComplete={onProcessingComplete} autoProcess={true} />
          </div>
        )}

        {processingComplete && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
            Keyword processing completed successfully!
          </div>
        )}
      </main>

      <aside className="w-full md:w-1/3 bg-gray-50 p-8 overflow-auto">
        {parsedData ? (
          <div>
            <h2 className="text-xl font-bold">Document Title</h2>
            <p className="mt-2 text-gray-800">{parsedData.title}</p>

            <h3 className="mt-6 font-semibold">Abstract</h3>
            <p className="mt-2 text-gray-700 text-sm">{parsedData.abstract}</p>

            <h3 className="mt-6 font-semibold">Keywords</h3>
            <p className="mt-2 text-gray-700 text-sm">{parsedData.keywords.join(", ")}</p>

            <h3 className="mt-6 font-semibold">Introduction</h3>
            <p className="mt-2 text-gray-700 text-sm">{parsedData.introduction}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Parsed text will appear here.</p>
        )}
      </aside>
    </div>
  )
}
