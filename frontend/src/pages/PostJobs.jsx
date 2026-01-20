import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const PostJobs = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    experience: "",
    requirements: "",
    company_website: "",
  });

  const navigate = useNavigate();
  const company_name = localStorage.getItem("company_name");
  const role = localStorage.getItem("role");

  // Only recruiters allowed
  useEffect(() => {
    if (role !== "recruiter") {
      toast.error("Access denied. Recruiters only.");
      navigate("/auth");
    }
  }, [role, navigate]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.title || !form.description || !form.location || !form.experience) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        ...form,
        company_name, // must come from localStorage
      };

      console.log("POSTING JOB DATA:", payload); // Debug line

      await api.post("/jobs", payload);

      toast.success("Job posted successfully 🚀");

      setForm({
        title: "",
        description: "",
        location: "",
        experience: "",
        requirements: "",
        company_website: "",
      });
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex justify-center pt-28">
        <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Post a New Job
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Posting as <span className="font-semibold">{company_name}</span>
          </p>

          {/* Company name (read-only) */}
          <input
            value={company_name || ""}
            disabled
            className="w-full mb-4 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium">Job Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full mt-1 p-2 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Experience *</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Requirements (optional)
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Company Website (optional)
              </label>
              <input
                name="company_website"
                value={form.company_website}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              🚀 Post Job
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJobs;