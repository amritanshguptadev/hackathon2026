import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../Home/Header";
import { Loader, ArrowLeft, MessageCircle, Heart, ShieldCheck, MapPin } from "lucide-react";
import Footer from "../Home/Footer";
import { ToastContainer, toast } from "react-toastify";
import { handleError, handleSuccess } from "../../../utils";
import { productService } from "../../../services/productService";
import { favoriteService } from "../../../services/favoriteService";
import { useAuth } from "../../../context/AuthContext";
import { formatINR } from "../../../components/PriceRangeFilter";
import { DEMO_LISTINGS } from "../../../data/images";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [contacting, setContacting] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    productService.getProductById(id)
      .then((data) => {
        if (data) {
          setProduct(data);
        } else {
          const fallback = DEMO_LISTINGS.find((p) => p._id === id || p.id === id);
          setProduct(fallback || null);
        }
      })
      .catch(() => {
        const fallback = DEMO_LISTINGS.find((p) => p._id === id || p.id === id);
        setProduct(fallback || null);
      })
      .finally(() => setLoading(false));

    if (user?.id) {
      favoriteService.isFavorite(user.id, id).then(setIsFav).catch(() => {});
    }
  }, [id, user?.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to save favorite items.");
      navigate("/login");
      return;
    }
    try {
      const favorited = await favoriteService.toggleFavorite(user.id, id);
      setIsFav(favorited);
      if (favorited) {
        toast.success("Added to your saved items!");
      } else {
        toast.info("Removed from saved items.");
      }
    } catch {
      toast.error("Failed to update favorites.");
    }
  };

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/messages`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--cm-bg)]">
        <Loader size={40} className="animate-spin text-[var(--cm-blue)]" />
      </div>
    );
  }

  if (!product || !product.title) {
    return (
      <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
        <Header showSearchBar={false} />
        <div className="text-center p-12 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-[var(--cm-ink)] mb-2">Product Not Found</h2>
          <p className="text-sm text-[var(--cm-slate)] mb-6">This listing may have been removed or sold.</p>
          <Link to="/all-products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--cm-blue)] text-white font-bold text-sm">
            <ArrowLeft size={16} /> Return to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imagesList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || "/images/products/desk-lamp.png"];

  return (
    <>
      <Header showSearchBar={false} />
      <ToastContainer />
      <div className="min-h-screen bg-[var(--cm-bg)] py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--cm-blue)] hover:underline cursor-pointer"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                isFav
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart size={15} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
              {isFav ? "Saved" : "Save Item"}
            </button>
          </div>

          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs flex flex-col md:flex-row gap-8">
            {/* Gallery Column */}
            <div className="w-full md:w-1/2 space-y-3">
              <div className="aspect-[4/3] w-full rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                <img
                  src={imagesList[activeImageIndex] || imagesList[0]}
                  alt={product.title}
                  className="h-full w-full object-contain p-4"
                />
                <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                  {product.status || "Available"}
                </span>
                {product.condition && (
                  <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-xs">
                    {product.condition}
                  </span>
                )}
              </div>

              {imagesList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-16 w-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx ? "border-[var(--cm-blue)] scale-105" : "border-slate-200 opacity-70"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--cm-blue)] block mb-1">
                  {product.category || "Campus Listing"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--cm-ink)]">{product.title}</h1>
                <p className="mt-2 text-2xl sm:text-3xl font-black text-[var(--cm-blue)]">
                  {product.isFree ? "FREE" : (typeof product.price === "number" ? formatINR(product.price) : product.price)}
                </p>

                <p className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Location & Condition Badges */}
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    <MapPin size={13} /> {product.campusLocation || "Campus"}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-[var(--cm-blue)]">
                    <ShieldCheck size={13} /> Verified Student Listing
                  </span>
                </div>

                {/* Seller Card */}
                {product.seller && (
                  <div className="rounded-2xl bg-[var(--cm-blue-soft)]/60 p-4 border border-[var(--cm-blue)]/15 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--cm-slate)] font-semibold">Listed by</p>
                      <p className="text-sm font-bold text-[var(--cm-ink)]">{product.seller.name || "Student Seller"}</p>
                      <p className="text-xs text-[var(--cm-slate)]">{product.seller.college || "Campus Community"}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1">
                      Campus Peer
                    </span>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleContactSeller}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cm-blue)] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[var(--cm-blue-dark)] transition cursor-pointer"
                  >
                    <MessageCircle size={18} /> Message Seller
                  </button>
                  <Link
                    to="/all-products"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Browse More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
