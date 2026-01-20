import { Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const SavedJobCard = ({ job, onRemove }) => {
  const navigate = useNavigate();

  const handleRemove = async () => {
    try {
      await api.delete(`/savejobs/${job.saved_id}`);
      toast.success("Removed from saved jobs");
      onRemove(job.saved_id);
    } catch (err) {
      console.error(err);
      toast.error("Remove failed");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p className="text-gray-600">
        {job.company_name} • {job.location}
      </p>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => navigate(`/jobs/${job.job_id}`)}
          className="flex items-center gap-1 text-blue-600"
        >
          <Eye size={16} /> View
        </button>

        <button
          onClick={handleRemove}
          className="flex items-center gap-1 text-red-600"
        >
          <Trash2 size={16} /> Remove
        </button>
      </div>
    </div>
  );
};

export default SavedJobCard;