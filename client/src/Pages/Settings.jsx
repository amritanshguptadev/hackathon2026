import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Bell,
  Lock,
  Eye,
  LogOut,
  User,
  CheckCircle2,
  Smartphone,
  Save,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";

export default function Settings() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  // Settings states
  const [notifyChat, setNotifyChat] = useState(true);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyMeetups, setNotifyMeetups] = useState(true);
  const [showPhoneToVerified, setShowPhoneToVerified] = useState(true);
  const [showCollegeBadge, setShowCollegeBadge] = useState(true);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast.success("⚙️ Account settings & privacy preferences saved!");
  };

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>/</span>
            <Link to="/profile" className="hover:text-indigo-600 transition">Account</Link>
            <span>/</span>
            <span className="text-indigo-600">Settings</span>
          </div>
          <h1
            className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Account Settings &amp; Privacy
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your campus security, hand-off privacy, and notification preferences.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {/* Quick Account Summary */}
          <div className="rounded-3xl bg-white border border-indigo-100/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {(profile?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {profile?.name || profile?.fullName || localStorage.getItem("loggedInUser") || "Campus Student"}
                </h3>
                <p className="text-xs text-slate-500">{user?.email || "student@buykaro.in"}</p>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={13} /> Verified Student Member
                </div>
              </div>
            </div>

            <Link
              to="/profile/edit"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-700 text-xs font-bold transition self-start sm:self-auto cursor-pointer"
            >
              Edit Profile Details
            </Link>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-6">
            {/* Hand-off Privacy Settings */}
            <div className="rounded-3xl bg-white border border-indigo-100/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Campus Meetup &amp; Privacy</h3>
                  <p className="text-xs text-slate-500">Control what verified campus peers see when you interact.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Show Contact Phone on Confirmed Meetups</p>
                    <p className="text-[11px] text-slate-500">Share your WhatsApp number only with confirmed order buyers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showPhoneToVerified}
                    onChange={(e) => setShowPhoneToVerified(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Display Verified College Badge</p>
                    <p className="text-[11px] text-slate-500">Shows your student verification seal on your product listings.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCollegeBadge}
                    onChange={(e) => setShowCollegeBadge(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-3xl bg-white border border-indigo-100/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Notification Alerts</h3>
                  <p className="text-xs text-slate-500">Choose which updates trigger notifications.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">New Buyer Inquiries &amp; Messages</p>
                    <p className="text-[11px] text-slate-500">Receive real-time alerts when a student chats about your items.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyChat}
                    onChange={(e) => setNotifyChat(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Meetup Hand-off Reminders</p>
                    <p className="text-[11px] text-slate-500">Get timely reminders 1 hour before scheduled hand-offs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyMeetups}
                    onChange={(e) => setNotifyMeetups(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Price Drops on Liked Items</p>
                    <p className="text-[11px] text-slate-500">Instant alert when a seller lowers the price on items you saved.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyPriceDrops}
                    onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="cm-gradient-btn px-6 py-2.5 rounded-full text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  Save Preferences
                </button>
              </div>
            </div>
          </form>

          {/* Account Actions & Danger Zone */}
          <div className="rounded-3xl bg-white border border-rose-100 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-rose-50">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Account Session</h3>
                <p className="text-xs text-slate-500">Sign out or switch campus accounts.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-xs font-bold text-slate-800">Sign Out of BuyKaro</p>
                <p className="text-[11px] text-slate-500">You will need to sign in again with your student email.</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
