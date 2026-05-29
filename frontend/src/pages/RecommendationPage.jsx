import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getConcerns,
  getCountries,
  getProductTypes,
  getSkinTypes,
} from "../api/masterData";
import { getRecommendations } from "../api/recommendations";
import { resolveAssetUrl } from "../lib/asset";

function ChipGroup({ title, items, selectedIds, onToggle, emptyLabel }) {
  return (
    <div className="rounded-[28px] border border-outline-variant bg-surface-bright/90 p-5 md:p-6">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <p className="font-body text-[10px] tracking-[0.22em] uppercase text-secondary mb-1">
            {title}
          </p>
          <p className="font-body text-[13px] text-on-surface-variant">
            Pilih satu atau lebih atribut yang paling cocok.
          </p>
        </div>
        <span className="font-body text-[11px] tracking-[0.15em] uppercase text-on-surface-variant">
          {selectedIds.length} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {items.length > 0 ? (
          items.map((item) => {
            const isActive = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className={`rounded-full border px-4 py-2 font-body text-[11px] tracking-[0.12em] uppercase transition-all cursor-pointer ${
                  isActive
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            );
          })
        ) : (
          <span className="font-body text-label-caps text-on-surface-variant">
            {emptyLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultCard({ item }) {
  const image = resolveAssetUrl(item.imageUrl);
  const skinTypes = item.matchedAttributes?.skinTypes || [];
  const concerns = item.matchedAttributes?.concerns || [];
  const countries = item.matchedAttributes?.countries || [];
  const productTypes = item.matchedAttributes?.productTypes || [];

  return (
    <article className="group overflow-hidden rounded-[28px] border border-outline-variant bg-surface-bright shadow-[0_18px_60px_rgba(24,20,14,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-4/3 overflow-hidden bg-[#F8F2EA]">
        {image ? (
          <img
            src={image}
            alt={item.namaProduk}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <span className="font-body text-label-caps tracking-[0.16em] uppercase text-on-surface-variant">
              No image available
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-body text-[10px] tracking-[0.18em] uppercase text-on-primary shadow-lg">
          Score {item.score}
        </div>
      </div>

      <div className="space-y-4 p-5 md:p-6">
        <div>
          <p className="font-body text-[10px] tracking-[0.18em] uppercase text-secondary mb-1">
            {item.country?.namaNegara || item.country?.kodeNegara || "Country"}
            {item.productType?.nama ? ` · ${item.productType.nama}` : ""}
          </p>
          <h3 className="font-display text-h3 leading-[1.2] text-primary">
            {item.namaProduk}
          </h3>
          <p className="mt-1 font-body text-[13px] text-on-surface-variant">
            {item.brand}
          </p>
        </div>

        <p className="line-clamp-3 font-body text-[13px] leading-[1.8] text-on-surface-variant">
          {item.manfaatUtama}
        </p>

        <div className="flex flex-wrap gap-2">
          {skinTypes.map((tag) => (
            <span
              key={`skin-${tag}`}
              className="rounded-full border border-outline-variant px-3 py-1 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
          {concerns.map((tag) => (
            <span
              key={`concern-${tag}`}
              className="rounded-full border border-outline-variant px-3 py-1 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
          {countries.map((tag) => (
            <span
              key={`country-${tag}`}
              className="rounded-full border border-outline-variant px-3 py-1 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
          {productTypes.map((tag) => (
            <span
              key={`type-${tag}`}
              className="rounded-full border border-outline-variant px-3 py-1 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface-variant"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/product/${item.id}`}
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-secondary hover:text-primary transition-colors"
        >
          View detail
          <span className="material-symbols-outlined text-body-md">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  );
}

function RecommendationPage() {
  const [options, setOptions] = useState({
    skinTypes: [],
    concerns: [],
    countries: [],
    productTypes: [],
  });
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState("");

  const countryOptions = useMemo(
    () =>
      options.countries.map((item) => ({
        id: item.id,
        label: item.namaNegara,
      })),
    [options.countries],
  );

  const productTypeOptions = useMemo(
    () =>
      options.productTypes.map((item) => ({ id: item.id, label: item.nama })),
    [options.productTypes],
  );

  const skinTypeOptions = useMemo(
    () => options.skinTypes.map((item) => ({ id: item.id, label: item.nama })),
    [options.skinTypes],
  );

  const concernOptions = useMemo(
    () => options.concerns.map((item) => ({ id: item.id, label: item.nama })),
    [options.concerns],
  );

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [countries, productTypes, skinTypes, concerns] =
          await Promise.all([
            getCountries(),
            getProductTypes(),
            getSkinTypes(),
            getConcerns(),
          ]);

        setOptions({
          countries: Array.isArray(countries) ? countries : [],
          productTypes: Array.isArray(productTypes) ? productTypes : [],
          skinTypes: Array.isArray(skinTypes) ? skinTypes : [],
          concerns: Array.isArray(concerns) ? concerns : [],
        });
      } catch {
        setOptions({
          countries: [],
          productTypes: [],
          skinTypes: [],
          concerns: [],
        });
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const toggleSelection = (current, setCurrent, id) => {
    setCurrent(
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingResults(true);
    setError("");

    try {
      const data = await getRecommendations({
        skinTypes: selectedSkinTypes,
        concerns: selectedConcerns,
        countries: selectedCountry ? [selectedCountry] : [],
        productTypes: selectedProductType ? [selectedProductType] : [],
      });

      setResults(Array.isArray(data) ? data : []);
      setHasSearched(true);
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal memuat rekomendasi.");
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="mx-auto flex w-full max-w-360 flex-col px-4 py-6 md:px-8 md:py-8">
        <section className="overflow-hidden rounded-[36px] border border-outline-variant bg-surface-bright shadow-[0_25px_80px_rgba(20,16,10,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative p-8 md:p-10 lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,166,116,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(112,87,58,0.08),transparent_30%)]" />
              <div className="relative z-10">
                <h1 className="font-display text-[30px] leading-[1.08] text-primary md:text-[40px]">
                  Find the skincare that fits your skin.
                </h1>
                <p className="mt-5 font-body text-[15px] leading-[1.9] text-on-surface-variant">
                  Pilih kondisi kulit dan preferensi produk, lalu sistem akan
                  menghitung kecocokan setiap produk berdasarkan weighted
                  scoring.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-outline-variant bg-white/70 p-4">
                    <p className="font-body text-[10px] tracking-[0.18em] uppercase text-secondary mb-2">
                      Weight
                    </p>
                    <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                      Skin Type +5, Concern +10, Country +2, Product Type +3.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-outline-variant bg-white/70 p-4">
                    <p className="font-body text-[10px] tracking-[0.18em] uppercase text-secondary mb-2">
                      Output
                    </p>
                    <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">
                      Hasil diurutkan dari score tertinggi ke terendah.
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#recommendation-form"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 font-body text-[11px] tracking-[0.18em] uppercase text-on-primary transition-opacity hover:opacity-90"
                  >
                    Start Recommendation
                  </a>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-full border border-outline-variant px-5 py-3 font-body text-[11px] tracking-[0.18em] uppercase text-primary transition-colors hover:border-primary hover:text-secondary"
                  >
                    Back Home
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-outline-variant p-5 md:p-6 lg:border-l lg:border-t-0">
              <form
                id="recommendation-form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="rounded-[28px] border border-outline-variant bg-[#FBF7F1] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-body text-[10px] tracking-[0.22em] uppercase text-secondary mb-1">
                        Filters
                      </p>
                      <h2 className="font-display text-h3 text-primary">
                        Tell us what your skin needs
                      </h2>
                    </div>
                    <span className="hidden rounded-full border border-outline-variant px-3 py-1 font-body text-[10px] tracking-[0.18em] uppercase text-on-surface-variant md:inline-flex">
                      Multi-select ready
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block font-body text-[10px] tracking-[0.18em] uppercase text-on-surface-variant">
                        Country
                      </label>
                      <select
                        value={selectedCountry}
                        onChange={(event) =>
                          setSelectedCountry(event.target.value)
                        }
                        className="w-full rounded-[18px] border border-outline-variant bg-white px-4 py-3 font-body text-button text-on-surface outline-none transition-colors focus:border-primary"
                      >
                        <option value="">Optional: all countries</option>
                        {countryOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block font-body text-[10px] tracking-[0.18em] uppercase text-on-surface-variant">
                        Product Type
                      </label>
                      <select
                        value={selectedProductType}
                        onChange={(event) =>
                          setSelectedProductType(event.target.value)
                        }
                        className="w-full rounded-[18px] border border-outline-variant bg-white px-4 py-3 font-body text-button text-on-surface outline-none transition-colors focus:border-primary"
                      >
                        <option value="">Optional: all product types</option>
                        {productTypeOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <ChipGroup
                  title="Skin Types"
                  items={skinTypeOptions}
                  selectedIds={selectedSkinTypes}
                  onToggle={(id) =>
                    toggleSelection(selectedSkinTypes, setSelectedSkinTypes, id)
                  }
                  emptyLabel={
                    loadingOptions
                      ? "Loading skin types..."
                      : "No skin types available."
                  }
                />

                <ChipGroup
                  title="Skin Concerns"
                  items={concernOptions}
                  selectedIds={selectedConcerns}
                  onToggle={(id) =>
                    toggleSelection(selectedConcerns, setSelectedConcerns, id)
                  }
                  emptyLabel={
                    loadingOptions
                      ? "Loading concerns..."
                      : "No concerns available."
                  }
                />

                {error && (
                  <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 font-body text-[13px] text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingResults}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-body text-label-caps tracking-[0.2em] uppercase text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingResults ? "SCORING..." : "GET RECOMMENDATION"}
                  <span className="material-symbols-outlined text-body-lg">
                    auto_awesome
                  </span>
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mt-8 pb-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-body text-[10px] tracking-[0.22em] uppercase text-secondary mb-1">
                Recommendation Result
              </p>
              <h2 className="font-display text-[28px] text-primary md:text-[34px]">
                Ranked by relevance score
              </h2>
            </div>
            {hasSearched && (
              <p className="font-body text-label-caps text-on-surface-variant">
                {results.length} product{results.length === 1 ? "" : "s"} found
              </p>
            )}
          </div>

          {!hasSearched ? (
            <div className="rounded-[28px] border border-dashed border-outline-variant bg-surface-bright p-8 text-center">
              <p className="font-body text-button text-on-surface-variant">
                Pilih filter lalu jalankan recommendation untuk melihat hasil.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-outline-variant bg-surface-bright p-10 text-center">
              <p className="font-display text-[28px] text-primary">
                Tidak ditemukan produk yang sesuai
              </p>
              <p className="mx-auto mt-3  font-body text-button leading-relaxed text-on-surface-variant">
                Coba pilih skin type, concern, country, atau product type yang
                berbeda untuk mendapatkan hasil yang lebih relevan.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default RecommendationPage;
