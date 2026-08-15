import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "Browse Products", to: "/all-products" },
  { label: "Sell an Item", to: "/product-listing" },
  { label: "Giveaways", to: "/upcoming" },
  { label: "Deals & Offers", to: "/upcoming" },
  { label: "How It Works", to: "/upcoming" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", to: "/upcoming" },
  { label: "Safety Tips", to: "/upcoming" },
  { label: "Community Rules", to: "/upcoming" },
  { label: "Report an Issue", to: "/upcoming" },
  { label: "Contact Support", to: "/upcoming" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/upcoming" },
  { label: "Terms of Service", to: "/upcoming" },
  { label: "Cookie Policy", to: "/upcoming" },
  { label: "Disclaimer", to: "/upcoming" },
];

const CATEGORIES = [
  "Electronics",
  "Books & Notes",
  "Furniture",
  "Cycles & Transport",
  "Hostel Essentials",
  "Appliances",
  "Clothing",
  "Sports & Fitness",
  "Stationery",
  "Musical Instruments",
];

const SOCIAL = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-indigo-950 bg-[#0b132b] text-slate-300">
      {/* Top CTA strip */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-5 px-4 shadow-inner">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-white" />
            <p className="text-sm font-bold text-white sm:text-base">
              Have textbooks, gadgets, or room essentials to sell? List for free!
            </p>
          </div>
          <Link
            to="/sell"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-extrabold text-indigo-700 shadow-md transition hover:bg-slate-50 hover:scale-105 active:scale-95"
          >
            Start Selling Free <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Main footer body */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="rounded-xl bg-white px-3.5 py-1.5 shadow-sm transition hover:opacity-95">
                <img src="/images/logo.png" alt="BuyKaro" className="h-8 sm:h-9 w-auto object-contain" />
              </div>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              India's #1 student marketplace. Buy, sell, and exchange items
              within your campus community — safely, quickly, and for free.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-[var(--cm-blue)]" />
                <span>support@buykaro.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-[var(--cm-blue)]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-[var(--cm-blue)]" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition hover:bg-[var(--cm-blue)] hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-7">
              <p className="mb-2 text-sm font-semibold text-white">Get campus deals in your inbox</p>
              <form className="flex overflow-hidden rounded-full border border-slate-600 bg-slate-800">
                <input
                  type="email"
                  placeholder="your@college.edu"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[var(--cm-blue)] px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
                  >
                    <ArrowRight size={12} className="text-[var(--cm-blue)]" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Support</h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
                  >
                    <ArrowRight size={12} className="text-[var(--cm-blue)]" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Categories</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/all-products"
                    className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
                  >
                    <ArrowRight size={12} className="text-[var(--cm-blue)]" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BuyKaro Technologies Pvt. Ltd. All rights reserved. Built for students, by students. 🎓
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
