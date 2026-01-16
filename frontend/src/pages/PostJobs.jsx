import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";

const PostJobs = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    experience: "",
  });

  const recruiter_id = localStorage.getItem("userId");
  const company_name = localStorage.getItem("company_name");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!recruiter_id || !company_name) {
  toast.error("Recruiter data missing. Please login again.");
  return;
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/jobs", {
        ...form,
        recruiter_id,
        company_name,
      });

      toast.success("Job posted successfully 🚀");
      setForm({ title: "", description: "", location: "", experience: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to post job");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-100 flex justify-center items-start pt-28">
        <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Post a New Job
          </h2>

          <p className="text-sm text-gray-500 text-center mb-4">
            Posting as <b>{company_name}</b>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={form.title}
              placeholder="Job Title"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <textarea
              name="description"
              value={form.description}
              placeholder="Job Description"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="4"
              required
            />

            <input
              type="text"
              name="location"
              value={form.location}
              placeholder="Location"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="experience"
              value={form.experience}
              placeholder="Experience Required"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Post Job
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJobs;