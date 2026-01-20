import { useEffect, useState } from "react";
import api from "../api/axios";
import NavBar from "../components/NavBar";

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/recruiter");
setApplications(res.data.applications);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [userId, role]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-100 pt-28 px-4 flex justify-center">
        <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Applications for Your Jobs
          </h2>

          {applications.length === 0 && (
            <p className="text-center text-gray-500">
              No candidates have applied yet.
            </p>
          )}

          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Candidate</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Job</th>
                  <th className="p-3 border">Applied</th>
                  <th className="p-3 border">Resume</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Update</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="text-center hover:bg-gray-50">
                    <td className="p-2 border">{app.name}</td>
                    <td className="p-2 border">{app.email}</td>
                    <td className="p-2 border">{app.job_title}</td>
                    <td className="p-2 border">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      <a
                        href={`http://localhost:5000/uploads/${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="p-2 border">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          app.status === "Applied"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "Shortlisted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStatus(app.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterApplications;
