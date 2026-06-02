import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

function Navbar({
  placeholder = "Search...",
  searchValue,
  searchFocused,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onClear,
  active = null,
}) {
  const navigate = useNavigate();
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isLoggedIn = isAuthenticated();

  const value = searchValue ?? internalValue;
  const focused = searchFocused ?? isFocused;
  const showClear = Boolean(value);

  const handleChange = (event) => {
    if (onSearchChange) {
      onSearchChange(event);
      return;
    }
    setInternalValue(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onSearchFocus) {
      onSearchFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onSearchBlur) {
      onSearchBlur();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }
    setInternalValue("");
  };

  const favoriteActive = active === "favorites";
  const profileActive = active === "profile";
  const borderClass = focused ? "border-secondary" : "border-outline-variant";

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    navigate("/favorites");
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    navigate("/profile");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-bright border-b border-outline-variant h-[80px] flex items-center px-8 gap-6">
      <span
        onClick={() => navigate("/")}
        className="font-display text-[22px] tracking-[0.2em] uppercase text-primary cursor-pointer select-none whitespace-nowrap"
      >
        LUMIÈRE
      </span>

      <div
        className={`flex-1 max-w-[520px] mx-auto flex items-center border-b transition-colors duration-300 ${borderClass}`}
      >
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">
          search
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-transparent text-[14px] tracking-wide text-on-surface placeholder:text-on-surface-variant outline-none py-2"
        />
        {showClear && (
          <button
            onClick={handleClear}
            className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer"
          >
            close
          </button>
        )}
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <div className="relative flex flex-col items-center">
          <button
            onClick={handleFavoriteClick}
            className={`material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity ${
              favoriteActive ? "text-secondary" : "text-on-surface-variant"
            }`}
            style={{
              fontVariationSettings: favoriteActive ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </button>
          {favoriteActive && (
            <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-secondary" />
          )}
        </div>
        {isLoggedIn ? (
          <button
            onClick={handleProfileClick}
            className={`material-symbols-outlined cursor-pointer hover:text-secondary transition-colors ${
              profileActive ? "text-secondary" : "text-on-surface-variant"
            }`}
            style={{
              fontVariationSettings: profileActive ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            person
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="border border-outline-variant text-on-surface-variant font-body text-[10px] tracking-[0.2em] uppercase px-4 py-2 hover:border-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
