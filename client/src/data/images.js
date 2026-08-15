/**
 * Central paths for BuyKaro marketplace images.
 * Files live in: client/public/images/
 */
export const IMAGES = {
  logo: "/images/logo.png",

  products: {
    macbook: "/images/products/macbook.png",
    textbook: "/images/products/textbook.png",
    deskLamp: "/images/products/desk-lamp.png",
    gamingChair: "/images/products/gaming-chair.png",
    headphones: "/images/products/headphones.png",
    cycle: "/images/products/cycle.png",
    keyboard: "/images/products/keyboard.png",
    sofa: "/images/products/sofa.png",
  },
  categories: {
    cycles: "/images/categories/cycles.png",
    books: "/images/categories/books.png",
    electronics: "/images/categories/electronics.png",
    furniture: "/images/categories/furniture.png",
    appliances: "/images/categories/appliances.png",
    hostel: "/images/categories/hostel.png",
  },
  auth: {
    campus: "/images/auth/campus.png",
  },
  hero: {
    campusLife: "/images/hero/campus-life.png",
  },
};

export const DEMO_LISTINGS = [
  {
    _id: "demo-1",
    title: "MacBook Air M1",
    price: "45,000",
    image: IMAGES.products.macbook,
    meta: "Excellent condition • North Hostel",
    status: "Available",
    timeAgo: "2h ago",
  },
  {
    _id: "demo-2",
    title: "Calculus Textbook",
    price: "450",
    image: IMAGES.products.textbook,
    meta: "Barely used • Library Area",
    status: "Available",
    timeAgo: "5h ago",
  },
  {
    _id: "demo-3",
    title: "Study Desk Lamp",
    price: "800",
    image: IMAGES.products.deskLamp,
    meta: "Like new • West Campus",
    status: "Reserved",
    timeAgo: "1d ago",
  },
  {
    _id: "demo-4",
    title: "Gaming Chair",
    price: "3,500",
    image: IMAGES.products.gamingChair,
    meta: "Good condition • Block C",
    status: "Sold",
    timeAgo: "2d ago",
  },
  {
    _id: "demo-5",
    title: "Wireless Headphones",
    price: "1,200",
    image: IMAGES.products.headphones,
    meta: "Excellent condition • East Block",
    status: "Available",
    timeAgo: "3h ago",
  },
  {
    _id: "demo-6",
    title: "Campus Cycle",
    price: "2,800",
    image: IMAGES.products.cycle,
    meta: "Well maintained • Main Gate",
    status: "Available",
    timeAgo: "6h ago",
  },
];

export const CATEGORY_IMAGES = [
  { name: "Electronics", image: IMAGES.categories.electronics, emoji: "💻" },
  { name: "Books & Notes", image: IMAGES.categories.books, emoji: "📚" },
  { name: "Furniture", image: IMAGES.categories.furniture, emoji: "🪑" },
  { name: "Cycles & Bikes", image: IMAGES.categories.cycles, emoji: "🚲" },
  { name: "Hostel Essentials", image: IMAGES.categories.hostel, emoji: "🏠" },
  { name: "Appliances", image: IMAGES.categories.appliances, emoji: "🔌" },
  { name: "Clothing & Fashion", image: IMAGES.categories.electronics, emoji: "👕" },
  { name: "Sports & Fitness", image: IMAGES.categories.cycles, emoji: "⚽" },
  { name: "Stationery", image: IMAGES.categories.books, emoji: "✏️" },
  { name: "Musical Instruments", image: IMAGES.categories.furniture, emoji: "🎸" },
  { name: "Lab Equipment", image: IMAGES.categories.electronics, emoji: "🔬" },
  { name: "Food & Kitchen", image: IMAGES.categories.appliances, emoji: "🍳" },
];
