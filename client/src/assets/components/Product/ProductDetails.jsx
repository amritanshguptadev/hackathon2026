import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { productService } from "../../../services/productService";
import { favoriteService } from "../../../services/favoriteService";
import { ToastContainer, toast } from "react-toastify";
import { resolveMediaUrl } from "../../../config/api";
import { DEMO_LISTINGS } from "../../../data/images";
import {
  Loader,
  ArrowLeft,
  MessageCircle,
  ShoppingCart,
  Zap,
  ShieldCheck,
  MapPin,
  School,
  Calendar,
  Sparkles,
  Tag,
  CheckCircle2,
  Heart
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [contacting, setContacting] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (productService?.getProductById) {
      productService
        .getProductById(id)
        .then((data) => {
          if (data) {
            setProduct(data);
          } else {
            const fallback = DEMO_LISTINGS.find(
              (p) => String(p._id) === String(id) || String(p.id) === String(id)
            );
            setProduct(fallback || null);
          }
        })
        .catch(() => {
          const fallback = DEMO_LISTINGS.find(
            (p) => String(p._id) === String(id) || String(p.id) === String(id)
          );
          setProduct(fallback || null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const fallback = DEMO_LISTINGS.find(
        (p) => String(p._id) === String(id) || String(p.id) === String(id)
      );
      setProduct(fallback || null);
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, 1);
    navigate("/cart");
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save items to your wishlist");
      navigate("/login");
      return;
    }
    try {
      if (isFav) {
        await favoriteService?.removeFavorite?.(user.id, id);
        setIsFav(false);
        toast.info("Removed from saved items");
      } else {
        await favoriteService?.addFavorite?.(user.id, id);
        setIsFav(true);
        toast.success("Saved to your campus wishlist!");
      }
    } catch {
      setIsFav(!isFav);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to chat with student sellers");
      navigate("/login");
      return;
    }
    navigate("/messages");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
        <Header showSearchBar={false} />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-600">Loading campus listing...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || !product.title) {
    return (
      <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
        <Header showSearchBar={false} />
        <div className="text-center p-12 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">This listing may have been removed or sold.</p>
          <Link
            to="/all-products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full cm-gradient-btn text-white font-bold text-sm shadow-md"
          >
            <ArrowLeft size={16} /> Return to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation & Favorite */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Marketplace
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition cursor-pointer ${
              isFav
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Heart size={15} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
            {isFav ? "Saved" : "Save Item"}
          </button>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-sm flex items-center justify-center sticky top-24">
              <img
                src={resolveMediaUrl(product.image)}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/products/1.jpg";
                }}
                className="max-h-96 w-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Price Card */}
            <div className="rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Sparkles size={12} />
                  {product.category || "Campus Listing"}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {product.condition || "Verified Quality"}
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.title}
              </h1>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>

              {/* Price Banner */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Student Price
                  </p>
                  <p className="text-3xl font-extrabold text-indigo-700">
                    {product.isFree || product.price === 0
                      ? "FREE"
                      : `₹${typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price}`}
                  </p>
                </div>
                <div className="text-right text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl">
                  ✓ Free Campus Hand-off
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 border-indigo-600 text-indigo-700 bg-indigo-50/40 hover:bg-indigo-50 font-bold text-sm transition active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl cm-gradient-btn font-extrabold text-sm shadow-md transition active:scale-[0.99] cursor-pointer"
                >
                  <Zap size={18} />
                  Buy Now
                </button>

                <button
                  onClick={handleContactSeller}
                  disabled={contacting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition active:scale-[0.99] cursor-pointer disabled:opacity-60"
                >
                  <MessageCircle size={18} />
                  {contacting ? "Opening..." : "Chat Seller"}
                </button>
              </div>
            </div>

            {/* Highlights / Details */}
            {product.details && product.details.length > 0 && (
              <div className="rounded-3xl bg-white border border-indigo-100 p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-indigo-600" />
                  Product Features &amp; Notes
                </h2>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Seller Profile Card */}
            {product.seller && (
              <div className="rounded-3xl bg-white border border-indigo-100 p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  Seller Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                      {product.seller.name ? product.seller.name.charAt(0) : "S"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{product.seller.name}</p>
                      <p className="text-slate-500 text-xs">Verified Student Seller</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <School size={20} className="text-indigo-500 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{product.seller.college || "Campus Community"}</p>
                      <p className="text-slate-500 text-xs">College / Department</p>
                    </div>
                  </div>

                  {product.seller.city && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <MapPin size={20} className="text-indigo-500 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{product.seller.city}</p>
                        <p className="text-slate-500 text-xs">City / Campus</p>
                      </div>
                    </div>
                  )}

                  {product.seller.joinedAt && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <Calendar size={20} className="text-indigo-500 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">
                          {new Date(product.seller.joinedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-slate-500 text-xs">Member Since</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
