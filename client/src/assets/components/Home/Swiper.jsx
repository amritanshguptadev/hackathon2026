import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="pt-5  pb-5 relative">
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 3000 }}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
        className="overflow-hidden"
      >
        <SwiperSlide>
          <Link to="/upcoming">
            <img
              src="/SwiperImages/Laptop.png"
              alt="Promo 1"
              className="w-full max-h-[200px] lg:max-h-[450px] object-cover cursor-pointer transition hover:scale-[1.01] duration-200"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="/upcoming">
            <img
              src="/SwiperImages/Furniture.png"
              alt="Promo 2"
              className="w-full max-h-[200px] lg:max-h-[450px] object-cover cursor-pointer transition hover:scale-[1.01] duration-200"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="/upcoming">
            <img
              src="/SwiperImages/Book.png"
              alt="Promo 3"
              className="w-full max-h-[200px] lg:max-h-[450px] object-cover cursor-pointer transition hover:scale-[1.01] duration-200"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="/upcoming">
            <img
              src="/SwiperImages/Kitchen.png"
              alt="Promo 4"
              className="w-full max-h-[200px] lg:max-h-[450px] object-cover cursor-pointer transition hover:scale-[1.01] duration-200"
            />
          </Link>
        </SwiperSlide>
      </Swiper>
      <button
        ref={prevRef}
        className="absolute top-1/2 left-3 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 right-3 -translate-y-1/2 z-10 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
