import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  BookOpen,
  ShieldCheck,
  Save,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Camera,
  School,
  IdCard,
} from "lucide-react";

const CAMPUS_PRESETS = [
  "IIT Delhi",
  "BITS Pilani",
  "Delhi University (DU)",
  "VIT Vellore",
  "IIT Bombay",
  "SRM University",
  "DTU Delhi",
  "NIT Trichy",
  "MIT Pune",
  "Manipal University",
  "Jadavpur University",
  "IIT Roorkee",
  "BHU Varanasi",
  "Thapar University",
  "Other Campus",
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
];

export default function EditProfile() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(
    profile?.name || profile?.fullName || localStorage.getItem("loggedInUser") || ""
  );
  const [college, setCollege] = useState(
    profile?.college || profile?.university || localStorage.getItem("college") || "IIT Delhi"
  );
  const [studentId, setStudentId] = useState(
    profile?.student_id || profile?.studentId || localStorage.getItem("studentId") || "STU-2026-489"
  );
  const [campusLocation, setCampusLocation] = useState(
    profile?.campus_location || "North Hostel Block C, Room 204"
  );
  const [phone, setPhone] = useState(profile?.phone || "+91 98765 43210");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year B.Tech");
  const [bio, setBio] = useState(
    profile?.bio || "Student coder, tech enthusiast, and bibliophile. Selling textbooks & electronics at fair 2nd-hand rates!"
  );
  const [avatarUrl, setAvatarUrl] = useState(
    profile?.profile_image || AVATAR_PRESETS[0]
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.name) setFullName(profile.name);
      if (profile.college) setCollege(profile.college);
      if (profile.student_id) setStudentId(profile.student_id);
      if (profile.campus_location) setCampusLocation(profile.campus_location);
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Sync to Supabase if logged in
      if (updateProfile) {
        await updateProfile({
          name: fullName.trim(),
          college: college.trim(),
          student_id: studentId.trim(),
          campus_location: campusLocation.trim(),
          bio: bio.trim(),
        });
      }

      // 2. Sync to local storage for local fallbacks
      localStorage.setItem("loggedInUser", fullName.trim());
      localStorage.setItem("college", college.trim());
      localStorage.setItem("studentId", studentId.trim());

      const localProfileObj = {
        name: fullName.trim(),
        college: college.trim(),
        studentId: studentId.trim(),
        campusLocation: campusLocation.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        avatarUrl,
        verified: true,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("buykaro_user_profile", JSON.stringify(localProfileObj));

      toast.success("🎉 Profile updated successfully on BuyKaro!");

      setTimeout(() => {
        navigate("/profile");
      }, 900);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>/</span>
            <Link to="/profile" className="hover:text-indigo-600 transition">Profile</Link>
            <span>/</span>
            <span className="text-indigo-600">Edit Details</span>
          </div>

          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs transition"
          >
            <ArrowLeft size={14} /> Back to Profile
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Card */}
          <div className="rounded-3xl bg-white border border-indigo-100/90 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-indigo-50 mb-6">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Edit Student Profile
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Keep your college information and hand-off contact details up to date for campus peers.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <ShieldCheck size={15} /> Verified Student
              </span>
            </div>

            {/* Avatar Selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Student Avatar
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative h-20 w-20 rounded-full ring-4 ring-indigo-100 overflow-hidden shrink-0 shadow-sm">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition cursor-pointer">
                    <Camera size={20} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`h-11 w-11 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                        avatarUrl === preset ? "border-indigo-600 ring-2 ring-indigo-200 scale-105" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={preset} alt={`Avatar ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Verma"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* College / University */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  College / University *
                </label>
                <div className="relative">
                  <School size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  >
                    {CAMPUS_PRESETS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student ID / Roll Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Student ID / Roll No. *
                </label>
                <div className="relative">
                  <IdCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2023CSB1048"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Campus / Hostel Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hostel / Campus Meetup Area *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={campusLocation}
                    onChange={(e) => setCampusLocation(e.target.value)}
                    placeholder="e.g. North Hostel Block C, Room 204"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  WhatsApp / Hand-off Mobile
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Year of Study */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Year of Study & Degree
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    placeholder="e.g. 3rd Year B.Tech Computer Science"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Student Bio / Seller Notes
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share what you usually sell or look for on campus..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/profile"
                className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="cm-gradient-btn px-8 py-3 rounded-full text-white font-extrabold text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
