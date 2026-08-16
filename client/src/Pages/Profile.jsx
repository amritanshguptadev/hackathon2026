import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import HeaderMain from "../assets/components/Home/HeaderMain";
import Footer from "../assets/components/Home/Footer";
import {
  UserRound,
  AlertCircle,
  GraduationCap,
  BadgeCheck,
  Mail,
  Calendar,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Tag,
  MapPin,
  X,
  Loader2,
  Heart,
  Save,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatINR } from "../components/PriceRangeFilter";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";
import { favoriteService } from "../services/favoriteService";
import { categoryService, FALLBACK_CATEGORIES } from "../services/categoryService";

const STATUS_BADGES = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reserved: "bg-orange-50 text-orange-700 border-orange-200",
  Sold: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function Profile() {
  const { user, profile, logout, updateProfile, refreshProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categoriesList, setCategoriesList] = useState(FALLBACK_CATEGORIES);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings"); // "listings" | "saved" | "details"

  // Modal states for Edit Product & Edit Profile
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    college: "",
    campusLocation: "",
    studentId: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const navigate = useNavigate();

  // Load Categories & Listings
  useEffect(() => {
    categoryService.getActiveCategories?.().then((cats) => {
      if (cats && cats.length > 0) setCategoriesList(cats);
    }).catch(() => {});
  }, []);

  // Initialize Profile Edit Form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        college: profile.college || profile.university || "",
        campusLocation: profile.campus_location || "Campus Main",
        studentId: profile.student_id || profile.studentId || "",
      });
    }
  }, [profile]);

  // Load User Listings and Favorites from Supabase
  useEffect(() => {
    if (!user?.id) return;

    setListingsLoading(true);
    productService.getUserProducts(user.id)
      .then((data) => {
        setMyListings(data || []);
      })
      .catch((err) => {
        console.error("Error loading user listings from Supabase:", err);
      })
      .finally(() => setListingsLoading(false));

    favoriteService.getUserFavorites(user.id)
      .then((favs) => {
        setFavorites(favs || []);
      })
      .catch(() => {});
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await logout();
      handleSuccess("Logged out successfully");
      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch {
      navigate("/");
    }
  };

  // Status Change (Available <-> Reserved <-> Sold)
  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productService.updateProductStatus(productId, newStatus);
      setMyListings((prev) =>
        prev.map((item) =>
          item.id === productId || item._id === productId ? { ...item, status: newStatus } : item
        )
      );
      // Update local storage as well
      const localListings = JSON.parse(
        localStorage.getItem("buykaro_user_listings") ||
        localStorage.getItem("studx_user_listings") ||
        "[]"
      );
      const updated = localListings.map((item) =>
        item._id === productId || item.id === productId ? { ...item, status: newStatus } : item
      );
      localStorage.setItem("buykaro_user_listings", JSON.stringify(updated));

      toast.success(`Listing status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  // Delete Listing
  const confirmDelete = async () => {
    if (!deletingProductId) return;

    try {
      await productService.deleteProduct(deletingProductId);
      setMyListings((prev) =>
        prev.filter((item) => item.id !== deletingProductId && item._id !== deletingProductId)
      );

      // Remove from local storage
      const localListings = JSON.parse(
        localStorage.getItem("buykaro_user_listings") ||
        localStorage.getItem("studx_user_listings") ||
        "[]"
      );
      const filtered = localListings.filter(
        (item) => item._id !== deletingProductId && item.id !== deletingProductId
      );
      localStorage.setItem("buykaro_user_listings", JSON.stringify(filtered));

      toast.success("Listing deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete listing.");
    } finally {
      setDeletingProductId(null);
    }
  };

  // Save Edited Listing to Supabase & LocalStorage
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsUpdating(true);
    try {
      const prodId = editingProduct.id || editingProduct._id;
      const updated = await productService.updateProduct(prodId, {
        title: editingProduct.title,
        categoryId: editingProduct.categoryId || editingProduct.category_id,
        price: editingProduct.isFree ? 0 : Number(editingProduct.price),
        isFree: editingProduct.isFree,
        description: editingProduct.description,
        condition: editingProduct.condition,
        campusLocation: editingProduct.campusLocation,
      });

      // Update in state
      setMyListings((prev) =>
        prev.map((item) => ((item.id === prodId || item._id === prodId) ? (updated || editingProduct) : item))
      );

      // Update in local storage
      const localListings = JSON.parse(
        localStorage.getItem("buykaro_user_listings") ||
        localStorage.getItem("studx_user_listings") ||
        "[]"
      );
      const updatedList = localListings.map((item) =>
        item._id === prodId || item.id === prodId ? editingProduct : item
      );
      localStorage.setItem("buykaro_user_listings", JSON.stringify(updatedList));

      toast.success("Listing updated successfully!");
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.message || "Failed to save changes.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Save Profile Edit Form to Supabase
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        college: profileForm.college.trim(),
        campus_location: profileForm.campusLocation.trim(),
        student_id: profileForm.studentId.trim(),
      });
      await refreshProfile();
      toast.success("Profile updated successfully!");
      setShowEditProfileModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-[var(--cm-bg)] text-[var(--cm-ink)] flex flex-col justify-between">
        <HeaderMain />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[var(--cm-border)]">
            <div className="mb-6 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-blue-50 text-[var(--cm-blue)]">
              <AlertCircle className="h-10 w-10 text-[var(--cm-blue)]" />
            </div>
            <h1
              className="text-2xl font-black text-slate-900 mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sign In to View Profile
            </h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Log in or create a student account to view your campus profile, manage listings, and chat with peers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-[var(--cm-blue)] hover:bg-[var(--cm-blue-dark)] text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-all text-sm"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-all text-sm"
              >
                Log In
              </Link>
            </div>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] text-[var(--cm-ink)] flex flex-col justify-between">
      <HeaderMain />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-[var(--cm-border)] overflow-hidden">
          {/* Cover / Header Banner */}
          <div className="h-36 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                <ShieldCheck size={14} />
                Verified Student
              </span>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 text-white border border-white/20 text-xs font-semibold transition cursor-pointer"
              >
                <Settings size={13} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar & Main User Info */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4 border-b border-slate-100 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-blue-600 shadow-md flex items-center justify-center text-white text-3xl font-extrabold overflow-hidden">
                  {profile?.name ? (
                    profile.name.charAt(0).toUpperCase()
                  ) : (
                    <UserRound size={40} />
                  )}
                </div>

                <div className="mb-1">
                  <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                    {profile?.name || user?.user_metadata?.name || "Student User"}
                    <BadgeCheck className="h-5 w-5 text-[var(--cm-blue)]" />
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                    <GraduationCap size={15} className="text-slate-400" />
                    {profile?.college || profile?.university || user?.user_metadata?.college || "University Campus"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cm-blue)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--cm-blue-dark)] transition"
                >
                  <PlusCircle size={14} /> Sell an Item
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>

            {/* Profile Quick Links / Navigation Hub */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <Link
                to="/orders"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
              >
                <Package size={14} />
                Your Orders
              </Link>

              <Link
                to="/my-listings"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
              >
                <ShoppingBag size={14} />
                My Listings ({myListings.length})
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-2xs"
              >
                <Heart size={14} />
                Liked Items ({favorites.length})
              </Link>

              <Link
                to="/profile/edit"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <Edit size={14} />
                Edit Profile
              </Link>

              <Link
                to="/notifications"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <Bell size={14} />
                Notifications
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                <Settings size={14} />
                Settings
              </Link>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("listings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeTab === "listings"
                    ? "bg-[var(--cm-blue)] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ShoppingBag size={14} />
                My Listings ({myListings.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-[var(--cm-blue)] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Heart size={14} />
                Saved Items ({favorites.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeTab === "details"
                    ? "bg-[var(--cm-blue)] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <UserRound size={14} />
                Account Info
              </button>
            </div>

            {/* ── TAB 1: MY LISTINGS ── */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {listingsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 size={32} className="animate-spin text-[var(--cm-blue)] mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-semibold">Loading your campus listings from Supabase...</p>
                  </div>
                ) : myListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myListings.map((item) => {
                      const status = item.status || "Available";
                      const badgeClass = STATUS_BADGES[status] || STATUS_BADGES.Available;

                      return (
                        <div
                          key={item.id || item._id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                        >
                          <div className="flex gap-3.5">
                            {/* Thumbnail */}
                            <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              <img
                                src={item.image || (item.images && item.images[0]) || "/images/products/desk-lamp.png"}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            {/* Title & Metadata */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-[var(--cm-ink)] truncate">
                                  {item.title}
                                </h3>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${badgeClass}`}
                                >
                                  {status}
                                </span>
                              </div>

                              <p className="text-xs font-extrabold text-[var(--cm-blue)] mt-0.5">
                                {item.isFree || item.price === "FREE" || item.price === 0
                                  ? "FREE"
                                  : typeof item.price === "number"
                                  ? formatINR(item.price)
                                  : `₹${item.price}`}
                              </p>

                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500 font-medium">
                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px]">
                                  {item.category || "General"}
                                </span>
                                <span>•</span>
                                <span>{item.condition || "Good"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1">
                              {status !== "Available" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id || item._id, "Available")}
                                  className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                                >
                                  Make Available
                                </button>
                              )}
                              {status !== "Reserved" && status !== "Sold" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id || item._id, "Reserved")}
                                  className="rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                                >
                                  Reserve
                                </button>
                              )}
                              {status !== "Sold" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(item.id || item._id, "Sold")}
                                  className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                                >
                                  Mark Sold
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...item })}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[var(--cm-blue)] transition cursor-pointer"
                                title="Edit Listing"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingProductId(item.id || item._id)}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                                title="Delete Listing"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No Listings Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                      Have items you no longer need? List textbooks, electronics, cycle, or furniture for fellow campus students.
                    </p>
                    <Link
                      to="/sell"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--cm-blue)] hover:bg-[var(--cm-blue-dark)] text-white px-6 py-2.5 text-xs font-bold shadow-xs transition"
                    >
                      <PlusCircle size={14} /> List Your First Item
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: SAVED ITEMS (FAVORITES) ── */}
            {activeTab === "saved" && (
              <div className="space-y-4">
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <Link
                        key={fav.id || fav._id}
                        to={`/product/${fav.id || fav._id}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition flex gap-3.5 group"
                      >
                        <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={fav.image || "/images/products/desk-lamp.png"}
                            alt={fav.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[var(--cm-ink)] group-hover:text-[var(--cm-blue)] transition truncate">
                            {fav.title}
                          </h3>
                          <p className="text-xs font-extrabold text-[var(--cm-blue)] mt-0.5">
                            {fav.isFree ? "FREE" : typeof fav.price === "number" ? formatINR(fav.price) : fav.price}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {fav.campusLocation || "Campus"} • {fav.condition || "Good"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
                    <Heart className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No Saved Items</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                      Save items you want to keep an eye on by clicking the heart button on product listings.
                    </p>
                    <Link
                      to="/all-products"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--cm-blue)] hover:bg-[var(--cm-blue-dark)] text-white px-6 py-2.5 text-xs font-bold shadow-xs transition"
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: ACCOUNT INFO ── */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</p>
                    <p className="text-base font-semibold text-slate-900">{profile?.name || user?.user_metadata?.name || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Mail size={13} className="text-slate-400" /> Email Address
                    </p>
                    <p className="text-base font-semibold text-slate-900 break-all">{user?.email || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <GraduationCap size={13} className="text-[var(--cm-blue)]" /> College / University
                    </p>
                    <p className="text-base font-semibold text-slate-900">{profile?.college || profile?.university || user?.user_metadata?.college || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <BadgeCheck size={13} className="text-emerald-600" /> Student ID / Roll No
                    </p>
                    <p className="text-base font-semibold text-slate-900">{profile?.student_id || profile?.studentId || user?.user_metadata?.student_id || "N/A"}</p>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cm-blue)] px-5 py-2.5 text-xs font-bold text-white hover:bg-[var(--cm-blue-dark)] transition cursor-pointer"
                  >
                    <Edit size={13} /> Edit Account Details
                  </button>
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/all-products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[var(--cm-blue)] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Campus Marketplace
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── EDIT LISTING MODAL ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-[var(--cm-border)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
              <h3 className="text-base font-bold text-[var(--cm-ink)]">Edit Listing</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editingProduct.categoryId || editingProduct.category_id || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-[var(--cm-blue)] cursor-pointer"
                >
                  {categoriesList.map((c) => (
                    <option key={c.id || c.name} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Price (INR)</label>
                  <label className="text-xs font-bold text-emerald-700 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFree || false}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isFree: e.target.checked,
                          price: e.target.checked ? 0 : editingProduct.price,
                        })
                      }
                      className="rounded text-[var(--cm-blue)]"
                    />
                    Free Item
                  </label>
                </div>
                <input
                  type="number"
                  disabled={editingProduct.isFree}
                  value={editingProduct.isFree ? "0" : editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)] disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={editingProduct.condition || "Good"}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, condition: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-[var(--cm-blue)] cursor-pointer"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={editingProduct.campusLocation || editingProduct.location || "Boys Hostel"}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        campusLocation: e.target.value,
                        location: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:border-[var(--cm-blue)]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-full border border-slate-300 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-full bg-[var(--cm-blue)] px-6 py-2 text-xs font-bold text-white hover:bg-[var(--cm-blue-dark)] cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL ── */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-[var(--cm-border)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-base font-bold text-[var(--cm-ink)]">Edit Account Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location</label>
                <input
                  type="text"
                  value={profileForm.campusLocation}
                  onChange={(e) => setProfileForm({ ...profileForm, campusLocation: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student ID / Roll No</label>
                <input
                  type="text"
                  value={profileForm.studentId}
                  onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-[var(--cm-blue)]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="rounded-full border border-slate-300 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-full bg-[var(--cm-blue)] px-6 py-2 text-xs font-bold text-white hover:bg-[var(--cm-blue-dark)] cursor-pointer"
                >
                  {savingProfile ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[var(--cm-border)] text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Listing</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this listing from Supabase? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="flex-1 rounded-full border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
