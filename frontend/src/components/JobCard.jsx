import { useEffect, useState } from "react";
import ApplyForm from "../pages/ApplyForm";
import {
  Bookmark,
  BookmarkMinus,
  Eye,
  MapPin,
  Share,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const JobCard = ({ job, onApplied, mode = "jobs", onRemoved }) => {
  const navigate = useNavigate();

  const [showApply, setShowApply] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(job.saved_id || null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (mode === "jobs") {
      const checkSaved = async () => {
        const res = await api.get(`/savejobs/check?job_id=${job.id}`);
        setSaved(res.data.saved);
        setSavedId(res.data.saved_id);
      };
      checkSaved();
    }
  }, [job.id, mode]);

  const handleSaveJob = async () => {
    try {
      if (mode === "saved") {
        await api.delete(`/savejobs/${savedId}`);
        toast.success("Removed from saved jobs");
        onRemoved(savedId);
        return;
      }

      if (saved) {
        await api.delete(`/savejobs/${savedId}`);
        setSaved(false);
        setSavedId(null);
        toast.success("Removed from saved");
      } else {
        await api.post("/savejobs", { job_id: job.id });
        const check = await api.get(`/savejobs/check?job_id=${job.id}`);
        setSaved(true);
        setSavedId(check.data.saved_id);
        toast.success("Job saved");
      }
    } catch (err) {
      console.error(err);
      toast.error("Save action failed");
    }
  };

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply");
      return;
    }
    setShowApply(true);
  };

  return (
    <>
      <div className="bg-blue-500 p-6 rounded-xl shadow text-white">
        <div className="flex items-center justify-between">
          <h5 className="text-2xl font-semibold">{job.title}</h5>

          <div className="flex items-center gap-3">
            {saved ? (
              <BookmarkMinus
                onClick={handleSaveJob}
                className="cursor-pointer text-red-400 hover:scale-110 transition"
              />
            ) : (
              <Bookmark
                onClick={handleSaveJob}
                className="cursor-pointer text-white hover:text-yellow-300 hover:scale-110 transition"
              />
            )}

            <Share2
              onClick={() => setShowShare(true)}
              className="cursor-pointer hover:text-green-300"
            />
          </div>
        </div>

        {showShare && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-gray-500 p-5 rounded-lg w-80">
              <h3 className="text-lg font-semibold mb-3">Share Job</h3>

              <input
                readOnly
                value={`${window.location.origin}/jobs/${job.id}`}
                className="w-full border p-2 rounded mb-3 text-sm"
              />

              <div className="grid grid-cols-2 gap-2 mb-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    window.location.origin + "/jobs/" + job.id
                  )}`}
                  target="_blank"
                  className="bg-green-500 text-white text-center py-1 rounded"
                >
                  WhatsApp
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.origin + "/jobs/" + job.id
                  )}`}
                  target="_blank"
                  className="bg-blue-700 text-white text-center py-1 rounded"
                >
                  LinkedIn
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.origin + "/jobs/" + job.id
                  )}`}
                  target="_blank"
                  className="bg-black text-white text-center py-1 rounded"
                >
                  X (Twitter)
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/jobs/${job.id}`
                    );
                    toast.success("Link copied!");
                  }}
                  className="bg-gray-700 text-white py-1 rounded"
                >
                  Copy Link
                </button>
              </div>

              <button
                onClick={() => setShowShare(false)}
                className="w-full border py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <p className="mb-4">
          {job.company_name} <br />
          {job.created_at?.slice(0, 10)}
        </p>

        <p className="mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-white" />
          <span>{job.location}</span>
        </p>

        <div className="flex justify-between ">
          <button
            onClick={handleApplyClick}
            disabled={job.applied}
            className={`rounded-full px-4 py-2 ${
              job.applied
                ? "bg-gray-300 text-gray-600 cursor-pointer"
                : "bg-white text-black hover:bg-gray-200 cursor-pointer"
            }`}
          >
            {job.applied ? "APPLIED" : "APPLY"}
          </button>

          <button
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"
          >
            <Eye size={16} /> View
          </button>
        </div>
      </div>

      {showApply && (
        <ApplyForm
          jobId={job.id}
          jobTitle={job.title}
          closeModal={() => setShowApply(false)}
          onApplied={(id) => {
            setShowApply(false);
            onApplied?.(id);
            {
              saved ? (
                <BookmarkMinus
                  onClick={handleSaveJob}
                  className="cursor-pointer text-red-400"
                />
              ) : (
                <Bookmark
                  onClick={handleSaveJob}
                  className="cursor-pointer text-white hover:text-yellow-300"
                />
              );
            }
          }}
        />
      )}
    </>
  );
};

export default JobCard;
