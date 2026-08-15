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
      <div className="relative overflow-hidden rounded-[1.75rem]">
        <img
          src={IMAGES.hero.campusLife}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f1ff]/92 via-[#f0f5fb]/94 to-[#eef2ff]/96" />

        <div className="relative px-6 py-14 text-center sm:px-10 sm:py-16 md:py-20">
          <h1
            className="cm-rise mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--cm-ink)] sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The smartest way to buy &amp; sell on campus.
          </h1>

          <p className="cm-rise cm-rise-delay-1 mx-auto mt-4 max-w-xl text-base text-[var(--cm-slate)] sm:text-lg">
            Join thousands of students trading textbooks, tech, and dorm essentials
            securely on Buykro.
          </p>

          <form
            onSubmit={handleSearch}
            className="cm-rise cm-rise-delay-2 mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-[0_8px_30px_rgba(37,99,235,0.12)] ring-1 ring-[var(--cm-border)]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-3 text-sm text-[var(--cm-ink)] outline-none placeholder:text-[var(--cm-slate)] sm:text-base"
            />
            <button
              type="submit"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--cm-blue)] text-white transition hover:scale-105 hover:bg-[var(--cm-blue-dark)] active:scale-95"
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
