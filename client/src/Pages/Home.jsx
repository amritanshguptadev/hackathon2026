import CategorySection from "../assets/components/Home/CategorySection";
import Footer from "../assets/components/Home/Footer";
import Header from "../assets/components/Home/Header";
import Hero from "../assets/components/Home/Hero";
import MarketplaceFeed from "../assets/components/Home/MarketplaceFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--cm-bg)]">
      <Header />
      <Hero />
      <CategorySection />
      <MarketplaceFeed />
      <Footer />
    </main>
  );
}
