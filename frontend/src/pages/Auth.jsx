import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company_name: "",
    company_website: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("role", res.data.user.role);

        if (res.data.user.company_name) {
          localStorage.setItem("company_name", res.data.user.company_name);
        }

        navigate("/jobs");
      } else {
        // REGISTER
        await api.post("/auth/register", form);
        alert("Registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-linear-to-br from-blue-300 to-blue-400">
      <div>
        <h1 className="text-gray-950 text-3xl py-6 font-semibold ">
          Welcome to Smart Job Portal
        </h1>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />

              <select
                name="role"
                onChange={handleChange}
                className="border p-2 w-full rounded cursor-pointer"
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>

              {form.role === "recruiter" && (
                <>
                  <input
                    name="company_name"
                    placeholder="Company Name"
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    required
                  />

                  <input
                    name="company_website"
                    placeholder="Company Website (optional)"
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />
                </>
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <button className="bg-blue-600 text-white text-xl w-full py-2 rounded">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          className="text-xl text-center mt-4 cursor-pointer text-blue-600"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
