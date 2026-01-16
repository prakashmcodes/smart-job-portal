import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ApplyForm = ({ jobId, closeModal, onApplied }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("userId");

    if (!name || !email || !resume) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("user_id", user_id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", resume);

    try {
      setLoading(true);

      await api.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully 🎉");

      onApplied(jobId);
      closeModal();
      navigate("/my-applications");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Apply failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Apply for Job</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your Email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="file"
            className="border p-2 w-full cursor-pointer"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
