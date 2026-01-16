import { useEffect, useState } from "react";
import api from "../api/axios";
import NavBar from "../components/NavBar";
import { CalendarDays, Briefcase } from "lucide-react";

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchApps = async () => {
      const res = await api.get(`/applications?user_id=${userId}`);
      setApps(res.data);
    };
    fetchApps();
  }, [userId]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-100 pt-28 px-4 flex justify-center">
        <div className="w-full max-w-4xl">

          {/* Page Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              My Job Applications
            </h2>
            <p className="text-gray-600 mt-2">
              Track the jobs taht you were have applied and their status here.
            </p>
          </div>

          {/* Empty State */}
          {apps.length === 0 && (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <p className="text-lg font-semibold text-gray-700">
                You haven’t applied for any jobs yet.
              </p>
              <p className="text-gray-500 mt-2">
                Start exploring opportunities and apply to your first job!
              </p>
            </div>
          )}

          {/* Applications List */}
          <div className="grid gap-5">
            {apps.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {app.job_title}
                </h3>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={16} />
                    Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </span>

                  <span className="flex items-center gap-1">
                    <Briefcase size={16} />
                    Application Status
                  </span>
                </div>

                {/* STatuse */}
                <div className="mt-4">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                      app.status === "Applied"
                        ? "bg-yellow-100 text-yellow-800"
                        : app.status === "Shortlisted"
                        ? "bg-blue-100 text-blue-800"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default MyApplications;
