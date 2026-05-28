import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedInRedirectPath, loginUser, registerUser } from "../api/auth";

function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      const token = data?.token || data?.data?.token;
      const user = data?.user || data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.error || "Login gagal. Coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overline */}
      <span className="font-body text-[11px] tracking-[0.25em] uppercase text-secondary mb-3">
        WELCOME BACK
      </span>

      {/* Headline */}
      <h2 className="font-display text-[32px] font-light leading-[1.2] text-primary mb-2">
        Sign in to continue
      </h2>

      {/* Subtext */}
      <p className="font-body text-[14px] text-on-surface-variant leading-relaxed mb-8 max-w-[300px] text-center">
        Save your favorite products and get personalized recommendations
        tailored to your skin.
      </p>

      {/* Divider */}
      <div className="w-full flex items-center mb-8">
        <div className="flex-grow border-t border-outline-variant" />
        <span className="px-4 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
          OR SIGN IN WITH EMAIL
        </span>
        <div className="flex-grow border-t border-outline-variant" />
      </div>

      {/* Form */}
      <div className="w-full flex flex-col gap-6 mb-6">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
            Email Address
          </label>
          <div
            className={`border-b transition-colors duration-200 ${focusedField === "email" ? "border-secondary" : "border-outline-variant"}`}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="your@email.com"
              className="w-full bg-transparent font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/50 outline-none py-2"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
              Password
            </label>
            <button className="font-body text-[10px] tracking-[0.1em] uppercase text-secondary hover:underline cursor-pointer">
              Forgot password?
            </button>
          </div>
          <div
            className={`border-b transition-colors duration-200 flex items-center ${focusedField === "password" ? "border-secondary" : "border-outline-variant"}`}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              className="flex-1 bg-transparent font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/50 outline-none py-2"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              {showPassword ? "visibility_off" : "visibility"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="w-full text-left font-body text-[12px] text-error mb-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary text-on-primary font-body text-[12px] tracking-[0.12em] uppercase py-4 hover:bg-on-surface-variant transition-colors duration-300 cursor-pointer disabled:opacity-60 mb-5"
      >
        {loading ? "SIGNING IN..." : "SIGN IN"}
      </button>

      {/* Switch to Register */}
      <p className="font-body text-[13px] text-on-surface-variant">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-secondary hover:underline cursor-pointer font-medium"
        >
          Create one
        </button>
      </p>
    </>
  );
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (passwordMatch) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser({
        namaLengkap: form.name,
        email: form.email,
        password: form.password,
      });
      onSwitch();
    } catch (err) {
      const message =
        err?.response?.data?.error || "Register gagal. Coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch =
    form.password && form.confirm && form.password !== form.confirm;

  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Adelia Saputri",
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      placeholder: "your@email.com",
    },
  ];

  return (
    <>
      {/* Overline */}
      <span className="font-body text-[11px] tracking-[0.25em] uppercase text-secondary mb-3">
        JOIN LUMIÈRE
      </span>

      {/* Headline */}
      <h2 className="font-display text-[32px] font-light leading-[1.2] text-primary mb-2">
        Create your account
      </h2>

      {/* Subtext */}
      <p className="font-body text-[14px] text-on-surface-variant leading-relaxed mb-7 max-w-[300px] text-center">
        Discover and curate your personal collection of premium skincare from
        around the world.
      </p>

      {/* Form */}
      <div className="w-full flex flex-col gap-5 mb-6">
        {/* Name + Email */}
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
              {label}
            </label>
            <div
              className={`border-b transition-colors duration-200 ${focusedField === key ? "border-secondary" : "border-outline-variant"}`}
            >
              <input
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField(null)}
                placeholder={placeholder}
                className="w-full bg-transparent font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/50 outline-none py-2"
              />
            </div>
          </div>
        ))}

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
            Password
          </label>
          <div
            className={`border-b transition-colors duration-200 flex items-center ${focusedField === "password" ? "border-secondary" : "border-outline-variant"}`}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="Min. 8 characters"
              className="flex-1 bg-transparent font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/50 outline-none py-2"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              {showPassword ? "visibility_off" : "visibility"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
            Confirm Password
          </label>
          <div
            className={`border-b transition-colors duration-200 flex items-center ${
              passwordMatch
                ? "border-error"
                : focusedField === "confirm"
                  ? "border-secondary"
                  : "border-outline-variant"
            }`}
          >
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              placeholder="Re-enter your password"
              className="flex-1 bg-transparent font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/50 outline-none py-2"
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              {showConfirm ? "visibility_off" : "visibility"}
            </button>
          </div>
          {passwordMatch && (
            <span className="font-body text-[11px] text-error">
              Passwords do not match
            </span>
          )}
        </div>
      </div>

      {error && (
        <p className="w-full text-left font-body text-[12px] text-error mb-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || passwordMatch}
        className="w-full bg-primary text-on-primary font-body text-[12px] tracking-[0.12em] uppercase py-4 hover:bg-on-surface-variant transition-colors duration-300 cursor-pointer disabled:opacity-60 mb-4"
      >
        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </button>

      {/* Disclaimer */}
      <p className="font-body text-[11px] text-on-surface-variant text-center leading-relaxed max-w-[280px] mb-4">
        By creating an account, you agree to our{" "}
        <span className="text-secondary cursor-pointer hover:underline">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-secondary cursor-pointer hover:underline">
          Privacy Policy
        </span>
        .
      </p>

      {/* Switch to Login */}
      <p className="font-body text-[13px] text-on-surface-variant">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-secondary hover:underline cursor-pointer font-medium"
        >
          Sign in
        </button>
      </p>
    </>
  );
}

function AuthPage({ onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = getLoggedInRedirectPath();

    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1629380823206-f7f5a7b7d2ab?w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[460px] h-[640px] max-h-[85vh] bg-surface-container-lowest border border-outline-variant flex flex-col items-center text-center px-12 pt-12 pb-8 z-10 overflow-hidden">
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer p-1"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Tab switcher */}
        <div className="flex w-full mb-8 border-b border-outline-variant">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 pb-3 font-body text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer ${
              mode === "login"
                ? "text-primary border-b-2 border-secondary -mb-px"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 pb-3 font-body text-[11px] tracking-[0.15em] uppercase transition-colors cursor-pointer ${
              mode === "register"
                ? "text-primary border-b-2 border-secondary -mb-px"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form content */}
        <div className="w-full flex-1 min-h-0 flex flex-col items-center overflow-y-auto pr-2">
          {mode === "login" ? (
            <LoginForm onSwitch={() => setMode("register")} onClose={onClose} />
          ) : (
            <RegisterForm onSwitch={() => setMode("login")} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
