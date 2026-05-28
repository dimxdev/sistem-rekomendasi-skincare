import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import serumImage from "../../assets/serum.webp";
import { getLoggedInRedirectPath, loginAdmin } from "../../api/auth";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const redirectPath = getLoggedInRedirectPath();

    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginAdmin({
        username,
        password,
      });
      const data = result?.data || result || {};

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      if (data?.admin) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal login admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin h-screen w-screen overflow-hidden flex">
      {/* LEFT — Login Form */}
      <div
        className="w-full lg:w-1/2 h-full flex flex-col relative z-10"
        style={{ backgroundColor: "var(--color-admin-surface-container-low)" }}
      >
        {/* Top Logo */}
        <div className="px-12 pt-10 pb-6 flex-none">
          <p
            className="font-admin-label mb-1.5"
            style={{ color: "var(--color-admin-primary-container)" }}
          >
            Admin Portal
          </p>
          <h1
            className="font-admin-headline-md uppercase tracking-[0.2em]"
            style={{ color: "var(--color-admin-on-surface)" }}
          >
            LUMIÈRE
          </h1>
        </div>

        {/* Form */}
        <div className="flex-1 min-h-0 flex flex-col justify-center px-12 max-w-[520px] w-full self-center gap-10">
          {/* Headline */}
          <div>
            <h2
              className="font-admin-display-xl mb-3"
              style={{ color: "var(--color-admin-on-surface)" }}
            >
              Welcome{" "}
              <em
                className="italic"
                style={{ color: "var(--color-admin-on-surface)" }}
              >
                back
              </em>
            </h2>
            <p
              className="font-admin-body-lg"
              style={{ color: "var(--color-admin-on-surface-variant)" }}
            >
              Sign in to manage products, users, and curate the Lumière
              experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label
                className="font-admin-label"
                style={{ color: "var(--color-admin-primary-container)" }}
              >
                Username
              </label>
              <div
                className="transition-colors duration-200"
                style={{
                  borderBottom: `1px solid ${
                    focusedField === "username"
                      ? "var(--color-admin-primary-container)"
                      : "var(--color-admin-outline-variant)"
                  }`,
                }}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin"
                  className="w-full bg-transparent font-admin-body-md outline-none py-2"
                  style={{ color: "var(--color-admin-on-surface)" }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                className="font-admin-label"
                style={{ color: "var(--color-admin-primary-container)" }}
              >
                Password
              </label>
              <div
                className="flex items-center transition-colors duration-200"
                style={{
                  borderBottom: `1px solid ${
                    focusedField === "password"
                      ? "var(--color-admin-primary-container)"
                      : "var(--color-admin-outline-variant)"
                  }`,
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent font-admin-body-md outline-none py-2"
                  style={{ color: "var(--color-admin-on-surface)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined text-[20px] cursor-pointer transition-colors"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-2">
              {error && (
                <p
                  className="font-admin-data"
                  style={{ color: "var(--color-admin-error)" }}
                >
                  {error}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="font-admin-data transition-colors cursor-pointer hover:underline"
                  style={{ color: "var(--color-admin-on-surface-variant)" }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-admin-label tracking-widest transition-colors duration-200 cursor-pointer disabled:opacity-60"
                style={{
                  backgroundColor: "var(--color-admin-on-surface)",
                  color: "var(--color-admin-surface)",
                }}
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Disclaimer */}
        <div className="px-12 pb-10 pt-6 flex-none">
          <p
            className="font-admin-data flex items-center gap-2"
            style={{
              color: "var(--color-admin-on-surface-variant)",
              opacity: 0.6,
            }}
          >
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Authorized personnel only. All activity is logged.
          </p>
        </div>
      </div>

      {/* RIGHT — Image */}
      <div
        className="hidden lg:block w-1/2 h-full relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-admin-surface-variant)",
          borderLeft: "1px solid var(--color-admin-outline-variant)",
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${serumImage})` }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(30,27,24,0.65) 0%, rgba(30,27,24,0.1) 50%, transparent 100%)",
          }}
        />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 p-10 text-left">
          <p
            className="font-admin-label tracking-widest mb-4"
            style={{ color: "var(--color-admin-primary-container)" }}
          >
            Est. 2026
          </p>
          <p
            className="font-admin-headline-md italic font-light"
            style={{ color: "var(--color-admin-surface)" }}
          >
            "Curating the world's finest skincare, one product at a time."
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
