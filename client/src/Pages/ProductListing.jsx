import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ArrowLeft,
  ShieldCheck,
  Tag,
  MapPin,
  Sparkles,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserCheck,
  Gift,
  Coins,
} from "lucide-react";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import ImageUploader from "../components/ImageUploader";
import ProductPreview from "../components/ProductPreview";
import { formatINR } from "../components/PriceRangeFilter";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";
import { categoryService, FALLBACK_CATEGORIES } from "../services/categoryService";

const CONDITIONS = [
  {
    id: "Like New",
    label: "Like New",
    desc: "Hardly used, in pristine condition with no defects or scratches.",
    badge: "Mint",
  },
  {
    id: "Good",
    label: "Good",
    desc: "Used but fully functional with slight normal campus wear.",
    badge: "Popular",
  },
  {
    id: "Fair",
    label: "Fair",
    desc: "Visible wear or cosmetic marks, but works completely fine.",
    badge: "Budget",
  },
];

const CAMPUS_LOCATIONS = [
  "Boys Hostel",
  "Girls Hostel",
  "Main Campus",
  "Library Area",
  "Academic Block",
  "Canteen",
  "Campus Gate",
  "Other",
];

export default function ProductListing() {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, loading: authLoading, updateProfile } = useAuth();

  // Dynamic categories from Supabase
  const [categoriesList, setCategoriesList] = useState(FALLBACK_CATEGORIES);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("Hostel Essentials");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [condition, setCondition] = useState("Good");
  const [campusLocation, setCampusLocation] = useState("Boys Hostel");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // Activation & Submission states
  const [activatingSeller, setActivatingSeller] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch active categories from Supabase
  useEffect(() => {
    categoryService
      .getActiveCategories()
      .then((cats) => {
        if (cats && cats.length > 0) {
          setCategoriesList(cats);
          setCategoryId(cats[0].id);
          setCategoryName(cats[0].name);
        }
      })
      .catch((err) => {
        console.warn("Failed to load active categories:", err);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  // Handle seller activation toggle if required
  const handleActivateSeller = async () => {
    setActivatingSeller(true);
    try {
      if (updateProfile) {
        await updateProfile({ seller_enabled: true, account_status: "active" });
      }
      toast.success("🎉 Seller account activated! You can now list items on CampusLoop.");
    } catch (err) {
      toast.error(err.message || "Failed to activate seller account.");
    } finally {
      setActivatingSeller(false);
    }
  };

  // Handle Free Toggle
  const handleFreeToggle = (e) => {
    const checked = e.target.checked;
    setIsFree(checked);
    if (checked) {
      setPrice("0");
      if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
    } else {
      setPrice("");
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!images || images.length === 0) {
      newErrors.images = "Please upload at least 1 product photo.";
    }

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "Product title must be at least 3 characters.";
    }

    if (!isFree) {
      const numPrice = Number(price);
      if (!price || isNaN(numPrice) || numPrice <= 0) {
        newErrors.price = "Selling price must be greater than ₹0 (or select 'List for FREE').";
      }
    }

    if (!condition) {
      newErrors.condition = "Please select the condition of your item.";
    }

    if (!campusLocation) {
      newErrors.campusLocation = "Please select a campus meetup location.";
    }

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Please provide a detailed description (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit and Publish Listing to Supabase
  const handlePublish = async () => {
    if (!validateForm()) {
      setShowPreviewModal(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please resolve the highlighted form errors before publishing.");
      return;
    }

    if (!isAuthenticated || !user?.id) {
      toast.info("Please login to list items.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageFiles = images.map((i) => i.file).filter(Boolean);

      const productPayload = {
        sellerId: user.id,
        categoryId: categoryId || null,
        title: title.trim(),
        description: description.trim(),
        price: isFree ? 0 : Number(price),
        isFree: !!isFree,
        condition,
        campusLocation,
      };

      const createdProduct = await productService.createProduct(productPayload, imageFiles);

      // Sync local storage cache for immediate marketplace synchronization
      const localListing = {
        _id: createdProduct?.id || `product-${Date.now()}`,
        id: createdProduct?.id,
        title: title.trim(),
        description: description.trim(),
        price: isFree ? "FREE" : Number(price),
        numericPrice: isFree ? 0 : Number(price),
        isFree: !!isFree,
        category: categoryName || "Hostel Essentials",
        condition,
        campusLocation,
        location: campusLocation,
        status: "Available",
        image: images[0]?.preview || "/images/products/desk-lamp.png",
        images: images.map((i) => i.preview),
        seller: {
          id: user.id,
          name: profile?.name || user?.user_metadata?.name || user.email?.split("@")[0] || "Student Seller",
          college: profile?.college || "Campus Community",
          verified: true,
        },
        createdAt: new Date().toISOString(),
      };

      const existingCustom = JSON.parse(
        localStorage.getItem("buykaro_user_listings") ||
        localStorage.getItem("studx_user_listings") ||
        "[]"
      );
      existingCustom.unshift(localListing);
      localStorage.setItem("buykaro_user_listings", JSON.stringify(existingCustom));

      toast.success("🎉 Your item has been listed successfully!");
      setShowPreviewModal(false);

      setTimeout(() => {
        if (createdProduct?.id) {
          navigate(`/product/${createdProduct.id}`);
        } else {
          navigate("/my-listings");
        }
      }, 1000);
    } catch (err) {
      console.error("Listing publish error:", err);
      toast.error(err.message || "Failed to publish listing. Please check connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seller details for display
  const sellerName =
    profile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Campus Student";
  const sellerCollege =
    profile?.college ||
    user?.user_metadata?.college ||
    "Campus Community";

  // Check if seller activation is needed
  const isSellerDisabled = profile?.seller_enabled === false;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Checking campus account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0F172A] flex flex-col justify-between font-sans">
      <Header showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/all-products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </Link>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-[#16A34A] flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck size={15} />
            Verified Campus Seller
          </span>
        </div>

        {/* Page Title Card */}
        <div className="mb-8 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
                Campus Marketplace Exchange
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Sell an Item on CampusLoop
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xl">
                Post textbooks, cycles, dorm essentials, lab equipment, or electronics for fellow students in your campus community.
              </p>
            </div>

            {/* Authenticated Seller Badge */}
            <div className="rounded-2xl bg-blue-50/70 p-4 border border-blue-100 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block mb-0.5">
                Posting As
              </span>
              <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <UserCheck size={16} className="text-[#2563EB]" />
                {sellerName}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{sellerCollege}</p>
            </div>
          </div>
        </div>

        {/* Seller Account Activation Warning Banner (if disabled) */}
        {isSellerDisabled && (
          <div className="mb-8 rounded-3xl bg-amber-50 border border-amber-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900">
                  Activate your seller account to start selling
                </h3>
                <p className="text-xs sm:text-sm text-amber-700 mt-1">
                  Activate seller privileges with one click to publish listings on the campus marketplace.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={activatingSeller}
              onClick={handleActivateSeller}
              className="shrink-0 w-full sm:w-auto rounded-full bg-amber-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-700 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {activatingSeller ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Activating...
                </>
              ) : (
                "Activate Seller Account Now"
              )}
            </button>
          </div>
        )}

        {/* Main Sell Item Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              setShowPreviewModal(true);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
              toast.error("Please fill in all required fields correctly.");
            }
          }}
          className="space-y-8"
        >
          {/* 1. PRODUCT IMAGES (1 to 5 Photos) */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
            <ImageUploader
              images={images}
              setImages={setImages}
              error={errors.images}
              setError={(err) => setErrors((prev) => ({ ...prev, images: err }))}
              maxImages={5}
            />
          </div>

          {/* 2. PRODUCT TITLE & CATEGORY */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                placeholder="e.g. Hero Sprint 21-Speed Bicycle, Calculus 8th Edition, Wooden Study Desk"
                maxLength={90}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                required
              />
              <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                <span>{errors.title && <span className="text-rose-600 font-semibold">{errors.title}</span>}</span>
                <span>{title.length} / 90</span>
              </div>
            </div>

            {/* Dynamic Category Dropdown */}
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  const selId = e.target.value;
                  setCategoryId(selId);
                  const found = categoriesList.find((c) => String(c.id) === String(selId));
                  if (found) setCategoryName(found.name);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.id || cat.name}>
                    {cat.emoji ? `${cat.emoji} ` : "📦 "}{cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. SELLING PRICE & FREE LISTING TOGGLE */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <Coins size={16} className="text-[#2563EB]" />
                Selling Price (INR) <span className="text-rose-500">*</span>
              </label>

              {/* Free item checkbox */}
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={handleFreeToggle}
                  className="h-4 w-4 rounded-md border-slate-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Gift size={13} />
                  List this item for FREE
                </span>
              </label>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                disabled={isFree}
                value={isFree ? "" : price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                }}
                placeholder={isFree ? "Listed as FREE for fellow campus students" : "e.g. 1500"}
                min="1"
                step="1"
                className={`w-full rounded-2xl border px-10 py-3.5 text-base font-bold outline-none transition ${
                  isFree
                    ? "border-emerald-300 bg-emerald-50/50 text-[#16A34A] placeholder:text-emerald-700 placeholder:font-bold cursor-not-allowed"
                    : "border-slate-200 bg-slate-50/50 text-[#0F172A] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                }`}
              />
              {isFree && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-[#16A34A] px-3.5 py-1 text-xs font-black text-white shadow-xs">
                  FREE
                </span>
              )}
            </div>

            {errors.price && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.price}
              </p>
            )}
          </div>

          {/* 4. PRODUCT CONDITION (Like New, Good, Fair) */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
              Condition <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-4">
              Select the option that best reflects the physical and functional state of your item.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {CONDITIONS.map((c) => {
                const isSelected = condition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id)}
                    className={`rounded-2xl p-4 text-left border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#2563EB] bg-blue-50/70 shadow-xs"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-[#0F172A]">{c.label}</span>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[#2563EB] bg-[#2563EB]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. CAMPUS LOCATION */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
              <MapPin size={16} className="text-[#2563EB]" />
              Campus / Hostel Location <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Preferred meetup point on campus for item inspection and handover.
            </p>
            <select
              value={campusLocation}
              onChange={(e) => setCampusLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 6. PRODUCT DESCRIPTION */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                Product Description <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Include age of item, working condition, accessories included, defects (if any), and reason for selling.
              </p>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
                }}
                rows={5}
                maxLength={1000}
                placeholder="e.g. Used for one year. Brakes and tyres are working properly. Minor scratches on the frame. Selling because I am graduating."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                required
              />
              <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                <span>
                  {errors.description && (
                    <span className="text-rose-600 font-semibold">{errors.description}</span>
                  )}
                </span>
                <span>{description.length} / 1000</span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3.5 pt-4">
            <button
              type="button"
              onClick={() => {
                if (validateForm()) {
                  setShowPreviewModal(true);
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  toast.error("Please fill in all required fields before previewing.");
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-[#0F172A] shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Eye size={16} />
              Preview Listing
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isSellerDisabled}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-9 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1D4ED8] transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Publish Listing
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Interactive Listing Preview Modal */}
      <ProductPreview
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onPublish={handlePublish}
        isPublishing={isSubmitting}
        productData={{
          title,
          categoryName,
          price: isFree ? 0 : price,
          isFree,
          condition,
          campusLocation,
          description,
        }}
        images={images}
        sellerName={sellerName}
        sellerCollege={sellerCollege}
      />

      <Footer />
    </div>
  );
}
