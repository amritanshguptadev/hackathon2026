import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Upload,
  X,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  ShieldCheck,
  Tag,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { formatINR } from "../components/PriceRangeFilter";
import { API_BASE_URL } from "../config/api";

const CATEGORIES = [
  "Hostel Essentials",
  "Electronics & Gadgets",
  "Textbooks & Notes",
  "Bicycles & Mobility",
  "Fashion & Accessories",
  "Sports & Fitness",
  "Free / Giveaway",
  "Others",
];

const CONDITIONS = [
  { id: "Like New", label: "Like New", desc: "Barely used, in pristine condition with no defects." },
  { id: "Good", label: "Good Condition", desc: "Fully functional with slight signs of regular campus use." },
  { id: "Fair", label: "Fair / Budget", desc: "Shows noticeable wear or marks, but works completely fine." },
];

const LOCATIONS = [
  "Boys Hostel",
  "Girls Hostel",
  "Central Library",
  "Campus Canteen / Food Court",
  "Main Academic Block",
  "Sports Complex",
  "College Main Gate",
  "Other / Negotiable",
];

export default function ProductListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Authenticated user state
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("loggedInUser") || "Campus Student";
  const userCollege = localStorage.getItem("college") || "University Campus";
  const userStudentId = localStorage.getItem("studentId") || "STU-1001";
  const isAuthenticated = !!token || !!localStorage.getItem("loggedInUser");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hostel Essentials");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [condition, setCondition] = useState("Good");
  const [campusLocation, setCampusLocation] = useState("Boys Hostel");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [dimensions, setDimensions] = useState("");

  // Images state (array of { file: File, preview: string })
  const [images, setImages] = useState([]);
  const [activePreviewImageIndex, setActivePreviewImageIndex] = useState(0);

  // Validation & UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handle Free Toggle
  const handleFreeToggle = (e) => {
    const checked = e.target.checked;
    setIsFree(checked);
    if (checked) {
      setPrice("0");
      if (category !== "Free / Giveaway") {
        setCategory("Free / Giveaway");
      }
    } else {
      setPrice("");
      if (category === "Free / Giveaway") {
        setCategory("Hostel Essentials");
      }
    }
  };

  // Image Upload Handling (1 to 5 images)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 product photos.");
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 5MB file limit.`);
        continue;
      }
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image format.`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview });
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      setErrors((prev) => ({ ...prev, images: null }));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => {
      const target = prev[indexToRemove];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
    if (activePreviewImageIndex >= indexToRemove && activePreviewImageIndex > 0) {
      setActivePreviewImageIndex((prev) => prev - 1);
    }
  };

  const setAsCoverImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return next;
    });
    setActivePreviewImageIndex(0);
    toast.info("Cover photo updated!");
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!images.length) {
      newErrors.images = "Please upload at least 1 product photo.";
    }

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "Product title must be at least 3 characters.";
    }

    if (!isFree) {
      const numPrice = Number(price);
      if (!price || isNaN(numPrice) || numPrice <= 0) {
        newErrors.price = "Please enter a valid price greater than ₹0 (or mark as Free).";
      }
    }

    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Please provide a description (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit and Publish Listing
  const handlePublish = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      setShowPreviewModal(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    let savedProduct = null;
    const sellerData = {
      name: userName,
      college: userCollege,
      studentId: userStudentId,
    };

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", isFree ? "0" : price);
      formData.append("details", features.trim());
      formData.append("dimensions", dimensions.trim());
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("location", campusLocation);
      formData.append("seller", JSON.stringify(sellerData));

      if (images.length > 0 && images[0].file) {
        formData.append("productImage", images[0].file);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (response.ok) {
          savedProduct = await response.json();
        }
      } catch (networkErr) {
        console.warn("Backend API not reachable, falling back to local storage sync:", networkErr);
      }

      // If backend was offline or saved locally, construct fallback item
      if (!savedProduct) {
        savedProduct = {
          _id: `custom-${Date.now()}`,
          title: title.trim(),
          description: description.trim(),
          price: isFree ? "FREE" : Number(price),
          numericPrice: isFree ? 0 : Number(price),
          isFree,
          category,
          condition,
          campusLocation,
          location: campusLocation,
          status: "Available",
          image: images[0]?.preview || "/images/products/desk-lamp.png",
          images: images.map((i) => i.preview),
          seller: sellerData,
          timeAgo: "Just now",
          createdAt: new Date().toISOString(),
        };
      }

      // Persist to local listings storage so it appears in My Listings & Marketplace
      const existingCustom = JSON.parse(localStorage.getItem("buykaro_user_listings") || localStorage.getItem("studx_user_listings") || "[]");
      existingCustom.unshift(savedProduct);
      localStorage.setItem("buykaro_user_listings", JSON.stringify(existingCustom));

      toast.success("🎉 Your item has been listed successfully!");
      setShowPreviewModal(false);

      setTimeout(() => {
        navigate("/profile");
      }, 900);
    } catch (err) {
      console.error("Publishing error:", err);
      toast.error("Failed to publish listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--cm-bg)] text-[var(--cm-ink)] flex flex-col justify-between">
      <Header showSearchBar={false} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/all-products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--cm-blue)] hover:text-[var(--cm-blue-dark)] transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </Link>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Verified Campus Seller
          </span>
        </div>

        {/* Page Title Card */}
        <div className="mb-8 rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-black text-[var(--cm-ink)] tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Sell on CampusLoop
              </h1>
              <p className="mt-1.5 text-sm text-[var(--cm-slate)]">
                List textbooks, tech gadgets, cycle, or dorm essentials for fellow students.
              </p>
            </div>

            {/* Authenticated Seller Badge */}
            <div className="rounded-2xl bg-[var(--cm-blue-soft)] p-3.5 border border-[var(--cm-blue)]/15 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cm-blue)] block">
                Seller Account
              </span>
              <p className="text-sm font-bold text-[var(--cm-ink)]">{userName}</p>
              <p className="text-xs text-[var(--cm-slate)]">{userCollege}</p>
            </div>
          </div>
        </div>

        {/* Main Listing Form */}
        <form onSubmit={(e) => { e.preventDefault(); setShowPreviewModal(true); }} className="space-y-8">
          {/* 1. PRODUCT IMAGES (1 to 5 Photos) */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-[var(--cm-ink)] flex items-center gap-2">
                <ImageIcon size={18} className="text-[var(--cm-blue)]" />
                Product Photos
                <span className="text-xs font-normal text-[var(--cm-slate)]">(1–5 Photos)</span>
              </label>
              <span className="text-xs font-semibold text-[var(--cm-slate)]">
                {images.length} / 5 photos
              </span>
            </div>
            <p className="text-xs text-[var(--cm-slate)] mb-4">
              Add clear photos of your item. The first photo will be used as the cover image.
            </p>

            {/* Dropzone & Upload Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {/* Existing Uploaded Images */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-2xs transition-all hover:border-[var(--cm-blue)]"
                >
                  <img
                    src={img.preview}
                    alt={`Upload ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* Cover Badge */}
                  {idx === 0 ? (
                    <span className="absolute top-2 left-2 rounded-full bg-[var(--cm-blue)] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Main Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAsCoverImage(idx)}
                      className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold text-white transition-opacity hover:bg-black"
                    >
                      Make Cover
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 active:scale-95"
                    aria-label="Remove image"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              {/* Add Image Button (if < 5) */}
              {images.length < 5 && (
                <label className="relative aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-3 text-center cursor-pointer hover:border-[var(--cm-blue)] hover:bg-[var(--cm-blue-soft)]/50 transition group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--cm-blue)] shadow-xs group-hover:scale-110 transition-transform">
                    <Upload size={18} />
                  </div>
                  <span className="mt-2 text-xs font-bold text-[var(--cm-ink)] group-hover:text-[var(--cm-blue)]">
                    + Add Photo
                  </span>
                  <span className="text-[10px] text-[var(--cm-slate)] mt-0.5">JPG, PNG, WEBP</span>
                </label>
              )}
            </div>

            {errors.images && (
              <p className="mt-2.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.images}
              </p>
            )}
          </div>

          {/* 2. TITLE & CATEGORY */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-[var(--cm-ink)] mb-1.5">
                Product Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                placeholder="e.g. Hero Sprint 21-Speed Bicycle, Calculus 8th Edition, Ergonomic Study Chair"
                maxLength={90}
                className="w-full rounded-2xl border border-[var(--cm-border)] bg-slate-50/50 px-4 py-3 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                required
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--cm-slate)]">
                <span>{errors.title && <span className="text-rose-600 font-semibold">{errors.title}</span>}</span>
                <span>{title.length} / 90</span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-bold text-[var(--cm-ink)] mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-[var(--cm-border)] bg-slate-50/50 px-4 py-3 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. PRICING & FREE GIVEAWAY TOGGLE */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-[var(--cm-ink)]">
                Selling Price (INR) <span className="text-rose-500">*</span>
              </label>

              {/* Free Toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={handleFreeToggle}
                  className="h-4 w-4 rounded-md border-slate-300 text-[var(--cm-blue)] focus:ring-[var(--cm-blue)]"
                />
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  🎁 This item is FREE / Giveaway
                </span>
              </label>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
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
                placeholder={isFree ? "FREE for campus peers" : "e.g. 1500"}
                min="1"
                step="1"
                className={`w-full rounded-2xl border px-9 py-3 text-base font-bold outline-none transition ${
                  isFree
                    ? "border-emerald-300 bg-emerald-50/50 text-emerald-800 placeholder:text-emerald-700 placeholder:font-bold cursor-not-allowed"
                    : "border-[var(--cm-border)] bg-slate-50/50 text-[var(--cm-ink)] focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                }`}
              />
              {isFree && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-extrabold text-white">
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

          {/* 4. CONDITION (Like New, Good, Fair) */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs">
            <label className="block text-sm font-bold text-[var(--cm-ink)] mb-3">
              Item Condition <span className="text-rose-500">*</span>
            </label>

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
                        ? "border-[var(--cm-blue)] bg-[var(--cm-blue-soft)] shadow-2xs"
                        : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[var(--cm-ink)]">{c.label}</span>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[var(--cm-blue)] bg-[var(--cm-blue)]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--cm-slate)] leading-relaxed">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. CAMPUS LOCATION */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs">
            <label className="block text-sm font-bold text-[var(--cm-ink)] mb-1.5">
              Campus Pickup Location <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-[var(--cm-slate)] mb-3">
              Where on campus would you prefer the buyer to meet you for handover?
            </p>
            <select
              value={campusLocation}
              onChange={(e) => setCampusLocation(e.target.value)}
              className="w-full rounded-2xl border border-[var(--cm-border)] bg-slate-50/50 px-4 py-3 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20 cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 6. DESCRIPTION & DETAILS */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[var(--cm-border)] shadow-xs space-y-6">
            <div>
              <label className="block text-sm font-bold text-[var(--cm-ink)] mb-1.5">
                Product Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
                }}
                rows={4}
                maxLength={1000}
                placeholder="Describe age of item, working condition, accessories included, reason for selling..."
                className="w-full rounded-2xl border border-[var(--cm-border)] bg-slate-50/50 p-4 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
                required
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--cm-slate)]">
                <span>{errors.description && <span className="text-rose-600 font-semibold">{errors.description}</span>}</span>
                <span>{description.length} / 1000</span>
              </div>
            </div>

            {/* Optional Key Features */}
            <div>
              <label className="block text-sm font-bold text-[var(--cm-ink)] mb-1.5">
                Key Features / Specifications <span className="text-xs font-normal text-[var(--cm-slate)]">(Optional, comma-separated)</span>
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. 21 Gears, Disk Brakes, Includes Lock and Helmet"
                className="w-full rounded-2xl border border-[var(--cm-border)] bg-slate-50/50 px-4 py-3 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
              />
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
                  toast.error("Please fill in required fields before previewing.");
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[var(--cm-border)] bg-white px-7 py-3.5 text-sm font-bold text-[var(--cm-ink)] shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Eye size={16} />
              Preview Listing
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePublish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--cm-blue)] px-9 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[var(--cm-blue-dark)] transition cursor-pointer disabled:opacity-50"
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
      </div>

      {/* ── INTERACTIVE PREVIEW MODAL ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-[var(--cm-border)]">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--cm-border)] bg-white/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cm-blue-soft)] text-[var(--cm-blue)]">
                  <Eye size={16} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--cm-ink)]">Listing Preview</h3>
                  <p className="text-xs text-[var(--cm-slate)]">This is how buyers will see your item</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content / Preview Mockup */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Product Cover & Gallery */}
              <div className="space-y-3">
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                  <img
                    src={images[activePreviewImageIndex]?.preview || images[0]?.preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    Available
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-[var(--cm-ink)] shadow-md">
                    {category}
                  </span>
                </div>

                {/* Thumbnails if > 1 */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePreviewImageIndex(i)}
                        className={`h-14 w-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activePreviewImageIndex === i
                            ? "border-[var(--cm-blue)] scale-105"
                            : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img.preview} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--cm-ink)]">{title || "Untitled Product"}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--cm-slate)]">
                    <span className="rounded-md bg-blue-50 text-[var(--cm-blue)] px-2 py-0.5">{condition}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={13} /> {campusLocation}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-2xl font-black text-[var(--cm-blue)]">
                    {isFree ? "FREE" : formatINR(Number(price) || 0)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {description || "No description provided."}
                </p>
              </div>

              {/* Seller Info Card */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[var(--cm-blue)] text-white flex items-center justify-center font-bold">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--cm-ink)]">{userName}</p>
                    <p className="text-[11px] text-[var(--cm-slate)]">{userCollege}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1">
                  Verified Student
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 border-t border-[var(--cm-border)] bg-slate-50 p-4 sm:p-5 flex items-center justify-end gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                ← Edit Form
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePublish}
                className="rounded-full bg-[var(--cm-blue)] px-7 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--cm-blue-dark)] transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Publish Listing Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
}
