import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full z-20 bg-slate-200 border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 py-6">

        {/* Job POrtal Title */}
        <Link to="/jobs" className="text-2xl font-bold text-gray-800">
          Smart Job Portal
        </Link>

        {/* Links */}
        <ul className="flex gap-6 items-center text-xl font-semibold text-gray-700">

          <li>
            <Link to="/jobs" className="hover:text-blue-600">
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="hover:text-blue-600">
              Saved Jobs
            </Link>
          </li>

          {/* Candidate Links */}
          {role === "candidate" && (
            <li>
              <Link to="/my-applications" className="hover:text-blue-600">
                My Applications
              </Link>
            </li>
          )}

          {/* Recruiter Links */}
          {role === "recruiter" && (
            <>
              <li>
                <Link to="/post-job" className="hover:text-blue-600">
                  Post Job
                </Link>
              </li>
              <li>
                <Link to="/recruiter/applications" className="hover:text-blue-600">
                  Applications
                </Link>
              </li>
            </>
          )}

          {/* Logout */}
          <li>
            <button
              onClick={logout}
              className="hover:bg-red-500 rounded-full text-black px-3 py-1 cursor-pointer  hover:text-gray-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
