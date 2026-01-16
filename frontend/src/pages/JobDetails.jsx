import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Globe, MapPin, Briefcase, Building2 } from "lucide-react";
import NavBar from "../components/NavBar";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    };
    fetchJob();
  }, [id]);

  if (!job) {
    return (
      <div className="pt-24 text-center text-lg font-semibold">
        Loading job details...
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-28 px-4">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">

          {/* Header */}
          <div className="border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-3 text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={18} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={18} /> {job.experience}
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={18} /> {job.company_name}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Requirements
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {job.requirements}
            </p>
          </div>

          {/* Company Info */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              About Company
            </h2>

            <p className="text-gray-700 mb-3">
              {job.company_about}
            </p>

            {job.company_website && (
              <a
                href={job.company_website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Globe size={18} />
                Visit Company Website
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;