import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFavorites, removeFavorite } from "../api/favorites";

const allProducts = [
  {
    id: 1,
    country: "JAPAN",
    brand: "SK-II",
    name: "Facial Treatment Essence",
    description:
      "A powerful anti-aging essence that visibly smooths texture and brightens skin.",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&q=80",
    tags: ["Toner", "Normal", "Anti-Aging"],
  },
  {
    id: 2,
    country: "FRANCE",
    brand: "Caudalie",
    name: "Vinoperfect Radiance Serum",
    description:
      "A highly concentrated, oil-free serum that improves radiance and evens skin tone.",
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=400&q=80",
    tags: ["Serum", "Combination", "Dark Spots"],
  },
  {
    id: 3,
    country: "SOUTH KOREA",
    brand: "Beauty of Joseon",
    name: "Dynasty Cream",
    description:
      "A luxurious cream enriched with ginseng water and rice bran for deep hydration and a radiant glow.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    tags: ["Moisturizer", "Dry", "Dullness"],
  },
  {
    id: 4,
    country: "USA",
    brand: "Tatcha",
    name: "The Rice Wash",
    description:
      "A softly foaming cleanser with rice powder that washes away impurities without stripping the skin.",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    tags: ["Cleanser", "Sensitive", "Dryness"],
  },
];

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

function EmptyState({ onExplore }) {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-8 py-24 text-center">
      <div className="max-w-[440px] flex flex-col items-center gap-5">
        {/* Heart Icon */}
        <div className="w-20 h-20 flex items-center justify-center mb-2">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5l7 7 7-7z"
              stroke="#B8956A"
              strokeWidth="1"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </div>

        <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary">
          YOUR COLLECTION
        </span>

        <h1 className="font-display text-[48px] leading-[1.2] tracking-[0.03em] text-primary">
          No favorites yet
        </h1>

        <p className="font-body text-[15px] text-on-surface-variant leading-relaxed max-w-[360px]">
          Start exploring our curated selection and save the products that speak
          to you. Your favorites will appear here.
        </p>

        <div className="pt-6">
          <button
            onClick={onExplore}
            className="bg-primary text-on-primary font-body text-[12px] tracking-[0.12em] uppercase px-10 py-4 hover:bg-on-surface-variant transition-colors duration-300 cursor-pointer"
          >
            EXPLORE PRODUCTS
          </button>
        </div>
      </div>
    </main>
  );
}

function FilledState({ products, onRemove }) {
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleFilter = (name) =>
    setOpenFilter(openFilter === name ? null : name);

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
  };

  const totalSelected = Object.values(selectedFilters).flat().length;

  return (
    <>
      {/* Page Header */}
      <section className="pt-[80px] pb-10 px-8 text-center border-b border-outline-variant">
        <span className="font-body text-[11px] tracking-[0.2em] uppercase text-secondary block mb-3">
          YOUR COLLECTION
        </span>
        <h1 className="font-display text-[48px] leading-[1.2] tracking-[0.03em] text-primary mb-2">
          Saved <em className="not-italic italic">Favorites</em>
        </h1>
        <p className="font-body text-[14px] text-on-surface-variant">
          {products.length} products curated just for you
        </p>
        <div className="w-10 h-px bg-outline-variant mx-auto mt-5" />
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[80px] z-40 bg-surface-bright border-b border-outline-variant px-8 py-3 flex items-center gap-4 flex-wrap">
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

                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[220px] bg-surface-container-lowest border border-outline-variant z-50">
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
                              className={`w-4 h-4 border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                                checked
                                  ? "bg-secondary border-secondary"
                                  : "border-outline-variant group-hover:border-outline"
                              }`}
                            >
                              {checked && (
                                <span className="material-symbols-outlined text-[11px] text-on-secondary">
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
                        Apply
                        {(selectedFilters[filterName] || []).length > 0
                          ? ` (${(selectedFilters[filterName] || []).length})`
                          : ""}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 ml-auto whitespace-nowrap">
          <span className="font-body text-[12px] text-on-surface-variant">
            Showing {products.length} saved products
          </span>
          {totalSelected > 0 && (
            <button
              onClick={() => setSelectedFilters({})}
              className="font-body text-[11px] tracking-[0.1em] uppercase text-secondary hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {openFilter && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpenFilter(null)}
          />
        )}
      </div>

      {/* Product Grid */}
      <main className="flex-1 px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-surface-container-lowest border border-outline-variant hover:border-outline transition-colors duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative bg-[#FAF8F5] aspect-square overflow-hidden">
                <img
                  src={product.imageUrl || product.image}
                  alt={product.namaProduk || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Remove from favorites */}
                <button
                  onClick={() => onRemove(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface-bright/80 backdrop-blur-sm hover:bg-surface-bright transition-colors cursor-pointer"
                  aria-label="Remove from favorites"
                >
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-body text-[10px] tracking-[0.15em] uppercase text-secondary">
                    {product.country?.namaNegara ||
                      product.country?.kodeNegara ||
                      product.country}
                  </span>
                  <span className="font-body text-[10px] tracking-[0.1em] uppercase text-on-surface-variant">
                    {product.brand}
                  </span>
                </div>
                <h2 className="font-display text-[18px] leading-[1.3] text-primary mb-2 mt-1">
                  {product.namaProduk || product.name}
                </h2>
                <p className="font-body text-[13px] text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
                  {product.manfaatUtama || product.description}
                </p>
                <button className="mt-4 w-full border border-primary text-primary font-body text-[11px] tracking-[0.12em] uppercase py-3 hover:bg-primary hover:text-on-primary transition-colors duration-300 cursor-pointer">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

function FavoritesPage() {
  const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleRemove = async (id) => {
    setSavedProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await removeFavorite(id);
    } catch (err) {
      setError("Gagal menghapus favorite.");
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getFavorites();
        const list = Array.isArray(data) ? data : data?.data || [];
        const products = list.map((item) => item.product).filter(Boolean);
        setSavedProducts(products);
      } catch (err) {
        setError(err?.response?.data?.error || "Gagal memuat favorite.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const isEmpty = !isLoading && savedProducts.length === 0;

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col">
      <Navbar placeholder="Search collection..." active="favorites" />

      {/* CONTENT — switch between empty and filled */}
      {isLoading && (
        <main className="flex-grow flex items-center justify-center px-8 py-24">
          <p className="font-body text-[13px] text-on-surface-variant">
            Memuat favorite...
          </p>
        </main>
      )}

      {!isLoading && error && (
        <main className="flex-grow flex items-center justify-center px-8 py-24">
          <p className="font-body text-[13px] text-error">{error}</p>
        </main>
      )}

      {!isLoading &&
        !error &&
        (isEmpty ? (
          <EmptyState onExplore={() => navigate("/")} />
        ) : (
          <FilledState products={savedProducts} onRemove={handleRemove} />
        ))}

      <Footer />
    </div>
  );
}

export default FavoritesPage;
