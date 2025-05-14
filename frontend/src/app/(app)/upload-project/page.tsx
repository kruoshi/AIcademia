"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CircleHelp, CloudUpload, FileText, Info, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import KeywordProcessor from "@/components/keyword-processor"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "next-auth/react"

const supabase = createClientComponentClient()

type ParsedData = {
  title: string
  abstract: string
  keywords: string[]
  introduction: string
}

type TaskStatus = "incomplete" | "in-progress" | "complete"

type Task = {
  name: string
  status: TaskStatus
}

export default function UploadProjectPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [processingComplete, setProcessingComplete] = useState(false)
  const [showKeywordProcessor, setShowKeywordProcessor] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([
    { name: "Project Details", status: "incomplete" },
    { name: "Upload Project", status: "incomplete" },
  ])
  const [projectDetails, setProjectDetails] = useState({
    course: "",
    specialization: "",
    yearPublished: "",
  })

  useEffect(() => {
    const email = session?.user?.email
    if (!email) return
    ;(async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle()

        if (profileError) {
          console.error("Profile fetch error:", profileError)
          return
        }

        if (profile?.id && session?.user?.name) {
          setUsername(session.user.name)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    })()
  }, [session])

  useEffect(() => {
    // Update tasks based on state
    const newTasks = [...tasks]

    // Update Upload Project task
    const uploadIndex = newTasks.findIndex((t) => t.name === "Upload Project")
    if (uploadIndex !== -1) {
      if (file && !loading && !processingComplete) {
        newTasks[uploadIndex].status = "in-progress"
      } else if (processingComplete) {
        newTasks[uploadIndex].status = "complete"
      }
    }

    // Update Project Details task
    const detailsIndex = newTasks.findIndex((t) => t.name === "Project Details")
    if (detailsIndex !== -1) {
      if (projectDetails.course && projectDetails.specialization && projectDetails.yearPublished) {
        newTasks[detailsIndex].status = "complete"
      } else if (projectDetails.course || projectDetails.specialization || projectDetails.yearPublished) {
        newTasks[detailsIndex].status = "in-progress"
      }
    }

    setTasks(newTasks)
  }, [file, loading, processingComplete, projectDetails])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setParsedData(null)
    setProcessingComplete(false)
    setShowKeywordProcessor(false)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)
  }

  const handleProjectDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProjectDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 300)

    return () => clearInterval(interval)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setSuccess(null)

    const stopProgressSimulation = simulateProgress()

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Now attempt the upload
      const flaskResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      // Check if the response is successful
      if (!flaskResponse.ok) {
        const errorText = await flaskResponse.text()
        console.error("Upload API error:", flaskResponse.status, errorText)
        setError(`Server error (${flaskResponse.status}): ${errorText || flaskResponse.statusText || "Unknown error"}`)
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      // Check if the response is valid JSON
      let result
      let responseText
      try {
        // First get the raw text to log in case of error
        responseText = await flaskResponse.clone().text()

        // Then try to parse as JSON
        result = await flaskResponse.json()
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        console.error("Raw response:", responseText)
        setError(
          `Server returned invalid JSON: ${responseText ? responseText.substring(0, 100) + "..." : "Empty response"}`,
        )
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      if (!result || !result.success) {
        setError(`Failed to extract data: ${result?.error || "Unknown error"}`)
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      const email = session?.user?.email
      if (!email) {
        setError("User not authenticated.")
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (profileError) {
        console.error("Profile fetch error:", profileError)
        setError("Failed to fetch user profile.")
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      if (!profile?.id) {
        setError("User profile not found.")
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      const profile_id = Number.parseInt(profile.id, 10)
      const fullName = session.user?.name || "Unknown User"

      const title = result.title || file.name.replace(/\.[^/.]+$/, "")
      const slugBase = title
        .toLowerCase()
        .replace(/\W+/g, "-")
        .replace(/^-+|-+$/g, "")
      const slug = `${slugBase}-${Date.now()}`
      const pdfFileName = `AIAcademia-pdf-${slug}.pdf`

      let finalFileName = pdfFileName
      let attempt = 0
      let uploadResponse

      do {
        uploadResponse = await supabase.storage.from("acm-papers").upload(finalFileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadResponse.error?.message?.includes("The resource already exists")) {
          attempt++
          finalFileName = `AIAcademia-pdf-${slug}-${attempt}.pdf`
        }
      } while (uploadResponse.error?.message?.includes("The resource already exists") && attempt < 5)

      if (uploadResponse.error) {
        console.error(uploadResponse.error)
        setError("PDF upload failed.")
        setLoading(false)
        stopProgressSimulation()
        setUploadProgress(0)
        return
      }

      setUploadProgress(100)

      const pdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/acm-papers/${finalFileName}`
      const keywords = result.keywords || []

      try {
        const insertResponse = await fetch("/api/submit-capstone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile_id,
            title,
            abstract: result.abstract,
            authors: result.authors || [],
            slug,
            pdf_url: pdfUrl,
            keywords,
            status: "draft",
            specialization: projectDetails.specialization || null,
            course: projectDetails.course || null,
            extracted_text: null,
          }),
        })

        // Check if the response is successful
        if (!insertResponse.ok) {
          const errorText = await insertResponse.text()
          console.error("Submit API error:", insertResponse.status, errorText)
          throw new Error(
            `Server error (${insertResponse.status}): ${errorText || insertResponse.statusText || "Unknown error"}`,
          )
        }

        // Check if the response is valid JSON
        let responseData
        let insertResponseText
        try {
          // First get the raw text to log in case of error
          insertResponseText = await insertResponse.clone().text()

          // Then try to parse as JSON
          responseData = await insertResponse.json()
        } catch (jsonError) {
          console.error("JSON parsing error in submit:", jsonError)
          console.error("Raw response from submit:", insertResponseText)
          throw new Error(
            `Server returned invalid JSON from submit endpoint: ${insertResponseText ? insertResponseText.substring(0, 100) + "..." : "Empty response"}`,
          )
        }

        if (!responseData.success) {
          throw new Error(responseData.error || "Failed to save capstone")
        }

        setParsedData({
          title,
          abstract: result.abstract,
          keywords,
          introduction: "",
        })

        setShowKeywordProcessor(true)
        setSuccess(`${fullName}'s capstone saved successfully!`)
      } catch (e) {
        console.error("Submit error:", e)
        setError(e instanceof Error ? e.message : "Failed to save project data.")
        setLoading(false)
        return
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong during the upload process.")
    } finally {
      setLoading(false)
    }
  }

  const onProcessingComplete = () => {
    setProcessingComplete(true)

    // Update task status
    const newTasks = [...tasks]
    const uploadIndex = newTasks.findIndex((t) => t.name === "Upload Project")
    if (uploadIndex !== -1) {
      newTasks[uploadIndex].status = "complete"
    }
    setTasks(newTasks)
  }

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "complete":
        return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Complete</span>
      case "in-progress":
        return <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">In Progress</span>
      default:
        return <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">Incomplete</span>
    }
  }

  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl 3xl:text-5xl">
        Upload <span className="text-secondary-dark">Academic Project</span>
      </h1>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="font-bold">Error</span>
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-bold">Success</span>
          </div>
          <p className="mt-1">{success}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mt-10 font-roboto">
        <div className="w-full md:w-1/4 h-full">
          <h1 className="font-bold text-xl">Things you need to do</h1>
          <ul className="mt-8 flex flex-col gap-5">
            {tasks.map((task, index) => (
              <div key={index}>
                <h2 className="text-text text-lg font-bold">{task.name}</h2>
                <div className="flex justify-between items-center">
                  <p>
                    {task.status === "incomplete"
                      ? "Incomplete"
                      : task.status === "in-progress"
                        ? "In Progress"
                        : "Complete"}
                  </p>
                  {getStatusBadge(task.status)}
                </div>
              </div>
            ))}
          </ul>

          <h1 className="font-bold text-xl mt-10">Documents</h1>
          <p className="mt-4">{file ? file.name : "No document uploaded"}</p>
        </div>

        <div className="w-full md:w-3/4 flex flex-col gap-5">
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
                  name="course"
                  value={projectDetails.course}
                  onChange={handleProjectDetailsChange}
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-base">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={projectDetails.specialization}
                  onChange={handleProjectDetailsChange}
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-extrabold text-base">Year Published</label>
                <input
                  type="text"
                  name="yearPublished"
                  value={projectDetails.yearPublished}
                  onChange={handleProjectDetailsChange}
                  placeholder=" MM / YYYY"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
            </div>
          </div>

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
                  disabled={loading}
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
                    <p
                      className="mt-1 text-sm text-gray-500 hover:underline cursor-pointer"
                      onClick={() => !loading && setFile(null)}
                    >
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

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Upload progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="mt-4 w-full bg-yellow-500 text-black font-bold py-3 rounded disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "UPLOAD"
                )}
              </button>
            </div>
          </div>

          {showKeywordProcessor && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                File Processing
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
        </div>
      </div>

      <aside className="w-full mt-10 md:mt-0 md:w-1/3 bg-gray-50 p-8 overflow-auto">
        {parsedData ? (
          <div>
            <h2 className="text-xl font-bold">Document Title</h2>
            <p className="mt-2 text-gray-800">{parsedData.title}</p>

            <h3 className="mt-6 font-semibold">Abstract</h3>
            <p className="mt-2 text-gray-700 text-sm">{parsedData.abstract}</p>

            <h3 className="mt-6 font-semibold">Keywords</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {parsedData.keywords.map((keyword, index) => (
                <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>

            <h3 className="mt-6 font-semibold">Introduction</h3>
            <p className="mt-2 text-gray-700 text-sm">{parsedData.introduction}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Parsed text will appear here.</p>
        )}
      </aside>
    </>
  )
}
