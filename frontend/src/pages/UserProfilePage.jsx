import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMe, isAuthenticated } from "../api/auth";

const defaultUser = {
  initials: "--",
  name: "",
  email: "",
  joined: "",
  favoritesCount: 0,
};

const savedProducts = [
  {
    id: 1,
    country: "FRANCE",
    brand: "LA MER",
    name: "Crème de la Mer",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80",
  },
  {
    id: 2,
    country: "JAPAN",
    brand: "SK-II",
    name: "Facial Treatment Essence",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
  },
  {
    id: 3,
    country: "SWISS",
    brand: "LA PRAIRIE",
    name: "Skin Caviar Luxe Cream",
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=400&q=80",
  },
  {
    id: 4,
    country: "USA",
    brand: "AUGUSTINUS",
    name: "The Rich Cream",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
  },
];

const infoFields = [
  { label: "FULL NAME", key: "name" },
  { label: "EMAIL", key: "email" },
  { label: "JOINED", key: "joined" },
  { label: "FAVORITES", key: "favoritesCount", suffix: " products" },
];

const formatJoined = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const getInitials = (name, email) => {
  const base = (name || "").trim();
  if (base) {
    return base
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "--";
};

function UserProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [signOutConfirm, setSignOutConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const name = parsed?.namaLengkap || parsed?.name || "";
        const email = parsed?.email || "";
        const joined = formatJoined(parsed?.createdAt) || "";

        setCurrentUser({
          ...defaultUser,
          name,
          email,
          joined,
          initials: getInitials(name, email),
        });
        setFormData({ name, email });
      } catch {
        // Ignore parse errors
      }
    }

    const loadProfile = async () => {
      try {
        const data = await getMe();
        const name = data?.namaLengkap || data?.name || "";
        const email = data?.email || "";
        const joined = formatJoined(data?.createdAt) || "";

        setCurrentUser({
          ...defaultUser,
          name,
          email,
          joined,
          initials: getInitials(name, email),
        });
        setFormData({ name, email });
      } catch (err) {
        setProfileError(err?.response?.data?.error || "Gagal memuat profil.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => setEditMode(false);
  const handleCancel = () => {
    setFormData({ name: currentUser.name, email: currentUser.email });
    setEditMode(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col">
      <Navbar placeholder="Search..." active="profile" />

      {isLoading && (
        <main className="flex-1 pt-[80px] mt-3 max-w-[1200px] w-full mx-auto px-8 py-12">
          <p className="font-body text-[13px] text-on-surface-variant">
            Memuat profil...
          </p>
        </main>
      )}

      {!isLoading && profileError && (
        <main className="flex-1 pt-[80px] mt-3 max-w-[1200px] w-full mx-auto px-8 py-12">
          <p className="font-body text-[13px] text-error">{profileError}</p>
        </main>
      )}

      {!isLoading && !profileError && (
        <main className="flex-1 pt-[80px] mt-5 max-w-[1200px] w-full mx-auto px-8 py-12 flex flex-col gap-12">
          {/* ── PROFILE HEADER ── */}
          <section className="flex items-start gap-6">
            <div className="w-[72px] h-[72px] border border-outline-variant flex items-center justify-center flex-shrink-0">
              <span className="font-display text-[22px] tracking-wider text-on-surface-variant select-none">
                {currentUser.initials}
              </span>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary">
                {currentUser.joined
                  ? `MEMBER SINCE ${currentUser.joined.split(" ")[0].toUpperCase()}`
                  : "MEMBER"}
              </span>
              <h1 className="font-display text-[38px] leading-[1.1] text-primary">
                {editMode ? formData.name : currentUser.name}
              </h1>
              <span className="font-body text-[13px] text-on-surface-variant">
                {editMode ? formData.email : currentUser.email}
              </span>
            </div>

            <div className="flex-shrink-0 mt-1">
              {!signOutConfirm ? (
                <button
                  onClick={() => setSignOutConfirm(true)}
                  className="border border-outline-variant text-on-surface-variant font-body text-[11px] tracking-[0.12em] uppercase px-5 py-2.5 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  SIGN OUT
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-body text-[11px] text-on-surface-variant">
                    Sure?
                  </span>
                  <button
                    onClick={() => setSignOutConfirm(false)}
                    className="font-body text-[11px] tracking-[0.1em] uppercase text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="font-body text-[11px] tracking-[0.1em] uppercase text-error hover:underline cursor-pointer"
                  >
                    Yes, sign out
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="w-full h-px bg-outline-variant" />

          {/* ── SAVED FAVORITES ── */}
          <section>
            <div className="flex items-end justify-between mb-1">
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary">
                YOUR COLLECTION
              </span>
              <button className="flex items-center gap-1 font-body text-[11px] tracking-[0.1em] uppercase text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                VIEW ALL ({currentUser.favoritesCount})
                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </button>
            </div>
            <h2 className="font-display text-[28px] text-primary mb-1">
              Saved Favorites
            </h2>
            <div className="w-full h-px bg-outline-variant mb-6 mt-3" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border border-outline-variant hover:border-outline transition-colors duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative bg-[#FAF8F5] aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-surface-bright/80 cursor-pointer">
                      <span
                        className="material-symbols-outlined text-[15px] text-secondary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="p-3 flex flex-col gap-0.5">
                    <div className="flex justify-between">
                      <span className="font-body text-[9px] tracking-[0.15em] uppercase text-secondary">
                        {product.country}
                      </span>
                      <span className="font-body text-[9px] tracking-[0.1em] uppercase text-on-surface-variant">
                        {product.brand}
                      </span>
                    </div>
                    <h3 className="font-display text-[14px] leading-[1.3] text-primary mt-1">
                      {product.name}
                    </h3>
                    <button className="mt-2.5 w-full border border-primary text-primary font-body text-[10px] tracking-[0.1em] uppercase py-2 hover:bg-primary hover:text-on-primary transition-colors duration-300 cursor-pointer">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="w-full h-px bg-outline-variant" />

          {/* ── PERSONAL INFORMATION ── */}
          <section>
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-secondary block mb-1">
              ACCOUNT DETAILS
            </span>
            <h2 className="font-display text-[28px] text-primary mb-3">
              Personal Information
            </h2>
            <div className="w-full h-px bg-outline-variant mb-6" />

            {editMode ? (
              <div className="flex flex-col gap-6 w-full max-w-[720px]">
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "email", label: "Email Address", type: "email" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
                      {label}
                    </label>
                    <div
                      className={`border-b transition-colors duration-200 ${
                        focusedField === key
                          ? "border-secondary"
                          : "border-outline-variant"
                      }`}
                    >
                      <input
                        type={type}
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent font-body text-[14px] text-on-surface outline-none py-2"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="bg-primary text-on-primary font-body text-[11px] tracking-[0.12em] uppercase px-8 py-3 hover:bg-on-surface-variant transition-colors cursor-pointer"
                  >
                    SAVE CHANGES
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border border-outline-variant text-on-surface-variant font-body text-[11px] tracking-[0.12em] uppercase px-8 py-3 hover:border-outline hover:text-on-surface transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 w-full">
                {infoFields.map(({ label, key, suffix }) => (
                  <div
                    key={key}
                    className="py-4 border-b border-outline-variant pr-8"
                  >
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant block mb-1">
                      {label}
                    </span>
                    <span className="font-body text-[14px] text-on-surface">
                      {key === "favoritesCount"
                        ? `${currentUser[key]}${suffix}`
                        : currentUser[key]}
                    </span>
                  </div>
                ))}

                <div className="col-span-full pt-6">
                  <button
                    onClick={() => setEditMode(true)}
                    className="border border-primary text-primary font-body text-[11px] tracking-[0.12em] uppercase px-8 py-3 hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                  >
                    EDIT PROFILE
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      <Footer links={["ABOUT", "CONTACT", "PRIVACY", "TERMS"]} />
    </div>
  );
}

export default UserProfilePage;
