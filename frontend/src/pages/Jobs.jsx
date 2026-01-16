import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import NavBar from "../components/NavBar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
  const fetchData = async () => {
    try {
      const jobsRes = await api.get("/jobs");
      let jobsData = jobsRes.data.jobs;

      const userId = localStorage.getItem("userId");
      let appliedJobIds = [];

      if (userId) {
        const appsRes = await api.get(`/applications?user_id=${userId}`);
        appliedJobIds = appsRes.data.map(app => app.job_id);
      }

      const finalJobs = jobsData.map(job => ({
        ...job,
        applied: appliedJobIds.includes(job.id),
      }));

      setJobs(finalJobs);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [userId]);

if (role === "recruiter") {
  return (
    <>
      <NavBar />
      <div className="pt-24 px-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Recruiter Dashboard
        </h2>
        <p className="text-gray-600">
          As a recruiter, you can:
        </p>
        <ul className="mt-4 space-y-2 text-blue-600">
          <li>➡ Go to <b>Post Job</b> to add new jobs</li>
          <li>➡ Go to <b>Applications</b> to view candidates</li>
        </ul>
      </div>
    </>
  );
}

  

  // if (loading) return <p>Loading jobs...</p>;

  return (
    <>
      <NavBar />
      <div className="pt-24 px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {jobs.map((job) => (
  <JobCard
    key={job.id}
    job={job}
    onApplied={(jobId) => {
      setJobs(prev =>
        prev.map(j =>
          j.id === jobId ? { ...j, applied: true } : j
        )
      );
    }}
  />
))}
        </div>
      </div>
    </>
  );
}

export default Jobs;
