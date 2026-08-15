import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 raleway text-white">
      <div className="flex flex-col md:flex-row md:justify-center md:gap-25 px-6 py-10 gap-10">
        <div className="w-full md:w-auto md:text-center md:text-left">
          <Link to="/">
            <h3 className="text-4xl font-bold">STUDx</h3>
          </Link>
          <div className="my-5">
            <p className="text-gray-400">Customer support</p>
            <h2 className="text-white">+91 965080XXXX</h2>
            <p className="text-gray-400 mt-2">Email</p>
            <h2 className="text-white break-words">
              shahnawaz.hussain96508@gmail.com
            </h2>
          </div>
        </div>

        <div className="w-full md:w-auto md:text-center md:text-left">
          <h2 className="text-xl">TOP CATEGORY</h2>
          <ul className="text-gray-400 my-5 space-y-2">
            <li><Link to="">Computer & Laptop</Link></li>
            <li><Link to="">SmartPhone</Link></li>
            <li><Link to="">Headphone</Link></li>
            <li><Link to="" className="text-yellow-400">Home</Link></li>
            <li><Link to="">Kettle</Link></li>
            <li><Link to="">Mini Fridges</Link></li>
            <li>
              <Link
                to="/all-products"
                className="flex items-center justify-center justify-start gap-1 text-yellow-400 hover:underline underline-offset-8 hover:text-yellow-500"
              >
                Browse all products <ArrowRight size={16} />
              </Link>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-auto md:text-center md:text-left">
          <h2 className="text-xl">QUICK LINKS</h2>
          <ul className="text-gray-400 my-5 space-y-2">
            <li><Link to="/upcoming">Shop Product</Link></li>
            <li><Link to="/upcoming">Sell Product</Link></li>
            <li><Link to="/upcoming">Shopping cart</Link></li>
            <li><Link to="/upcoming">Wishlist</Link></li>
            <li><Link to="/upcoming">Compare</Link></li>
            <li><Link to="/upcoming">Customer Help</Link></li>
            <li><Link to="/upcoming">About Us</Link></li>
          </ul>
        </div>

        <div className="w-full md:w-auto md:text-center md:text-left">
          <h2 className="text-xl">DOWNLOAD APP</h2>

          <Link to="https://play.google.com/store/games?hl=en_IN" target="_blank" className="cursor-pointer">
            <div className="flex justify-center md:justify-start gap-3 p-2 rounded-sm bg-gray-700 my-4">
              <img src="/Download/playStore.png" alt="Play store" className="w-10" />
              <div>
                <p className="text-gray-200 text-sm">Get it now</p>
                <h2 className="text-white text-lg">Google Play</h2>
              </div>
            </div>
          </Link>

          <Link to="https://www.apple.com/in/app-store" target="_blank" className="cursor-pointer">
          <div className="flex justify-center md:justify-start gap-3 p-2 rounded-sm bg-gray-700">
            <img src="/Download/apple.png" alt="App store" className="w-10" />
            <div>
              <p className="text-gray-200 text-sm">Get it now</p>
              <h2 className="text-white text-lg">App Store</h2>
            </div>
          </div>
          </Link>

        </div>
      </div>
      <div className="flex justify-center">
            <div className="border-b border-gray-600 w-full md:w-full" />
        </div>
        <div className="text-center py-5 text-sm md:text-base">
          <p className="text-gray-400">
            © 2025&nbsp;|&nbsp;
            Developed by&nbsp;
            <Link
              to="https://portfolio2-0-pi-nine.vercel.app/"
              className="text-yellow-400 hover:underline underline-offset-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shahnawaz Hussain
            </Link>
          </p>
        </div>

    </footer>
  );
}