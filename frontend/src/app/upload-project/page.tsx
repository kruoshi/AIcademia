import {
  Info,
  UsersRound,
  CircleHelp,
  FileText,
  CloudUpload,
  ChevronRight,
} from "lucide-react";
const UploadProject = () => {
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
        <div className="w-1/4 h-full ">
          <h1 className="font-bold text-xl">Things you need to do</h1>
          <ul className="mt-8 flex flex-col gap-5 ">
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
              <p>Incomplete</p>
            </div>
          </ul>

          <h1 className="font-bold text-xl mt-10">Documents</h1>
          <p className="mt-4">Document</p>
        </div>
        <div className="w-3/4 flex flex-col gap-5 ">
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className=" flex justify-between">
              <div className="flex items-center gap-6">
                <UsersRound className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Invite Teammates</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>
            <p className="mt-5 mb-2 text-text-dark font-semibold">
              You do not have any teammates yet
            </p>
            <button className="flex gap-2 bg-secondary text-sm rounded-full px-5 py-2 font-bold">
              ADD TEAMMATE
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className=" flex justify-between">
              <div className="flex items-center gap-6">
                <FileText className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Project Details</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>
            <div className="flex flex-wrap gap-10 mt-5">
              <div className="flex flex-col gap-2 ">
                <label htmlFor="" className="font-extrabold text-base">
                  Course
                </label>
                <input
                  type="text"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label htmlFor="" className="font-extrabold text-base">
                  Specialization
                </label>
                <input
                  type="text"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label htmlFor="" className="font-extrabold text-base">
                  Year Published
                </label>
                <input
                  type="text"
                  placeholder=" MM / YYYY"
                  className="font-medium outline-none ring-2 w-100 py-1 px-3 ring-gray-300 text-base"
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-10 shadow-md/10">
            <header className=" flex justify-between">
              <div className="flex items-center gap-6">
                <CloudUpload className="size-8" strokeWidth={3} />
                <h1 className="text-xl font-bold">Upload Project</h1>
              </div>
              <CircleHelp strokeWidth={2} className="size-6" />
            </header>
            <p className="mt-5 mb-2 text-text-dark font-semibold">
              You do not have any teammates yet
            </p>
            <button className="flex gap-2 bg-secondary text-sm rounded-full px-5 py-2 font-bold">
              UPLOAD
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadProject;
