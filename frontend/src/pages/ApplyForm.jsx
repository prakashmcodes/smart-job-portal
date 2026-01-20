import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const ApplyForm = ({ jobId, jobTitle, closeModal, onApplied }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF resumes allowed");
      return;
    }
    setResume(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !resume) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", resume);

    try {
      setLoading(true);
      await api.post("/applications", formData);
      toast.success("Application submitted 🎉");
      onApplied(jobId);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Apply failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-2 text-center">
          Apply for {jobTitle}
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Upload your resume and submit application
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Your Full Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div
  onDragOver={(e) => {
    e.preventDefault();
    setDragOver(true);
  }}
  onDragLeave={() => setDragOver(false)}
  onDrop={handleDrop}
  className={`border-2 border-dashed rounded-lg p-4 text-center ${
    dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
  }`}
>
  {!resume ? (
    <div
      className="cursor-pointer"
      onClick={() => document.getElementById("resumeInput").click()}
    >
      <p className="text-gray-500">
        Drag & drop your resume here or click to upload (PDF only)
      </p>
    </div>
  ) : (
    <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded p-2">
      <p className="text-green-700 text-sm font-semibold truncate">
        {resume.name}
      </p>

      <button
        type="button"
        onClick={() => setResume(null)}
        className="text-red-500 font-bold text-lg cursor-pointer hover:text-red-700"
        title="Remove resume"
      >
      <X />
      </button>
    </div>
  )}

  <input
    id="resumeInput"
    type="file"
    hidden
    accept="application/pdf"
    onChange={(e) => handleFileSelect(e.target.files[0])}
  />
</div>


          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-100"
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
