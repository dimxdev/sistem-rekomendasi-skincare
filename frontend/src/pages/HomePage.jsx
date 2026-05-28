import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { isAuthenticated } from "../api/auth";
import { addFavorite, getFavorites, removeFavorite } from "../api/favorites";
import { getProducts } from "../api/products";

const filterOptions = {
  COUNTRY: ["Korea", "Japan", "France", "USA", "UK"],
  "PRODUCT TYPE": [
    "Cleanser",
    "Toner",
    "Serum",
    "Moisturizer",
    "Mask",
    "Sunscreen",
  ],
  "SKIN TYPE": ["Normal", "Dry", "Oily", "Combination", "Sensitive"],
  "SKIN CONCERN": [
    "Acne",
    "Anti-Aging",
    "Dark Spots",
    "Dryness",
    "Dullness",
    "Redness",
  ],
};

function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [liked, setLiked] = useState({});
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchFocused, setSearchFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getCountryLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.namaNegara || value.kodeNegara || value.name || "";
  };

  const getBrandLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.namaBrand || value.name || value.nama || "";
  };

  const getProductName = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.namaProduk || value.name || "";
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setPage(1);
  };

  const toggleLike = async (id) => {
    if (!isAuthenticated()) {
      navigate("/auth");
      return;
    }

    const nextLiked = !liked[id];
    setLiked((prev) => ({ ...prev, [id]: nextLiked }));

    try {
      if (nextLiked) {
        await addFavorite(id);
      } else {
        await removeFavorite(id);
      }
    } catch (err) {
      setLiked((prev) => ({ ...prev, [id]: !nextLiked }));
    }
  };

  const toggleFilter = (name) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  const toggleOption = (filterName, option) => {
    setSelectedFilters((prev) => {
      const current = prev[filterName] || [];
      return {
        ...prev,
        [filterName]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
    setPage(1);
  };

  const totalSelected = Object.values(selectedFilters).flat().length;

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    if (searchValue.trim()) {
      params.search = searchValue.trim();
    }

    const country = selectedFilters.COUNTRY?.[0];
    const type = selectedFilters["PRODUCT TYPE"]?.[0];
    const skinType = selectedFilters["SKIN TYPE"]?.[0];
    const concern = selectedFilters["SKIN CONCERN"]?.[0];

    if (country) params.country = country;
    if (type) params.type = type;
    if (skinType) params.skinType = skinType;
    if (concern) params.concern = concern;

    return params;
  }, [page, limit, searchValue, selectedFilters]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated()) {
        setLiked({});
        return;
      }

      try {
        const data = await getFavorites();
        const list = Array.isArray(data) ? data : data?.data || [];
        const nextLiked = list.reduce((acc, item) => {
          const productId = item?.productId || item?.product?.id;
          if (productId) {
            acc[productId] = true;
          }
          return acc;
        }, {});
        setLiked(nextLiked);
      } catch (err) {
        setLiked({});
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts(queryParams);
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.products || [];
        setProducts(list);
      } catch (err) {
        const message = err?.response?.data?.error || "Gagal memuat produk.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [queryParams]);

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col">
      <Navbar
        placeholder="Search curated skincare..."
        searchValue={searchValue}
        searchFocused={searchFocused}
        onSearchChange={handleSearchChange}
        onSearchFocus={() => setSearchFocused(true)}
        onSearchBlur={() => setSearchFocused(false)}
        onClear={handleSearchClear}
        active="favorites"
      />

      {/* HERO */}
      <section className="relative pt-[80px] min-h-[420px] flex items-end overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1629380823206-f7f5a7b7d2ab?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="relative z-10 w-full text-center pb-16 px-8">
          <span className="inline-block font-body text-[11px] tracking-[0.25em] uppercase text-secondary mb-4">
            Curated Skincare
          </span>
          <h1 className="font-display text-[52px] leading-[1.15] tracking-[0.03em] text-primary mb-4">
            Discover Your Skin's
            <br />
            <em className="not-italic italic">Essential</em>
          </h1>
          <p className="font-body text-[15px] text-on-surface-variant max-w-[400px] mx-auto leading-relaxed">
            A personalized selection of premium skincare from around the world
          </p>
          <div className="w-10 h-px bg-outline-variant mx-auto mt-6" />
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-[80px] z-40 bg-surface-bright border-b border-outline-variant px-8 py-3 flex items-center gap-6">
        <span className="font-body text-[12px] tracking-[0.1em] uppercase text-on-surface-variant">
          Filters
        </span>

        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {Object.keys(filterOptions).map((filterName) => {
            const count = (selectedFilters[filterName] || []).length;
            const isOpen = openFilter === filterName;
            return (
              <div key={filterName} className="relative">
                <button
                  onClick={() => toggleFilter(filterName)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase border transition-colors duration-200 cursor-pointer ${
                    count > 0
                      ? "border-secondary text-secondary bg-secondary/5"
                      : isOpen
                        ? "border-on-surface text-on-surface"
                        : "border-outline-variant text-on-surface-variant hover:border-outline"
                  }`}
                >
                  {count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-secondary text-on-secondary text-[9px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                  {filterName}
                  <span className="material-symbols-outlined text-[14px]">
                    {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  </span>
                </button>

                {/* Dropdown */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[220px] bg-surface-container-lowest border border-outline-variant shadow-sm z-50">
                    <div className="px-4 pt-3 pb-1">
                      <span className="font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
                        Filter by {filterName.toLowerCase()}
                      </span>
                    </div>
                    <div className="px-4 py-2 flex flex-col gap-2">
                      {filterOptions[filterName].map((option) => {
                        const checked = (
                          selectedFilters[filterName] || []
                        ).includes(option);
                        return (
                          <label
                            key={option}
                            className="flex items-center gap-2.5 cursor-pointer group"
                          >
                            <div
                              onClick={() => toggleOption(filterName, option)}
                              className={`w-4 h-4 border flex items-center justify-center transition-colors cursor-pointer ${
                                checked
                                  ? "bg-secondary border-secondary"
                                  : "border-outline-variant group-hover:border-outline"
                              }`}
                            >
                              {checked && (
                                <span className="material-symbols-outlined text-[12px] text-on-secondary">
                                  check
                                </span>
                              )}
                            </div>
                            <span
                              onClick={() => toggleOption(filterName, option)}
                              className={`text-[13px] transition-colors ${checked ? "text-on-surface" : "text-on-surface-variant"}`}
                            >
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex justify-between px-4 py-3 border-t border-outline-variant">
                      <button
                        onClick={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            [filterName]: [],
                          }))
                        }
                        className="font-body text-[11px] tracking-[0.08em] uppercase text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setOpenFilter(null)}
                        className="font-body text-[11px] tracking-[0.08em] uppercase text-secondary cursor-pointer"
                      >
                        Apply{" "}
                        {(selectedFilters[filterName] || []).length > 0
                          ? `(${(selectedFilters[filterName] || []).length})`
                          : ""}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Count + Clear */}
        <div className="flex items-center gap-4 ml-auto whitespace-nowrap">
          <span className="font-body text-[12px] text-on-surface-variant">
            Showing {products.length} products
          </span>
          {totalSelected > 0 && (
            <button
              onClick={() => {
                setSelectedFilters({});
                setPage(1);
              }}
              className="font-body text-[11px] tracking-[0.1em] uppercase text-secondary hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="flex-1 px-8 py-10">
        {isLoading && (
          <p className="font-body text-[13px] text-on-surface-variant mb-6">
            Memuat produk...
          </p>
        )}
        {error && (
          <p className="font-body text-[13px] text-error mb-6">{error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-surface-container-lowest border border-outline-variant hover:border-outline transition-colors duration-300 flex flex-col cursor-pointer"
            >
              {/* Image */}
              <div className="relative bg-[#FAF8F5] aspect-square overflow-hidden">
                <img
                  src={product.imageUrl || product.image}
                  alt={getProductName(product)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Like Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike(product.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface-bright/80 backdrop-blur-sm hover:bg-surface-bright transition-colors cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-colors ${liked[product.id] ? "text-secondary" : "text-on-surface-variant"}`}
                    style={{
                      fontVariationSettings: liked[product.id]
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-body text-[10px] tracking-[0.15em] uppercase text-secondary">
                    {getCountryLabel(product.country || product.negara)}
                  </span>
                  <span className="font-body text-[10px] tracking-[0.1em] uppercase text-on-surface-variant">
                    {getBrandLabel(product.brand)}
                  </span>
                </div>
                <h2 className="font-display text-[18px] leading-[1.3] text-primary mb-2 mt-1">
                  {getProductName(product)}
                </h2>
                <p className="font-body text-[13px] text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
                  {product.description}
                </p>
                <span className="mt-4 w-full border border-primary text-primary font-body text-[11px] tracking-[0.12em] uppercase py-3 text-center hover:bg-primary hover:text-on-primary transition-colors duration-300">
                  VIEW DETAILS
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="max-w-[1200px] mx-auto flex items-center justify-between mt-10">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="border border-outline-variant text-on-surface-variant font-body text-[11px] tracking-[0.12em] uppercase px-6 py-2.5 hover:border-outline hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="font-body text-[12px] text-on-surface-variant">
            Page {page}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={products.length < limit}
            className="border border-outline-variant text-on-surface-variant font-body text-[11px] tracking-[0.12em] uppercase px-6 py-2.5 hover:border-outline hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </main>

      <Footer />

      {/* Click outside to close filter */}
      {openFilter && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenFilter(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
