import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Jobs from "./pages/Jobs";
import PostJobs from "./pages/PostJobs";
import RecruiterApplications from "./pages/RecruiterApplications";
import Auth from "./pages/Auth";
import MyApplications from "./pages/MyApplications";
import ApplyForm from "./pages/ApplyForm";
import JobDetails from "./pages/JobDetails";
import { Toaster } from "react-hot-toast";


const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/" />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/jobs" />;
  }

  return children;
};

function App() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Auth />} />

          {/* Common */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Recruiter */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute role="recruiter">
                <PostJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/applications"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterApplications />
              </ProtectedRoute>
            }
          />

          {/* Candidate */}
          <Route
            path="/apply"
            element={
              <ProtectedRoute role="candidate">
                <ApplyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute role="candidate">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* EMpty or invalid*/}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
