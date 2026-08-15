import {
  Instagram,
  Twitter,
  Github,
  Youtube,
  Mail,
  Globe,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function NewsLetter() {
  const [mail, setMail] = useState("");

  const handleOnClick = (e) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    if (!isValidEmail) {
      toast.error("Please enter a valid student email address.");
      return;
    }
    toast.success("🎉 Subscribed to BuyKaro Campus Deals!");
    setMail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b132b] via-[#111827] to-[#1e1b4b] text-white p-8 sm:p-14 text-center border border-indigo-950/80 shadow-xl">
        {/* Glow circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="animate-pulse" />
            Stay in the Campus Loop
          </div>

          <h2
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get Exclusive Student Deals
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Subscribe for instant alerts on textbook giveaways, hostel clearance sales, and campus tech drops on BuyKaro.
          </p>

          <form onSubmit={handleOnClick} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="Enter your student email"
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3.5 text-sm text-white placeholder-slate-400 outline-none backdrop-blur-md focus:border-indigo-400 focus:bg-white/15 focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="submit"
              className="cm-gradient-btn px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center items-center gap-5 text-slate-400">
            <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-white hover:bg-white/10 transition">
              <Instagram size={18} />
            </Link>
            <Link to="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-white hover:bg-white/10 transition">
              <Github size={18} />
            </Link>
            <Link to="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-white hover:bg-white/10 transition">
              <Youtube size={18} />
            </Link>
            <Link to="mailto:support@buykaro.in" className="p-2 rounded-full hover:text-white hover:bg-white/10 transition">
              <Mail size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}