import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });
console.log("LOGIN RESPONSE:", response);
      login(response.token, response.user);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left branding section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Building2 size={30} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">BHL CRM</h1>
              <p className="text-slate-200">
                Lead Management Intelligence Platform
              </p>
            </div>
          </div>

          <h2 className="text-6xl font-semibold leading-tight mb-4">
            Manage Leads.
            <br />
            Track Performance.
            <br />
            Close Faster.
          </h2>
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
            <ShieldCheck className="text-cyan-300" />
            <div>
              <h3 className="font-semibold">Secure Role-Based Access</h3>
              <p className="text-sm text-slate-200">
                Protected dashboards for admins, managers, and executives.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
            <TrendingUp className="text-cyan-300" />
            <div>
              <h3 className="font-semibold">Real-Time Analytics</h3>
              <p className="text-sm text-slate-200">
                Track hot leads, conversions, and source performance instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right login section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-xl p-4 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg mb-4">
                <Building2 size={28} />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-2">
                Sign in to access your CRM dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Enterprise CRM Dashboard Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;