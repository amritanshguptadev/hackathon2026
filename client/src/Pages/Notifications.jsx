import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import {
  Bell,
  CheckCircle2,
  Clock,
  Tag,
  MessageCircle,
  ShieldCheck,
  Trash2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Check,
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "meetup",
    title: "Hand-off Meetup Scheduled! 📍",
    message: "Arjun Verma confirmed the meetup for HP ProBook 15.6\" at Central Library Ground Floor (4:00 PM – 6:00 PM).",
    timeAgo: "10m ago",
    read: false,
    link: "/orders",
    actionLabel: "View Meetup Pass",
    icon: Clock,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "notif-2",
    type: "price_drop",
    title: "Price Drop on Saved Item! 🔥",
    message: "Hero Sprint 21-Speed Mountain Bike dropped from ₹3,200 to ₹2,499. Check it out before it sells!",
    timeAgo: "2h ago",
    read: false,
    link: "/wishlist",
    actionLabel: "View Liked Item",
    icon: TrendingDown,
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    id: "notif-3",
    type: "chat",
    title: "New Buyer Message Received 💬",
    message: "Tanmay Deshmukh: 'Hey! Is the textbook stack still available for pickup today?'",
    timeAgo: "5h ago",
    read: true,
    link: "/messages",
    actionLabel: "Reply to Chat",
    icon: MessageCircle,
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "notif-4",
    type: "verified",
    title: "Campus Student Badge Active 🎓",
    message: "Your profile has been verified as a campus member. Enjoy instant zero-fee hand-offs!",
    timeAgo: "1d ago",
    read: true,
    link: "/profile",
    actionLabel: "View Badge",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info("Cleared all notifications.");
  };

  const markSingle = (id, e) => {
    e?.stopPropagation?.();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteSingle = (id, e) => {
    e?.stopPropagation?.();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification removed.");
  };

  const handleSendTestAlert = () => {
    const testAlerts = [
      {
        title: "⚡ Flash Campus Deal!",
        message: "A senior student just listed an iPad 9th Gen for ₹14,500 near North Campus!",
        type: "price_drop",
        link: "/all-products",
        actionLabel: "Check Listing",
        icon: TrendingDown,
        color: "bg-amber-50 text-amber-600 border-amber-100",
      },
      {
        title: "📦 Meetup Location Updated",
        message: "Seller requested to meet near Hostel 4 Cafeteria instead.",
        type: "meetup",
        link: "/orders",
        actionLabel: "View Order",
        icon: Clock,
        color: "bg-blue-50 text-blue-600 border-blue-100",
      },
      {
        title: "💬 New Offer on your Listing!",
        message: "Pooja Sharma offered ₹750 for your Calculus textbook set.",
        type: "chat",
        link: "/messages",
        actionLabel: "Accept / Counter",
        icon: MessageCircle,
        color: "bg-purple-50 text-purple-600 border-purple-100",
      },
    ];

    const pick = testAlerts[Math.floor(Math.random() * testAlerts.length)];
    const newNotif = {
      id: `notif-${Date.now()}`,
      timeAgo: "Just now",
      read: false,
      ...pick,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    toast.info(`🔔 New Campus Alert: ${pick.title}`);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Meetups") return n.type === "meetup";
    if (filter === "Price Drops") return n.type === "price_drop";
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={true} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
              <span>/</span>
              <Link to="/profile" className="hover:text-indigo-600 transition">Account</Link>
              <span>/</span>
              <span className="text-indigo-600">Notifications</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Campus Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time updates on scheduled meetups, price drops, and campus inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleSendTestAlert}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <PlusCircle size={14} />
              Test Alert
            </button>
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3.5 py-2 rounded-full border border-indigo-100 transition cursor-pointer"
                >
                  Mark read
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 p-2 rounded-full hover:bg-rose-50 transition cursor-pointer"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200/80">
          {["All", "Unread", "Meetups", "Price Drops"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                filter === f
                  ? "text-indigo-600"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {f}
              {filter === f && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifs.length === 0 ? (
          <div className="rounded-3xl bg-white border border-indigo-100/90 p-8 sm:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 ring-8 ring-indigo-50/40">
              <Bell size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              You're all caught up!
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              No new alerts right now. We will notify you when a seller confirms your hand-off or when an item on your wishlist drops in price.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleSendTestAlert}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
              >
                <PlusCircle size={14} /> Send Sample Alert
              </button>
              <Link
                to="/all-products"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full cm-gradient-btn text-xs font-bold text-white shadow-md transition"
              >
                Browse Marketplace <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            {filteredNotifs.map((notif) => {
              const IconComp = notif.icon || Bell;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markSingle(notif.id);
                    if (notif.link) navigate(notif.link);
                  }}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs group cursor-pointer ${
                    notif.read
                      ? "bg-white border-slate-200/80 hover:border-indigo-200"
                      : "bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50/70"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl border shrink-0 ${notif.color}`}>
                      <IconComp size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-2">
                          {notif.title}
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          )}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {notif.timeAgo}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100/60">
                        {notif.actionLabel && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                            {notif.actionLabel} →
                          </span>
                        )}
                        {!notif.read && (
                          <button
                            onClick={(e) => markSingle(notif.id, e)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 ml-auto"
                          >
                            <Check size={12} /> Mark read
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteSingle(notif.id, e)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 p-1"
                          title="Delete alert"
                        >
                          <Trash2 size={13} />
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

      <Footer />
    </div>
  );
}
