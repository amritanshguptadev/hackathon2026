const featuredProduct = [
  {
    id: 11,
    title: "Wooden Bookshelf",
    description:
      "Compact and stylish wooden bookshelf that holds up to 50 books. Ideal for small rooms, study corners, or cozy reading nooks.",
    price: 999,
    image:
      "https://rukminim2.flixcart.com/image/832/832/l1tmf0w0/book-shelf/1/k/y/28-particle-board-80-34-fc895019-walnut-muvo-6-shelf-deckup-200-original-imagdac7uwthaug8.jpeg?q=70&crop=false",
    details: [
      "Versatile and Stylish: Enhances study corners or living spaces with its elegant walnut finish, adding a touch of warmth and sophistication.",
      "Space-Saving Elegance: Slim vertical build maximizes storage in compact areas, fitting seamlessly next to desks, beds, or corners.",
      "Convenient Handling: Lightweight and easy to assemble with simple tools; ideal for students shifting hostels or apartments.",
      "Multi-Purpose Utility: Can be used to store books, potted plants, photo frames, or study essentials, making it a functional decor piece.",
    ],
    dimensions: "60 x 25 x 120 cm",
    seller: {
      name: "Ravi Malhotra",
      email: "ravi.chennai@gmail.com",
      joinedAt: "2023-08-20T10:12:45Z",
      city: "Chennai",
      college: "SRM University",
    },
  },
  {
    id: 12,
    title: "Mini Fridge - 45L",
    description:
      "Mini fridge with 45L capacity, compact and energy-efficient. Perfect for hostel rooms, office spaces, or small apartments.",
    price: 4699,
    image:
      "https://vsprod.vijaysales.com/media/catalog/product/2/2/224350-image1_1.jpg?optimize=medium&fit=bounds&height=500&width=500",
    details: [
      "Odour-Free Design: Built-in deodorizer and air flow system ensures freshness and prevents foul smells from spreading inside.",
      "Contemporary Luxury: Designed with a sleek matte-finish exterior and soft interior lighting that adds elegance to any small space.",
      "Energy Saver: With a 5-star energy rating, it consumes minimal electricity while offering powerful cooling for your essentials.",
      "Multi-Purpose: Ideal for storing snacks, cold beverages, skincare products, or even leftover meals for late-night study sessions.",
    ],
    dimensions: "45 x 47 x 50 cm",
    seller: {
      name: "Ananya Verma",
      email: "ananya.coolgadgets@studx.com",
      joinedAt: "2024-02-14T15:00:00Z",
      city: "Delhi",
      college: "Lady Shri Ram College",
    },
  },
  {
    id: 13,
    title: "LED Study Lamp",
    description:
      "Basic study lamp featuring an adjustable neck and LED bulb. Provides focused lighting for reading or working at night.",
    price: 349,
    image:
      "https://rukminim2.flixcart.com/image/812/974/xif0q/table-lamp/o/q/4/neonglow-study-lamp-neonglow-study-lamp-24-energy-9-5-original-imahdmkyzpugg7pt.jpeg?q=60&crop=false",
    details: [
      "Focused Illumination: Emits a soft yet bright glow, preventing glare and shadows for an optimal study experience.",
      "Modern Design: The minimalist matte body pairs well with any desk setup, from rustic wood to modern white themes.",
      "Energy Efficient: Fitted with a long-life LED that consumes less power and produces less heat, ideal for prolonged use.",
      "Adjustable Neck: Flexi-neck allows 360° movement so you can direct light precisely where needed for books, screens, or sketchpads.",
    ],
    dimensions: "20 x 12 x 35 cm",
    seller: {
      name: "Nikhil Rao",
      email: "nikhil.electro@studx.com",
      joinedAt: "2022-11-10T08:30:00Z",
      city: "Mumbai",
      college: "IIT Bombay",
    },
  },
  {
    id: 14,
    title: "Foldable Laptop Stand",
    description:
      "Foldable and portable laptop stand with a sturdy aluminum body. Offers ergonomic height for comfortable working posture.",
    price: 599,
    image:
      "https://rukminim2.flixcart.com/image/812/974/xif0q/laptop-stand/f/r/3/200-aluminum-amextron-original-imahdpybgzavtsym.jpeg?q=60&crop=false",
    details: [
      "Ergonomic Comfort: Lifts laptop to eye-level, reducing strain on the neck and back during online classes or coding sessions.",
      "Space-Saving Elegance: The stand folds flat and occupies minimal space, ideal for compact hostel rooms or shared tables.",
      "Anti-Slip Base: Rubber grips keep your laptop in place even while typing aggressively or using external peripherals.",
      "Durable Build: Lightweight yet strong aluminum frame supports devices up to 17 inches with ease.",
    ],
    dimensions: "28 x 22 x 6 cm (folded)",
    seller: {
      name: "Priya Sharma",
      email: "priya.gearhub@studx.com",
      joinedAt: "2024-06-01T09:15:00Z",
      city: "Pune",
      college: "MIT WPU",
    },
  },
  {
    id: 15,
    title: "Steel Clothes Rack",
    description:
      "Durable steel clothes rack with a space-saving foldable design. Ideal for drying or organizing clothes in limited spaces.",
    price: 899,
    image:
      "https://rukminim2.flixcart.com/image/1466/352/xif0q/cloth-dryer-stand/r/d/d/100-g-cds-sumo-mini-grazia-1-tier-original-imah7tnw2syjpd9e.jpeg?q=60",
    details: [
      "Multi-Tier Utility: Dual levels with multiple rods offer ample space for drying shirts, pants, and delicates simultaneously.",
      "Rust-Free Steel: Made from stainless steel tubes with anti-corrosive coating for longer lifespan, even in humid environments.",
      "Odour-Free Drying: Open-frame structure allows better air circulation for faster, fresher drying without mildew smells.",
      "Portable & Foldable: Easily folds flat for storage under the bed or behind doors when not in use.",
    ],
    dimensions: "70 x 55 x 145 cm",
    seller: {
      name: "Amit Jha",
      email: "amit.homeneeds@studx.com",
      joinedAt: "2023-12-18T18:45:00Z",
      city: "Bangalore",
      college: "Christ University",
    },
  },
  {
    id: 16,
    title: "Table Fan - 3 Speed",
    description:
      "Efficient table fan with 3-speed settings and low-noise operation. Great for personal cooling during hot weather days.",
    price: 799,
    image:
      "https://rukminim2.flixcart.com/image/192/240/xif0q/fan/w/6/f/-original-imahfg3wv6ycmska.jpeg?q=60",
    details: [
      "Whisper-Quiet Operation: Powerful airflow with minimal noise, ideal for use in shared spaces or libraries.",
      "Portable Design: Lightweight and easy to move around for localized cooling—perfect for dorm setups.",
      "3 Speed Settings: Adjust between low, medium, and high depending on your comfort and weather conditions.",
      "Energy Saving: Designed for low power consumption, ensuring cost-effective cooling over long hours.",
    ],
    dimensions: "30 x 25 x 45 cm",
    seller: {
      name: "Sonal Mehta",
      email: "sonal.coolcorner@studx.com",
      joinedAt: "2025-01-05T12:00:00Z",
      city: "Hyderabad",
      college: "Osmania University",
    },
  },
  {
    id: 17,
    title: "3L Pressure Cooker",
    description:
      "Basic 3-liter pressure cooker made of stainless steel. Suitable for daily cooking needs with quick and even heating.",
    price: 699,
    image:
      "https://rukminim2.flixcart.com/image/1466/352/xif0q/pressure-cooker/y/8/k/yes-1-18014-kent-original-imah3t8hzzf5hscv.jpeg?q=60",
    details: [
      "Fast Cooking: Uses high pressure to cook dals, rice, curries, and vegetables quickly—perfect for students in a rush.",
      "Contemporary Look: Elegant mirror finish body that suits any kitchen style, from minimal to traditional.",
      "Safe to Use: Pressure-regulating safety valve and heat-resistant handles offer a secure cooking experience.",
      "Multipurpose: Compatible with gas, electric, and induction stoves—versatile for various living conditions.",
    ],
    dimensions: "25 x 25 x 18 cm",
    seller: {
      name: "Rakesh Bhatt",
      email: "rakesh.kitchenware@studx.com",
      joinedAt: "2023-04-22T14:10:00Z",
      city: "Ahmedabad",
      college: "Nirma University",
    },
  },
  {
    id: 18,
    title: "Modern Wall Clock",
    description:
      "Battery-operated wall clock with a sleek and modern design. Perfect for home, office, or any minimalistic space.",
    price: 499,
    image:
      "https://rukminim2.flixcart.com/image/1470/1470/xif0q/wall-clock/t/j/z/ajanta-small-and-fancy-wall-clock-for-home-and-office-22-original-imagycxfpbbdpbyy.jpeg?q=60",
    details: [
      "Contemporary Luxury: Matte black and white contrast adds a stylish accent to study areas, bedrooms, or lounges.",
      "Odour-Free Design: Dust-resistant face cover keeps the dial clean and legible even in humid or dusty areas.",
      "Silent Sweep: Second hand moves silently without the annoying ticking noise, perfect for peaceful concentration.",
      "Multi-Location Use: Suitable for hostels, kitchens, offices, or classrooms for punctuality with elegance.",
    ],
    dimensions: "30 x 30 x 4 cm",
    seller: {
      name: "Shruti Patel",
      email: "shruti.homevibe@studx.com",
      joinedAt: "2022-10-03T07:25:00Z",
      city: "Indore",
      college: "DAVV",
    },
  },
  {
    id: 19,
    title: "Laundry Basket - Woven",
    description:
      "Woven-style laundry basket that enhances room appearance while maintaining hygiene. Ideal for bedrooms or bathrooms.",
    price: 649,
    image: "https://m.media-amazon.com/images/I/71gDgdgh15L._SX679_.jpg",
    details: [
      "Versatile and Stylish: Blends effortlessly with any bedroom or bathroom decor, adding a touch of elegance to your space.",
      "Odour-Free Design: Features a vented body that ensures airflow to prevent moisture buildup and unpleasant smells.",
      "Contemporary Luxury: Crafted with a premium woven texture that mimics natural materials while offering durability and hygiene.",
      "Convenient Handling: Integrated side handles make lifting and transporting the basket easy, even when it's full of clothes.",
    ],

    dimensions: "44 x 35 x 61 cm",
    seller: {
      name: "Karan Desai",
      email: "karan.organizeit@studx.com",
      joinedAt: "2023-09-10T16:45:00Z",
      city: "Surat",
      college: "SVNIT",
    },
  },
  {
    id: 20,
    title: "Noise Cancelling Headphones",
    description: "High-fidelity wireless headphones with ANC",
    price: 2499,
    image:
      "https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/o/h/f/-original-imahdxvsuftg7njp.jpeg?q=70&crop=false",
    details: [
      "Advanced Active Noise Cancellation: Reduces ambient sound by up to 30dB, allowing for immersive music and focused study sessions.",
      "Immersive Sound Output: Equipped with 40mm drivers that deliver punchy bass, crisp mids, and clear treble across all genres.",
      "Long-Lasting Battery & Connectivity: Bluetooth 5.2 ensures fast pairing and up to 20 hours of playback time on a single charge.",
      "Ergonomic Design: Features soft, memory foam ear cushions and an adjustable headband for all-day comfort during prolonged use.",
    ],

    dimensions: "18 x 16 x 9 cm",
    seller: {
      name: "Ananya Mehta",
      email: "ananya.mehta@gmail.com",
      joinedAt: "2023-12-15T00:00:00Z",
      city: "Kolkata",
      college: "Jadavpur University",
    },
  },
  {
    id: 21,
    title: "Ergonomic Study Chair",
    description: "Adjustable and cushioned chair ideal for long study sessions",
    price: 3199,
    image:
      "https://thesleepcompany.in/cdn/shop/files/1_52578784-331e-40b0-8f56-4c767f3cfef1.webp?v=1753711047&width=860",
    details: [
      "Ergonomically designed mesh backrest provides optimal lumbar support, reducing strain during prolonged study or work hours.",
      "Smooth 360° swivel wheels ensure easy movement without damaging flooring, perfect for compact study areas or shared spaces.",
      "Height-adjustable pneumatic seat lets you customize sitting posture for maximum comfort and back alignment.",
      "Soft, breathable cushion with high-density foam enhances comfort and prevents heat build-up during long sitting sessions.",
    ],
    dimensions: "60 x 60 x 100 cm",
    seller: {
      name: "Ravi Sharma",
      email: "ravi.sharma123@gmail.com",
      joinedAt: "2024-04-12T00:00:00Z",
      city: "Delhi",
      college: "Delhi Technological University",
    },
  },
  {
    id: 22,
    title: "Scientific Calculator",
    description:
      "Multi-functional calculator suitable for engineering students",
    price: 899,
    image:
      "https://vlebazaar.in/image/cache/catalog/Casio-FX-82MS-2nd-Gen-Non-Programmable-Scientific-Calculator-240-Functio/Casio-FX-82MS-2nd-Gen-Non-Programmable-Scientific-Calculator-240-Functions-and-2-1100x1100.jpg",
    details: [
      "Offers over 240 advanced mathematical functions including trigonometry, logarithms, statistics, and algebra for engineering-level computations.",
      "Dual power system ensures uninterrupted usage—solar power under bright light and battery backup for dim conditions.",
      "Responsive and clearly labeled plastic keys provide a tactile and durable input experience, even with heavy usage.",
      "Dual-line display allows simultaneous viewing of inputs and results, reducing calculation errors and improving learning.",
    ],
    dimensions: "15 x 8 x 1.8 cm",
    seller: {
      name: "Sneha Kapoor",
      email: "sneha.kapoor@outlook.com",
      joinedAt: "2024-09-05T00:00:00Z",
      city: "Bhopal",
      college: "MANIT Bhopal",
    },
  },
  {
    id: 23,
    title: "Graph Paper Notebook",
    description: "A4 size graph notebook with thick pages",
    price: 179,
    image:
      "https://cdn.zeptonow.com/production/ik-seo/tr:w-640,ar-1200-1200,pr-true,f-auto,q-80/cms/product_variant/414f1c7a-82fd-4d3f-8411-d4e7aee7b45c/Ranka-Supremo-Graph-Book-Ruled-32-Pages-Assorted.jpg",
    details: [
      "High-quality 80 GSM thick paper minimizes ink bleed and feathering, suitable for technical drawing and mathematics.",
      "Innovative hybrid layout combining single-line ruling with graph sheets for versatile academic usage.",
      "Contains 100 neatly printed pages ideal for plotting, data recording, and engineering lab work.",
      "Durable spiral binding and hard cover provide rigidity and portability, making it perfect for daily college use.",
    ],
    dimensions: "29.7 x 21 x 1.5 cm",
    seller: {
      name: "Aman Verma",
      email: "aman.verma1999@gmail.com",
      joinedAt: "2023-11-20T00:00:00Z",
      city: "Pune",
      college: "MIT WPU",
    },
  },
  {
    id: 24,
    title: "External Hard Drive - 1TB",
    description: "Portable HDD with USB 3.0 interface for fast data transfer",
    price: 3799,
    image: "https://m.media-amazon.com/images/I/41eFUZh+nHL.jpg",
    details: [
      "Massive 1TB storage capacity ideal for backing up project files, assignments, and multimedia content for college use.",
      "Equipped with USB 3.0 interface for high-speed data transfers, while supporting older USB 2.0 ports for compatibility.",
      "Rugged, shock-resistant casing protects data from minor bumps and accidental drops during transit.",
      "Plug-and-play functionality—no drivers or software needed; compatible with Windows, macOS, and Linux systems.",
    ],
    dimensions: "11.5 x 8 x 1.5 cm",
    seller: {
      name: "Ritika Das",
      email: "ritika.das@gmail.com",
      joinedAt: "2024-01-10T00:00:00Z",
      city: "Chennai",
      college: "SRM University",
    },
  },
  {
    id: 25,
    title: "Desk Organizer Set",
    description: "5-in-1 set to keep your study desk clutter-free",
    price: 549,
    image: "https://m.media-amazon.com/images/I/41VSiPyZlzL.jpg",
    details: [
      "Includes a multifunctional pen stand, tray for papers or notes, and sticky note holder — ideal for daily study essentials.",
      "Crafted from 100% recycled plastic, making it an eco-friendly and sustainable addition to your workspace.",
      "Lightweight yet highly durable — can withstand daily use without wear and tear.",
      "Features a modern minimalist matte black finish that blends seamlessly with any desk decor.",
    ],

    dimensions: "25 x 18 x 10 cm",
    seller: {
      name: "Harshit Sinha",
      email: "harshit.sinha12@gmail.com",
      joinedAt: "2024-05-06T00:00:00Z",
      city: "Lucknow",
      college: "IET Lucknow",
    },
  },
  {
    id: 26,
    title: "Digital Drawing Tablet",
    description:
      "Perfect for online classes, note-taking, and creative sketches",
    price: 2499,
    image:
      "https://m.media-amazon.com/images/I/51QoBaZBsjL._AC_SX296_SY426_FMwebp_QL65_.jpg",
    details: [
      "8192 levels of pressure sensitivity offer precise strokes and a natural writing/drawing feel — perfect for artists and students.",
      "Battery-free stylus ensures uninterrupted usage without the hassle of charging.",
      "Wide compatibility with major operating systems including Windows, macOS, and Android devices.",
      "Compact working area (6 x 4 inches) ideal for note-taking, digital art, and editing tasks on the go.",
    ],

    dimensions: "20 x 14 x 1 cm",
    seller: {
      name: "Manya Arora",
      email: "manya.arora22@gmail.com",
      joinedAt: "2024-03-18T00:00:00Z",
      city: "Jaipur",
      college: "MNIT Jaipur",
    },
  },
  {
    id: 27,
    title: "Rechargeable Desk Lamp",
    description: "Eye-care LED lamp with adjustable brightness levels",
    price: 699,
    image:
      "https://m.media-amazon.com/images/I/71hRle2Q7tL._AC_SX296_SY426_FMwebp_QL65_.jpg",
    details: [
      "Three adjustable brightness modes (low, medium, high) to suit different lighting needs like reading, writing, or relaxing.",
      "Touch-sensitive control panel for easy operation with just a tap.",
      "360° flexible neck design allows you to adjust the light angle in any direction for optimal focus.",
      "Built-in 2000mAh rechargeable battery with USB charging support — offers up to 10 hours of usage per charge.",
    ],

    dimensions: "35 x 10 x 8 cm",
    seller: {
      name: "Pranav Mishra",
      email: "pranav.mishra@gmail.com",
      joinedAt: "2023-10-28T00:00:00Z",
      city: "Bangalore",
      college: "PES University",
    },
  },
  {
    id: 28,
    title: "Portable Whiteboard",
    description: "Double-sided mini whiteboard for quick notes and study plans",
    price: 449,
    image:
      "https://m.media-amazon.com/images/I/51Hque+SehL._AC_SX296_SY426_FMwebp_QL65_.jpg",
    details: [
      "Dual-sided writing surface with magnetic support for notes or reminders — both erasable and rewritable.",
      "Includes a marker, eraser, and built-in pen holder for convenience and quick use.",
      "Durable aluminum frame and reinforced corners provide extra stability and long-lasting use.",
      "Ideal for hostel rooms, dorm walls, or desk mounting — helps with daily planning and quick study recaps.",
    ],

    dimensions: "30 x 25 x 2 cm",
    seller: {
      name: "Divya Jain",
      email: "divya.jain@studentmail.com",
      joinedAt: "2024-06-09T00:00:00Z",
      city: "Hyderabad",
      college: "IIIT Hyderabad",
    },
  },
  {
    id: 29,
    title: "Fitness Resistance Bands Set",
    description: "Pack of 5 resistance bands for home workouts",
    price: 599,
    image:
      "https://m.media-amazon.com/images/I/81ZbU6VSK8L._AC_SX444_SY639_FMwebp_QL65_.jpg",
    details: [
      "Set includes 5 resistance levels ranging from light to extra heavy, perfect for beginners to advanced users.",
      "Constructed from 100% natural latex, offering flexibility, durability, and a skin-friendly texture.",
      "Slip-resistant surface and tear-resistant design ensure safety during workouts.",
      "Portable carry pouch included for easy storage and travel use — take your workouts anywhere.",
    ],

    dimensions: "25 x 5 x 4 cm",
    seller: {
      name: "Ishaan Ghosh",
      email: "ishaan.ghosh@hotmail.com",
      joinedAt: "2024-02-07T00:00:00Z",
      city: "Kolkata",
      college: "St. Xavier's College",
    },
  },
  {
    id: 30,
    title: "Laptop Cooling Pad",
    description: "Silent cooling pad with 5 fans for overheating laptops",
    price: 1099,
    image:
      "https://m.media-amazon.com/images/I/61Lj90UBLGL._AC_SX444_SY639_FMwebp_QL65_.jpg",
    details: [
      "Equipped with 5 ultra-quiet high-speed fans that reduce laptop heat buildup effectively and silently.",
      "Supports laptops up to 17 inches — compatible with most major laptop brands and models.",
      "Integrated LED display and fan control buttons allow you to monitor and adjust speed settings.",
      "Ergonomically designed with adjustable tilt angles to improve posture and typing comfort.",
    ],

    dimensions: "38 x 28 x 3.5 cm",
    seller: {
      name: "Tanvi Rathi",
      email: "tanvi.rathi@gmail.com",
      joinedAt: "2023-12-02T00:00:00Z",
      city: "Mumbai",
      college: "KJ Somaiya College",
    },
  },
  {
  id: 123456,
  title: "MacBook Pro M2 13-inch",
  description: "Lightly used MacBook Pro M2 with 1TB SSD, 16GB RAM — excellent condition and battery life.",
  price: 114999,
  image: "https://www.aptronixindia.com/media/catalog/product/cache/31f0162e6f7d821d2237f39577122a8a/m/b/mbp14-spacegray-gallery1-202310-removebg-preview.png",
  details: [
    "Apple M2 chip with 8-core CPU and 10-core GPU ensures lightning-fast performance and seamless multitasking.",
    "1TB SSD delivers ultra-fast boot times, rapid file access, and ample storage for creative projects and development environments.",
    "16GB unified memory supports heavy tasks like video editing, Xcode, Docker, and simultaneous app usage without lag.",
    "13.3-inch Retina display with True Tone offers brilliant colors, crisp text, and exceptional brightness for all lighting conditions.",
    "Battery health is above 95%, with up to 18 hours of typical usage per charge — ideal for long coding or design sessions.",
    "Pre-installed with macOS Ventura and essential development tools like VS Code, Xcode, and Homebrew.",
    "Sleek aluminum body with no scratches or dents, backlit Magic Keyboard, and large Force Touch trackpad.",
    "Includes original 67W USB-C power adapter and box packaging."
  ],
  dimensions: "30.41 x 21.24 x 1.56 cm",
  seller: {
    name: "Rohan Mehta",
    email: "rohan.mac@gmail.com",
    joinedAt: "2024-11-15T15:30:00Z",
    city: "Bengaluru",
    college: "RV College of Engineering"
  }
}
];

module.exports = featuredProduct;
