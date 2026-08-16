import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../config/api";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  MessageCircle,
  Calendar,
  CreditCard,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Info,
} from "lucide-react";

const STATUS_CONFIG = {
  "Meetup Scheduled": {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
    color: "text-blue-600",
    desc: "Meetup scheduled with student seller",
  },
  "Hand-off Completed": {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    color: "text-emerald-600",
    desc: "Item verified and handed over on campus",
  },
  "Cancelled": {
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    icon: XCircle,
    color: "text-slate-500",
    desc: "Order was cancelled",
  },
};

export default function Orders() {
  const { orders, cancelOrder, completeOrder, orderCount } = useOrders();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPassOrder, setSelectedPassOrder] = useState(null);

  const filteredOrders = orders.filter((ord) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Scheduled") return ord.status === "Meetup Scheduled";
    if (activeFilter === "Completed") return ord.status === "Hand-off Completed";
    if (activeFilter === "Cancelled") return ord.status === "Cancelled";
    return true;
  });

  const handleBuyAgain = (item) => {
    addToCart(item, 1);
    toast.success(`🛒 "${item.title?.slice(0, 24)}..." added to Cart!`);
    navigate("/cart");
  };

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
              <span className="text-indigo-600">Your Orders</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Campus Orders
              <span className="inline-flex items-center justify-center text-sm font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                📦 {orderCount} {orderCount === 1 ? "order" : "orders"}
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track your scheduled peer hand-offs, past purchases, and verified seller meetups.
            </p>
          </div>

          <Link
            to="/all-products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full cm-gradient-btn text-xs font-bold text-white shadow-md transition self-start md:self-auto"
          >
            <ShoppingBag size={15} />
            Explore More Deals
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200/80">
          {[
            { id: "All", label: "All Orders", count: orders.length },
            {
              id: "Scheduled",
              label: "Scheduled Meetups",
              count: orders.filter((o) => o.status === "Meetup Scheduled").length,
            },
            {
              id: "Completed",
              label: "Completed Hand-offs",
              count: orders.filter((o) => o.status === "Hand-off Completed").length,
            },
            {
              id: "Cancelled",
              label: "Cancelled",
              count: orders.filter((o) => o.status === "Cancelled").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`pb-3 px-3 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeFilter === tab.id
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeFilter === tab.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
              {activeFilter === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-white border border-indigo-100/90 p-8 sm:p-14 text-center shadow-xs mb-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-5 ring-8 ring-indigo-50/40">
              <Package size={36} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} orders found
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              When you purchase second-hand textbooks, electronics, dorm essentials, or cycles from fellow students, your scheduled meetups will appear right here.
            </p>
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full cm-gradient-btn text-sm font-bold text-white shadow-md transition"
            >
              Browse Campus Deals <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Meetup Scheduled"];
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={order.orderId}
                  className="rounded-3xl bg-white border border-indigo-100/90 shadow-2xs overflow-hidden transition hover:shadow-md hover:border-indigo-200"
                >
                  {/* Order Top Summary Bar */}
                  <div className="p-5 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-blue-50/20 border-b border-indigo-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order Placed</p>
                        <p className="font-bold text-slate-900 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order ID</p>
                        <p className="font-extrabold text-indigo-600 mt-0.5">
                          #{order.orderId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Amount</p>
                        <p className="font-extrabold text-slate-900 mt-0.5">
                          ₹{typeof order.total === "number" ? order.total.toLocaleString("en-IN") : order.total}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge & Pass Action */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.badge}`}
                      >
                        <StatusIcon size={14} />
                        {order.status}
                      </span>

                      {order.status === "Meetup Scheduled" && (
                        <button
                          onClick={() => setSelectedPassOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition cursor-pointer"
                        >
                          <QrCode size={13} />
                          Hand-off Pass
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Purchased Items */}
                    <div className="lg:col-span-7 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Purchased Items ({order.items?.length || 1})
                      </h3>

                      <div className="divide-y divide-slate-100">
                        {order.items?.map((item, idx) => {
                          const itemId = item._id || item.id;
                          return (
                            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                              <Link
                                to={`/api/product/${itemId}`}
                                className="h-16 w-16 shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-1.5 flex items-center justify-center overflow-hidden"
                              >
                                <img
                                  src={resolveImageUrl(item.image)}
                                  alt={item.title}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/products/1.jpg";
                                  }}
                                  className="h-full w-full object-contain"
                                />
                              </Link>

                              <div className="flex-1 min-w-0">
                                <Link to={`/api/product/${itemId}`}>
                                  <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1">
                                    {item.title}
                                  </h4>
                                </Link>

                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                  <span>Qty: {item.quantity || 1}</span>
                                  <span>•</span>
                                  <span className="font-extrabold text-indigo-700">
                                    ₹{typeof item.price === "number" ? item.price.toLocaleString("en-IN") : item.price}
                                  </span>
                                  {item.seller && (
                                    <>
                                      <span>•</span>
                                      <span className="text-slate-600 font-medium truncate">
                                        Seller: {item.seller.name || item.seller.college}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => handleBuyAgain(item)}
                                className="shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                              >
                                Buy Again
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Hand-Off Meetup Details & Controls */}
                    <div className="lg:col-span-5 rounded-2xl bg-slate-50/80 border border-slate-100 p-4 space-y-3.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <MapPin size={14} className="text-indigo-600" />
                        Campus Hand-off Details
                      </h3>

                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-900">{order.meetupLocation}</p>
                            <p className="text-xs text-slate-500">Designated meetup spot</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar size={15} className="text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-900">{order.preferredTime}</p>
                            <p className="text-xs text-slate-500">Agreed meeting window</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CreditCard size={15} className="text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-900">{order.paymentMethod}</p>
                            <p className="text-xs text-slate-500">Pay directly during physical hand-off</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-200/60 flex flex-wrap gap-2">
                        <Link
                          to="/messages"
                          className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <MessageCircle size={14} />
                          Chat Seller
                        </Link>

                        {order.status === "Meetup Scheduled" && (
                          <>
                            <button
                              onClick={() => completeOrder(order.orderId)}
                              className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 size={14} />
                              Confirm Hand-off
                            </button>
                            <button
                              onClick={() => cancelOrder(order.orderId)}
                              className="inline-flex items-center justify-center py-2 px-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-semibold transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Hand-off Meetup Pass Modal */}
      {selectedPassOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-indigo-100 text-center animate-scale-in relative">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-md">
              <QrCode size={32} />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Campus Hand-off Pass
            </span>

            <h3
              className="text-2xl font-extrabold text-slate-900 mt-2 mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Order #{selectedPassOrder.orderId}
            </h3>

            <p className="text-xs text-slate-500 mb-5">
              Show this security code to the student seller when you meet up on campus.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-indigo-200 mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Verification Code</p>
              <p className="text-3xl font-black text-indigo-700 tracking-widest mt-1">
                {selectedPassOrder.meetupCode || "BK-9482"}
              </p>
            </div>

            <div className="text-left text-xs space-y-2 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 mb-6">
              <p className="text-slate-700">
                📍 <strong>Location:</strong> {selectedPassOrder.meetupLocation}
              </p>
              <p className="text-slate-700">
                ⏰ <strong>Time:</strong> {selectedPassOrder.preferredTime}
              </p>
              <p className="text-slate-700">
                💵 <strong>Total:</strong> ₹{selectedPassOrder.total?.toLocaleString("en-IN")} ({selectedPassOrder.paymentMethod})
              </p>
            </div>

            <button
              onClick={() => setSelectedPassOrder(null)}
              className="w-full py-3 rounded-full cm-gradient-btn text-white text-sm font-bold shadow-md transition"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
