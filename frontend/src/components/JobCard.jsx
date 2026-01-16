import { useState } from "react";
import ApplyForm from "../pages/ApplyForm";
import { Save } from "lucide-react";

const JobCard = ({ job, onApplied }) => {
  const [showApply, setShowApply] = useState(false);

  const handleApplyClick = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login to apply for jobs");
      return;
    }

    setShowApply(true);
  };

  return (
    <>
      <div className="bg-blue-500 block p-6 rounded-xl shadow text-white">
        <div className="flex items-center justify-between">
          <h5 className="mb-3 text-2xl font-semibold capitalize">
            {job.title}
          </h5>

          <Save className="cursor-pointer hover:text-yellow-300" />
        </div>

        <p className="mb-6 capitalize">
          {job.company_name} • {job.location}
        </p>

        <button
          onClick={handleApplyClick}
          disabled={job.applied}
          className={`rounded-full px-4 py-2 font-semibold ${
            job.applied
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-50 hover:bg-slate-200 text-black cursor-pointer"
          }`}
        >
          {job.applied ? "APPLIED" : "APPLY"}
        </button>
      </div>

      {showApply && (
        <ApplyForm
          jobId={job.id}
          closeModal={() => setShowApply(false)}
          onApplied={onApplied}
        />
      )}
    </>
  );
};

export default JobCard;
