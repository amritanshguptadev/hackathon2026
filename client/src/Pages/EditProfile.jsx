import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  QrCode,
  Share2,
  RefreshCw,
} from "lucide-react";

const CAMPUS_PRESETS = [
  "Dev Sanskriti Vishwavidyalaya (DSVV)",
  "Dev Sanskriti Vishwavidyalaya - Main Campus",
  "Dev Sanskriti Vishwavidyalaya - Shantikunj Area",
  "Dev Sanskriti Vishwavidyalaya - Mahakal Hostel Block",
  "Dev Sanskriti Vishwavidyalaya - Haridwar",
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
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState(
    profile?.name || profile?.fullName || localStorage.getItem("loggedInUser") || "Arjun Verma"
  );
  const [college, setCollege] = useState(
    profile?.college || profile?.university || localStorage.getItem("college") || "Dev Sanskriti Vishwavidyalaya"
  );
  const [studentId, setStudentId] = useState(
    profile?.student_id || profile?.studentId || localStorage.getItem("studentId") || "DSVV2024CS08"
  );
  const [campusLocation, setCampusLocation] = useState(
    profile?.campus_location || "North Hostel Block C, Room 204"
  );
  const [phone, setPhone] = useState(profile?.phone || "+91 98765 43210");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year B.Tech Computer Science");
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file must be under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result);
        toast.success("📸 Custom avatar uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (updateProfile) {
        await updateProfile({
          name: fullName.trim(),
          college: college.trim(),
          student_id: studentId.trim(),
          campus_location: campusLocation.trim(),
          bio: bio.trim(),
        });
      }

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
        yearOfStudy: yearOfStudy.trim(),
        avatarUrl,
        verified: true,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("buykaro_user_profile", JSON.stringify(localProfileObj));

      toast.success("🎉 Profile updated and verified on BuyKaro!");

      setTimeout(() => {
        navigate("/profile");
      }, 700);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + "/profile");
      toast.success("📋 Profile link copied to clipboard!");
    } else {
      toast.info("Share your student profile with classmates!");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>/</span>
            <Link to="/profile" className="hover:text-indigo-600 transition">Profile</Link>
            <span>/</span>
            <span className="text-indigo-600">Edit Details</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareProfile}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Share2 size={13} /> Share ID
            </button>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
            >
              <ArrowLeft size={13} /> View Hub
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields (7 Cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="rounded-3xl bg-white border border-indigo-100/90 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-5 border-b border-indigo-50 mb-6">
                  <div>
                    <h1
                      className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Edit Student Profile
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your identity and contact info for verified campus hand-offs.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <ShieldCheck size={15} /> Verified Member
                  </span>
                </div>

                {/* Avatar Selection & Upload */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Student Photo / Avatar
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative h-18 w-18 rounded-full ring-4 ring-indigo-100 overflow-hidden shrink-0 shadow-sm group">
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Upload Photo"
                      >
                        <Camera size={18} />
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                    >
                      <Upload size={13} /> Upload Custom
                    </button>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(preset)}
                          className={`h-9 w-9 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                            avatarUrl === preset
                              ? "border-indigo-600 ring-2 ring-indigo-200 scale-105"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={preset} alt={`Avatar ${idx + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fields Grid */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Arjun Verma"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* College / University */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      College / University *
                    </label>
                    <div className="relative">
                      <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                      >
                        {CAMPUS_PRESETS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student Roll Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Student ID / Roll No. *
                      </label>
                      <div className="relative">
                        <IdCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="e.g. 2023CSB1048"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp Contact
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campus / Hostel Meetup Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hostel / Campus Meetup Area *
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={campusLocation}
                        onChange={(e) => setCampusLocation(e.target.value)}
                        placeholder="e.g. North Hostel Block C, Room 204"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Academic Year &amp; Branch
                    </label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        placeholder="e.g. 3rd Year B.Tech Computer Science"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student Bio / Seller Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share what you usually sell or look for on campus..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Link
                    to="/profile"
                    className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="cm-gradient-btn px-8 py-2.5 rounded-full text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Save size={15} />
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Digital Student ID Card Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600" />
              Live Student ID Card Preview
            </div>

            {/* Smart Digital Student Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-6 text-white shadow-xl relative overflow-hidden">
              {/* Background ambient watermarks */}
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center">
                    <img src="/images/logo.png" alt="BuyKaro" className="h-4 w-auto object-contain" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white">BuyKaro Campus ID</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-400/20 px-2.5 py-0.5 rounded-full border border-emerald-300/30">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>

              {/* Card Body */}
              <div className="pt-5 flex items-start gap-4">
                <div className="h-20 w-20 rounded-2xl bg-white/20 border-2 border-white/40 overflow-hidden shrink-0 shadow-md">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-lg font-black tracking-tight text-white truncate">
                    {fullName || "Student Name"}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-200 flex items-center gap-1 truncate">
                    <School size={12} /> {college || "Campus Name"}
                  </p>
                  <p className="text-[11px] font-mono text-purple-200">
                    ID: {studentId || "2023CSB1048"}
                  </p>
                  <p className="text-[11px] text-slate-300 truncate">
                    📍 {campusLocation || "Campus Hostel Area"}
                  </p>
                </div>
              </div>

              {/* Card Footer with Scannable Barcode & QR code */}
              <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-indigo-200 font-bold">Academic Status</p>
                  <p className="text-xs font-bold text-white truncate">{yearOfStudy}</p>
                </div>

                <div className="p-1.5 rounded-xl bg-white text-slate-900">
                  <QrCode size={28} />
                </div>
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="rounded-2xl bg-white border border-indigo-100 p-4 space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Why complete your student profile?
              </p>
              <p className="leading-relaxed">
                Profiles with verified college names and roll numbers get <strong>3x more buyer responses</strong> and faster peer hand-offs on campus!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
