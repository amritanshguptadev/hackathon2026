import BestDeals from "../assets/components/Home/BestDeals";
import CategorySection from "../assets/components/Home/CategorySection";
import FeatureProducts from "../assets/components/Home/FeatureProducts";
import Footer from "../assets/components/Home/Footer";
import Header from "../assets/components/Home/Header";
import MacbookSale from "../assets/components/Home/MacbookSale";
import NewsLetter from "../assets/components/Home/NewsLetter";
import SiteHighlights from "../assets/components/Home/SiteHighlights";
import Swiper from "../assets/components/Home/Swiper";

export default function Home() {
  return (
    <>
      <main>
        <Header />
        <Swiper />
        <SiteHighlights/>
        <BestDeals/>
        <CategorySection/>
        <FeatureProducts/>
        <MacbookSale/>
        <NewsLetter/>
        <Footer/>
      </main>
    </>
  );
}
