import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetail } from "../api/productDetail";
import { addFavorite, removeFavorite } from "../api/favorites";

function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const images = product?.imageUrl ? [product.imageUrl] : [];
  const name = product?.namaProduk || product?.name || "";
  const brand = product?.brand || "";
  const category = product?.productType?.nama || product?.type || "";
  const country =
    product?.country?.namaNegara ||
    product?.country?.kodeNegara ||
    product?.country ||
    product?.negara ||
    "";
  const description = product?.manfaatUtama || product?.description || "";
  const skinTypes = (product?.skinTypes || [])
    .map((item) => item?.skinType?.nama)
    .filter(Boolean);
  const concerns = (product?.concerns || [])
    .map((item) => item?.concern?.nama)
    .filter(Boolean);
  const storeUrl = product?.tokoOnlineUrl || "";

  const handleBuyNow = () => {
    if (!storeUrl) return;
    window.open(storeUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProductDetail(id);
        const detail = data?.data || data;
        setProduct(detail);
      } catch (err) {
        const message = err?.response?.data?.error || "Produk tidak ditemukan.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center px-6">
        <p className="font-body text-[14px] text-on-surface-variant">
          Memuat produk...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-[28px] text-primary mb-3">
            Product not found
          </h1>
          <p className="font-body text-[14px] text-on-surface-variant mb-6">
            {error || "The product you selected is not available."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="border border-primary text-primary font-body text-[12px] tracking-[0.12em] uppercase py-3 px-6 hover:bg-primary hover:text-on-primary transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-4">
      {/* Modal */}
      <div className="relative w-full max-w-[1100px] h-[700px] bg-surface-bright border border-soft-beige flex flex-col md:flex-row overflow-hidden z-10">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-20 text-outline hover:text-primary transition-colors p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* LEFT — Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#FAF8F5] flex flex-col items-center justify-center p-10 border-b md:border-b-0 md:border-r border-soft-beige relative">
          {/* Main Image */}
          <div className="flex-1 w-full flex items-center justify-center">
            <img
              src={images[activeImage]}
              alt="Product"
              className="w-[65%] h-auto object-contain max-h-[420px] transition-opacity duration-300"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-[58px] h-[58px] overflow-hidden border transition-colors duration-200 cursor-pointer ${
                  activeImage === i
                    ? "border-gold"
                    : "border-soft-beige hover:border-outline"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-200 ${
                    activeImage === i
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-90"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Product Details */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
          <div className="flex-1 p-[52px] pb-0">
            {/* Eyebrow */}
            <div className="font-body text-[11px] tracking-[0.2em] uppercase text-gold mb-1">
              {country} · {category}
            </div>

            {/* Brand */}
            <div className="font-body text-[12px] tracking-[0.15em] uppercase text-on-surface-variant mb-3">
              {brand}
            </div>

            {/* Title */}
            <h1 className="font-display text-[28px] font-light leading-[1.25] text-primary mb-2">
              {name}
            </h1>

            {/* Tagline */}
            <p className="font-display italic text-[15px] text-on-surface-variant mb-6">
              {product.tagline || ""}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-soft-beige mb-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary mb-2">
                Description
              </h3>
              <p className="font-body text-[13px] text-on-surface-variant leading-[1.75]">
                {description}
              </p>
            </div>

            {/* Key Ingredients */}
            {skinTypes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary mb-2">
                  Skin Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skinTypes.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 border border-soft-beige font-body text-[11px] tracking-[0.08em] uppercase text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Best For */}
            {concerns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary mb-2">
                  Skin Concerns
                </h3>
                <div className="flex flex-wrap gap-2">
                  {concerns.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 border border-soft-beige font-body text-[11px] tracking-[0.08em] uppercase text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How To Use */}
            {storeUrl && (
              <div className="mb-8">
                <h3 className="font-body text-[11px] tracking-[0.15em] uppercase text-primary mb-2">
                  Store Link
                </h3>
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-[13px] text-secondary hover:underline break-all"
                >
                  {storeUrl}
                </a>
              </div>
            )}
          </div>

          {/* Bottom Action Row */}
          <div className="flex gap-3 px-[52px] py-5 border-t border-soft-beige bg-surface-bright sticky bottom-0">
            <button
              onClick={handleBuyNow}
              disabled={!storeUrl}
              className="flex-1 bg-gold text-on-primary font-body text-[12px] tracking-[0.12em] uppercase py-4 px-8 hover:opacity-90 transition-opacity cursor-pointer"
            >
              BUY NOW
            </button>
            <button
              onClick={async () => {
                const nextLiked = !liked;
                setLiked(nextLiked);
                try {
                  if (nextLiked) {
                    await addFavorite(product.id);
                  } else {
                    await removeFavorite(product.id);
                  }
                } catch {
                  setLiked(!nextLiked);
                }
              }}
              aria-label="Add to wishlist"
              className="w-[52px] h-[52px] border border-primary flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-colors ${liked ? "text-secondary" : "text-primary"}`}
                style={{
                  fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
