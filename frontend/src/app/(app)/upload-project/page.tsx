"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  CircleHelp,
  CloudUpload,
  FileText,
  Info,
  UsersRound,
} from "lucide-react";
import KeywordProcessor from "@/components/keyword-processor";
import EnvDebug from "@/components/env-debug";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSession } from "next-auth/react";
import { DEGREE_STRUCTURE } from "@/lib/constants/DegreeStructure";
import { Dialog } from "@headlessui/react";

const supabase = createClientComponentClient();
type ParsedData = {
  title: string;
  abstract: string;
  keywords: string[];
};
export default function UploadProjectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showKeywordProcessor, setShowKeywordProcessor] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { data: session } = useSession();
  const [course, setCourse] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [publishedDate, setPublishedDate] = useState<string>("");
  const isFormValid = course && specialization && publishedDate;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const email = session?.user?.email;
    console.log("Session email:", email);
    if (!email) return;

    (async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      console.log("Profile fetch result:", profile);
      if (profileError) console.error("Profile fetch error:", profileError);

      if (profile?.id && session?.user?.name) {
        setUsername(session.user.name);
      }
    })();
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setParsedData(null);
    setProcessingComplete(false);
    setShowKeywordProcessor(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setLoading(true);
    setModalMessage("Uploading and processing file...");
    setIsModalOpen(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const flaskResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await flaskResponse.json();
      if (!result.success) {
        alert("Failed to extract data: " + result.error);
        return;
      }

      const email = session?.user?.email;
      if (!email) {
        alert("User not authenticated.");
        return;
      }

      const { data: authUser, error: authError } = await supabase.auth
        .getUser();
      console.log("Supabase Auth User:", authUser);
      if (authError) console.error("Auth error:", authError);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      console.log("Profile fetch result:", profile);
      if (profileError) console.error("Profile fetch error:", profileError);

      if (!profile?.id) {
        alert("User profile not found.");
        return;
      }
      const profile_id = parseInt(profile.id, 10);
      console.log("Parsed profile_id (as bigint):", profile_id);
      const fullName = session.user?.name || "Unknown User";

      if (!profile_id) {
        alert("User profile not found.");
        return;
      }

      const title = result.title || file.name.replace(/\.[^/.]+$/, "");
      const slugBase = title.toLowerCase().replace(/\W+/g, "-").replace(
        /^\-+|\-+$/g,
        "",
      );
      const slug = `${slugBase}-${Date.now()}`;
      const pdfFileName = `AIAcademia-pdf-${slug}.pdf`;

      let finalFileName = pdfFileName;
      let attempt = 0;
      let uploadResponse;
      do {
        uploadResponse = await supabase.storage.from("acm-papers").upload(
          finalFileName,
          file,
          {
            cacheControl: "3600",
            upsert: false,
          },
        );

        if (
          uploadResponse.error?.message?.includes("The resource already exists")
        ) {
          attempt++;
          finalFileName = `AIAcademia-pdf-${slug}-${attempt}.pdf`;
        }
      } while (
        uploadResponse.error?.message?.includes(
          "The resource already exists",
        ) && attempt < 5
      );

      if (uploadResponse.error) {
        console.error(uploadResponse.error);
        alert("PDF upload failed.");
        return;
      }

      const pdfUrl =
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/acm-papers/${finalFileName}`;
      const keywords = result.keywords || [];

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
          specialization: specialization,
          course: course,
          published_at: `${publishedDate}-01`,
          extracted_text: null,
        }),
      });

      let success, insertError;
      try {
        ({ success, error: insertError } = await insertResponse.json());
      } catch (e) {
        const text = insertResponse.statusText || "(no status text)";
        console.error("Non-JSON response:", text);
        alert("Upload failed: server returned an unexpected response.");
        return;
      }

      if (insertError) {
        console.error(insertError);
        setModalMessage("❌ Failed to save capstone.");
        return;
      }

      setParsedData({
        title,
        abstract: result.abstract,
        keywords,
      });

      setShowKeywordProcessor(true);
      setModalMessage(`Capstone saved successfully!`);
    } catch (err) {
      console.error("Upload error:", err);
      setModalMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // rest of the component remains unchanged

  const onProcessingComplete = () => {
    setProcessingComplete(true);
  };

  return (
    <>
      <h1 className="font-arima font-bold text-xl xs:text-2xl sm:text-3xl xl:text-4xl 3xl:text-5xl">
        Upload <span className="text-secondary-dark">Academic Project</span>
      </h1>

      <div className="mt-8 bg-linear-to-br from-secondary-dark/90 to-secondary p-8 rounded-lg font-roboto font-semibold text-lg">
        <div className="flex gap-4 items-center">
          <Info className="size-8" />
          <span className="text-xl font-extrabold">Upload Progression</span>
        </div>
        <p className="mt-4 text-lg">
          You have chosen to upload a project and for that you need to complete
          the forms in this page. The different forms can be completed in any
          order. <br />
          Once complete, the project can be viewed in your profile
        </p>
      </div>

      <div className="flex gap-3 mt-10 font-roboto">
        <div className="w-1/4 h-full">
          <h1 className="font-bold text-xl">Things you need to do</h1>
          <ul className="mt-8 flex flex-col gap-5">
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

        <div className="w-3/4 flex flex-col gap-5">
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className="flex justify-between">
              <div className="flex items-center gap-6">
                <FileText className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Project Details</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>
            <div>
              <div className="flex flex-wrap gap-10 mt-5">
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-base">Course</label>
                  <select
                    className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {Object.keys(DEGREE_STRUCTURE).map((courseKey) => (
                      <option key={courseKey} value={courseKey}>
                        {courseKey}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-base">
                    Specialization
                  </label>
                  <select
                    className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    disabled={!course}
                  >
                    <option value="">Select Specialization</option>
                    {(course &&
                      DEGREE_STRUCTURE[
                        course as keyof typeof DEGREE_STRUCTURE
                      ]) &&
                      DEGREE_STRUCTURE[course as keyof typeof DEGREE_STRUCTURE]
                        .map((spec) => (
                          <option key={`spec-${spec}`} value={spec}>
                            {spec}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-base">
                    Year Published
                  </label>
                  <input
                    type="month"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                  />
                </div>
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
                disabled={!file || loading || !isFormValid}
                className="mt-4 w-full bg-yellow-500 text-black font-bold py-3 rounded disabled:opacity-50"
              >
                {loading
                  ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-black"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Processing...
                    </span>
                  )
                  : "UPLOAD"}
              </button>
            </div>
          </div>
          {processingComplete && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
              Keyword processing completed successfully!
            </div>
          )}

          {showKeywordProcessor && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                File Processing
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Processing will start automatically)
                </span>
              </h2>
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
                  </div>
                )
                : (
                  <p className="text-center text-gray-500">
                    Parsed text will appear here.
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl text-center">
            <Dialog.Title className="text-lg font-bold mb-2">
              Upload Status
            </Dialog.Title>
            <Dialog.Description className="text-gray-700">
              {modalMessage}
            </Dialog.Description>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-secondary text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
