import React, { useState, useEffect } from "react";
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
  Download,
  KeyRound,
  RotateCcw,
  X,
} from "lucide-react";

export default function Settings() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  // Settings states loaded from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("buykaro_settings");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      notifyChat: true,
      notifyPriceDrops: true,
      notifyMeetups: true,
      showPhoneToVerified: true,
      showCollegeBadge: true,
      autoAcceptMeetupRadius: true,
    };
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("buykaro_settings", JSON.stringify(updated));
      return updated;
    });
    toast.success("Preference saved!");
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem("buykaro_settings", JSON.stringify(settings));
    toast.success("⚙️ Account settings & privacy preferences saved!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    toast.success("🔐 Password updated securely!");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleExportData = () => {
    const backup = {
      profile: JSON.parse(localStorage.getItem("buykaro_user_profile") || "{}"),
      orders: JSON.parse(localStorage.getItem("buykaro_orders") || "[]"),
      listings: JSON.parse(localStorage.getItem("buykaro_user_listings") || "[]"),
      favorites: JSON.parse(localStorage.getItem("buykaro_favorites") || "[]"),
      settings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buykaro-student-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("📦 Campus data exported to JSON file!");
  };

  const handleResetData = () => {
    if (window.confirm("Reset all local demo orders, listings, and preferences to defaults?")) {
      localStorage.removeItem("buykaro_orders");
      localStorage.removeItem("buykaro_user_listings");
      localStorage.removeItem("buykaro_favorites");
      localStorage.removeItem("buykaro_settings");
      localStorage.removeItem("buykaro_cart");
      toast.info("Demo data reset to defaults. Reloading...");
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
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
                {(profile?.name || localStorage.getItem("loggedInUser") || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {profile?.name || profile?.fullName || localStorage.getItem("loggedInUser") || "Arjun Verma"}
                </h3>
                <p className="text-xs text-slate-500">{user?.email || "arjun.verma@iitd.ac.in"}</p>
                <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={13} /> Verified Student Member
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <KeyRound size={13} /> Change Password
              </button>
              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-700 text-xs font-bold transition cursor-pointer"
              >
                Edit Profile
              </Link>
            </div>
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
                    checked={settings.showPhoneToVerified}
                    onChange={() => handleToggle("showPhoneToVerified")}
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
                    checked={settings.showCollegeBadge}
                    onChange={() => handleToggle("showCollegeBadge")}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-indigo-50/30 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Campus Meetup Zone Auto-Suggest</p>
                    <p className="text-[11px] text-slate-500">Auto-fill recommended campus safe zones (Library, Gate 2, Cafeteria).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoAcceptMeetupRadius}
                    onChange={() => handleToggle("autoAcceptMeetupRadius")}
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
                    checked={settings.notifyChat}
                    onChange={() => handleToggle("notifyChat")}
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
                    checked={settings.notifyMeetups}
                    onChange={() => handleToggle("notifyMeetups")}
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
                    checked={settings.notifyPriceDrops}
                    onChange={() => handleToggle("notifyPriceDrops")}
                    className="h-5 w-5 rounded-md accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="cm-gradient-btn px-6 py-2.5 rounded-full text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} />
                  Save All Preferences
                </button>
              </div>
            </div>
          </form>

          {/* Data Backup & Reset */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Data Management &amp; Backup</h3>
            <p className="text-xs text-slate-500">Download a complete JSON export of your orders, listings, and saved items.</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
              >
                <Download size={14} /> Download My Data (JSON)
              </button>
              <button
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                <RotateCcw size={14} /> Reset Demo Data
              </button>
            </div>
          </div>

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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-indigo-100 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound size={18} className="text-indigo-600" />
                Change Student Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cm-gradient-btn px-6 py-2 rounded-full text-white text-xs font-bold shadow-md transition"
                >
                  Update Password
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
