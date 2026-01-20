import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-100 pt-28 px-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Recruiter Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            onClick={() => navigate("/post-job")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
            <p className="text-gray-600">
              Create a new job opening and start hiring.
            </p>
          </div>

          <div
            onClick={() => navigate("/recruiter-applications")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold mb-2">View Applications</h3>
            <p className="text-gray-600">
              Review candidates who applied to your jobs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterDashboard;
