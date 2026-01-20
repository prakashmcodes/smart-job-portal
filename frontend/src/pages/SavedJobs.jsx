import { useEffect, useState } from "react";
import api from "../api/axios";
import NavBar from "../components/NavBar";
import SavedJobCard from "../components/SavedJobCard";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const res = await api.get("/savejobs/me");
      setJobs(res.data);
    };
    fetchSaved();
  }, []);

  const removeFromUI = (savedId) => {
    setJobs(prev => prev.filter(j => j.saved_id !== savedId));
  };

  return (
    <>
      <NavBar />
      <div className="bg-slate-100 min-h-screen pt-24 px-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Saved Jobs</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard
              key={job.saved_id}
              job={job}
              mode="saved"
              onRemoved={removeFromUI}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SavedJobs;
