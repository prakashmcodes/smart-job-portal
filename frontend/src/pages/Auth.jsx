import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building2, Globe, LogIn, UserPlus } from "lucide-react";

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("role", res.data.user.role);

        navigate("/jobs");
      } else {
        await api.post("/auth/register", form);
        alert("Registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-800 to-green-500">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl w-95 p-8 text-white">

        <h1 className="text-3xl font-bold text-center mb-1">
          Smart Job Portal
        </h1>
        <p className="text-center text-sm text-white/80 mb-6">
          {isLogin ? "Welcome back, let’s get you hired." : "Create your professional profile"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <>
              <div className="flex items-center bg-white/90 rounded px-3 text-black">
                <User size={18} />
                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="bg-transparent w-full p-2 outline-none text-black"
                  required
                />
              </div>

              <select
                name="role"
                onChange={handleChange}
                className="w-full bg-white/20 p-2 rounded outline-none cursor-pointer"
              >
                <option className="bg-green-400 cursor-pointer" value="candidate">Candidate</option>
                <option className="bg-green-400 cursor-pointer" value="recruiter">Recruiter</option>
              </select>

              {form.role === "recruiter" && (
                <>
                  <div className="flex items-center bg-white/90 text-black rounded px-3">
                    <Building2 size={18} />
                    <input
                      name="company_name"
                      placeholder="Company Name"
                      onChange={handleChange}
                      className="bg-transparent w-full p-2 outline-none text-black"
                      required
                    />
                  </div>

                  <div className="flex items-center bg-white/90 rounded px-3 text-black">
                    <Globe size={18} />
                    <input
                      name="company_website"
                      placeholder="Company Website"
                      onChange={handleChange}
                      className="bg-transparent w-full p-2 outline-none text-black"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex items-center bg-white/90 rounded px-3 text-black">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="bg-transparent w-full p-2 outline-none text-black"
              required
            />
          </div>

          <div className="flex items-center bg-white/90 rounded px-3 text-black">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="bg-transparent w-full p-2 outline-none text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-2 rounded-lg hover:scale-105 transition cursor-pointer"
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          className="text-center mt-5 text-sm text-white/90 cursor-pointer hover:underline"
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
