import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "recruiter") {
      navigate("/recruiter/dashboard");
    }
  }, [role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      let jobsRes;

      if (debouncedSearch.trim() !== "") {
        jobsRes = await api.get(
          `/jobs/search?q=${debouncedSearch}&location=${location}`
        );
      } else {
        jobsRes = await api.get(
          `/jobs?page=${page}&limit=8&location=${location}`
        );
      }

      let jobsData = debouncedSearch ? jobsRes.data : jobsRes.data.jobs;
      setTotalPages(debouncedSearch ? 1 : jobsRes.data.totalPages);

      let appliedJobIds = [];
      if (userId) {
        const appsRes = await api.get("/applications/my");
        appliedJobIds = appsRes.data.map((app) => app.job_id);
      }

      const finalJobs = jobsData
        .map((job) => ({
          ...job,
          applied: appliedJobIds.includes(job.id),
        }))
        .filter((job) => !job.applied);

      let sortedJobs = [...finalJobs];

      if (sort === "newest") {
        sortedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      if (sort === "oldest") {
        sortedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      if (sort === "az") {
        sortedJobs.sort((a, b) => a.title.localeCompare(b.title));
      }

      setJobs(sortedJobs);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [page, userId, debouncedSearch, location, sort]);


  if (role === "recruiter") {
    return (
      <>
        <NavBar />
        <div className="pt-24 px-16 text-center">
          <h2 className="text-5xl font-bold mb-4">Recruiter Dashboard</h2>
          <p className="text-gray-600">YOu are recruiter, so you can:</p>
          <ul className="mt-4 space-y-2 text-blue-600">
            <li>
              Go to <b>Post Job</b> to add new jobs
            </li>
            <li>
              Go to <b>Applications</b> to view candidates
            </li>
          </ul>
        </div>
      </>
    );
  }

  if (role === "recruiter") return null;
  // if (loading) return <p>Loading jobs...</p>;

  return (
    <>
      <NavBar />

      <div className="pt-24 px-16">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <input
            type="text"
            value={search}
            maxLength={50}
            placeholder="Search jobs, company or location..."
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
              setSearch(value);
              setPage(1);
            }}
            className="w-72 px-4 py-2 border rounded-lg"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A–Z</option>
          </select>

          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Locations</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplied={(jobId) => {
                setJobs((prev) => prev.filter((j) => j.id !== jobId));
              }}
            />
          ))}
        </div>

        {search === "" && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 font-semibold">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;
