import { Link } from "react-router-dom";

const LINKS = [
  { label: "Safety Tips", to: "/upcoming" },
  { label: "Community Rules", to: "/upcoming" },
  { label: "Contact Support", to: "/upcoming" },
  { label: "Privacy Policy", to: "/upcoming" },
  { label: "Help Center", to: "/upcoming" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--cm-border)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          to="/"
          className="text-lg font-extrabold text-[var(--cm-blue)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Buykro
        </Link>

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-[var(--cm-slate)] transition hover:text-[var(--cm-blue)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-[var(--cm-slate)]">
          © {new Date().getFullYear()} Buykro. Built for students, by students.
        </p>
      </div>
    </footer>
  );
}
