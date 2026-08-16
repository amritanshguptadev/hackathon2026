import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";
import { resolveImageUrl } from "../config/api";
import { DEMO_LISTINGS } from "../data/images";
import {
  Tag,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  TrendingUp,
  Package,
  DollarSign,
  MapPin,
  X,
  Save,
  ShieldCheck,
  Filter,
} from "lucide-react";

const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reserved: "bg-amber-50 text-amber-700 border-amber-200",
  Sold: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function MyListings() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    setLoading(true);
    const customListings = JSON.parse(
      localStorage.getItem("buykaro_user_listings") ||
      localStorage.getItem("studx_user_listings") ||
      "[]"
    );

    if (user?.id) {
      productService
        .getUserProducts(user.id)
        .then((remoteListings) => {
          const merged = [...(Array.isArray(remoteListings) ? remoteListings : [])];
          customListings.forEach((c) => {
            if (!merged.some((m) => String(m.id || m._id) === String(c.id || c._id))) {
              merged.push(c);
            }
          });
          setListings(merged.length > 0 ? merged : DEMO_LISTINGS.slice(0, 3));
        })
        .catch(() => {
          setListings(customListings.length > 0 ? customListings : DEMO_LISTINGS.slice(0, 3));
        })
        .finally(() => setLoading(false));
    } else {
      setListings(customListings.length > 0 ? customListings : DEMO_LISTINGS.slice(0, 3));
      setLoading(false);
    }
  }, [user?.id]);

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productService.updateProductStatus?.(productId, newStatus);
      const updated = listings.map((item) =>
        String(item.id || item._id) === String(productId)
          ? { ...item, status: newStatus }
          : item
      );
      setListings(updated);

      const customListings = JSON.parse(
        localStorage.getItem("buykaro_user_listings") || "[]"
      );
      const updatedLocal = customListings.map((item) =>
        String(item.id || item._id) === String(productId)
          ? { ...item, status: newStatus }
          : item
      );
      localStorage.setItem("buykaro_user_listings", JSON.stringify(updatedLocal));

      toast.success(`Listing status updated to "${newStatus}"!`);
    } catch {
      toast.info(`Listing marked as ${newStatus}`);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;

    try {
      await productService.deleteProduct?.(productId);
    } catch (err) {
      console.warn("Server delete fallback:", err);
    }

    const updated = listings.filter(
      (item) => String(item.id || item._id) !== String(productId)
    );
    setListings(updated);

    const customListings = JSON.parse(
      localStorage.getItem("buykaro_user_listings") || "[]"
    );
    const filteredLocal = customListings.filter(
      (item) => String(item.id || item._id) !== String(productId)
    );
    localStorage.setItem("buykaro_user_listings", JSON.stringify(filteredLocal));

    toast.success("Listing deleted successfully.");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSavingEdit(true);
    const prodId = editingItem.id || editingItem._id;

    try {
      await productService.updateProduct?.(prodId, {
        title: editingItem.title,
        price: Number(editingItem.price),
        description: editingItem.description,
        condition: editingItem.condition,
        campusLocation: editingItem.campusLocation,
      });

      const updated = listings.map((item) =>
        String(item.id || item._id) === String(prodId) ? editingItem : item
      );
      setListings(updated);

      const customListings = JSON.parse(
        localStorage.getItem("buykaro_user_listings") || "[]"
      );
      const updatedLocal = customListings.map((item) =>
        String(item.id || item._id) === String(prodId) ? editingItem : item
      );
      localStorage.setItem("buykaro_user_listings", JSON.stringify(updatedLocal));

      toast.success("Listing updated successfully!");
      setEditingItem(null);
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return (item.status || "Available") === "Available";
    if (activeFilter === "Reserved") return item.status === "Reserved";
    if (activeFilter === "Sold") return item.status === "Sold";
    return true;
  });

  const totalActive = listings.filter((l) => (l.status || "Available") === "Available").length;
  const totalSold = listings.filter((l) => l.status === "Sold").length;
  const totalEarnings = listings
    .filter((l) => l.status === "Sold")
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={true} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
              <span>/</span>
              <Link to="/profile" className="hover:text-indigo-600 transition">Account</Link>
              <span>/</span>
              <span className="text-indigo-600">My Listings</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Campus Listings
              <span className="inline-flex items-center justify-center text-sm font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                🏷️ {listings.length} items
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your active items for sale, update prices, or mark items as sold.
            </p>
          </div>

          <Link
            to="/sell"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full cm-gradient-btn text-sm font-bold text-white shadow-md transition self-start md:self-auto"
          >
            <PlusCircle size={18} />
            + Post New Item
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 border border-indigo-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Tag size={16} />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{totalActive}</p>
            <p className="text-xs text-slate-500 mt-0.5">Live on Marketplace</p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-indigo-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sold</span>
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{totalSold}</p>
            <p className="text-xs text-slate-500 mt-0.5">Handed over to peers</p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-indigo-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earnings</span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <DollarSign size={16} />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">₹{totalEarnings.toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-500 mt-0.5">From sold campus gear</p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-indigo-100/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Reach</span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Eye size={16} />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">100%</p>
            <p className="text-xs text-slate-500 mt-0.5">Verified Student Views</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200/80">
          {["All", "Active", "Reserved", "Sold"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`pb-3 px-3 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeFilter === filter
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {filter} Listings
              {activeFilter === filter && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="rounded-3xl bg-white border border-indigo-100/90 p-8 sm:p-14 text-center shadow-xs mb-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-5 ring-8 ring-indigo-50/40">
              <Tag size={36} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} listings
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Have unused textbooks, earphones, a study table, or an old cycle in your hostel room? List it now in 60 seconds!
            </p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full cm-gradient-btn text-sm font-bold text-white shadow-md transition"
            >
              + List an Item Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredListings.map((item, idx) => {
              const prodId = item._id || item.id || `my-item-${idx}`;
              const currentStatus = item.status || "Available";
              const statusBadge = STATUS_STYLES[currentStatus] || STATUS_STYLES.Available;

              return (
                <div
                  key={prodId}
                  className="rounded-3xl bg-white border border-indigo-100/90 shadow-2xs hover:border-indigo-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative aspect-[16/10] bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/products/1.jpg";
                      }}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />

                    <span
                      className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold border shadow-2xs ${statusBadge}`}
                    >
                      {currentStatus}
                    </span>

                    <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs">
                      {item.condition || "Good"}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {item.category || "Hostel Gear"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <MapPin size={12} className="text-indigo-400" />
                          {item.campusLocation || item.location || "Campus Area"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Your Price</p>
                          <p className="text-xl font-black text-indigo-700">
                            ₹{typeof item.price === "number" ? item.price.toLocaleString("en-IN") : item.price}
                          </p>
                        </div>

                        {/* Status Quick Changer Dropdown */}
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(prodId, e.target.value)}
                          className="text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 outline-none transition focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          to={`/api/product/${prodId}`}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                        >
                          <Eye size={13} /> View
                        </Link>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-700 text-xs font-bold transition cursor-pointer"
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prodId)}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-100/60 text-rose-600 text-xs font-bold transition cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Listing Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-indigo-100 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit size={18} className="text-indigo-600" />
                Edit Listing
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Condition
                  </label>
                  <select
                    value={editingItem.condition || "Good"}
                    onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Meetup Location
                </label>
                <input
                  type="text"
                  value={editingItem.campusLocation || editingItem.location || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, campusLocation: e.target.value, location: e.target.value })
                  }
                  placeholder="e.g. Central Library, Hostel Gate"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="cm-gradient-btn px-6 py-2.5 rounded-full text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Save size={14} />
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
