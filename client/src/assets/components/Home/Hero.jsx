import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../../data/images";

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/all-products");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-indigo-100/80 shadow-sm">
        <img
          src={IMAGES.hero.campusLife}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#eff6ff]/95 via-[#f5f3ff]/94 to-[#eef2ff]/96" />

        <div className="relative px-6 py-14 text-center sm:px-10 sm:py-16 md:py-20">
          <h1
            className="cm-rise mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The smartest way to{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              buy &amp; sell
            </span>{" "}
            on campus.
          </h1>

          <p className="cm-rise cm-rise-delay-1 mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
            Join thousands of students trading textbooks, tech, bikes, and dorm essentials
            securely on <span className="font-bold text-indigo-700">BuyKaro</span>.
          </p>

          <form
            onSubmit={handleSearch}
            className="cm-rise cm-rise-delay-2 mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-[0_12px_36px_rgba(79,70,229,0.14)] ring-1 ring-indigo-200/80 transition-all focus-within:ring-2 focus-within:ring-indigo-500/40"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search textbooks, tech, lab gear, cycles…"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-3 text-sm text-[var(--cm-ink)] outline-none placeholder:text-slate-400 sm:text-base"
            />
            <button
              type="submit"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full cm-gradient-btn text-white transition hover:scale-105 active:scale-95"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
