/**
 * Central paths for BuyKaro marketplace images.
 * Files live in: client/public/images/
 */
export const IMAGES = {
  logo: "/images/logo.png",

  products: {
    // 18 New Second-Hand Campus Items
    hpProBook: "/images/products/1.jpg",
    mountainCycle: "/images/products/2.jpg",
    studioHeadphones: "/images/products/3.jpg",
    humanitiesBooks: "/images/products/4.jpg",
    dellInspiron: "/images/products/5.jpg",
    smartphonesCombo: "/images/products/6.jpg",
    ipadRetina: "/images/products/7.jpg",
    stemBooks: "/images/products/8.jpg",
    hpSlimLaptop: "/images/products/9.jpg",
    externalHdd1tb: "/images/products/10.jpg",
    usbDrives3pack: "/images/products/11.jpg",
    powerExtension4socket: "/images/products/12.jpg",
    seagateHdd: "/images/products/13.jpg",
    usbDrives4pack: "/images/products/14.jpg",
    surgeProtector6socket: "/images/products/15.jpg",
    multimediaProjector: "/images/products/16.jpg",
    roomAirCooler: "/images/products/17.jpg",
    miniDormFridge: "/images/products/18.jpg",

    // Legacy demo images
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
    _id: "bk-item-1",
    title: "HP ProBook 15.6\" Student Laptop (Core i5 / 8GB / 256GB SSD)",
    description: "HP ProBook 15.6-inch laptop with Intel Core i5 processor, 8GB RAM, and 256GB SSD. Perfect for coding, college assignments, and web development.",
    price: "13,999",
    numericPrice: 13999,
    image: "/images/products/1.jpg",
    category: "Electronics",
    condition: "Good",
    location: "Library Area",
    meta: "Good condition • Library Area",
    status: "Available",
    timeAgo: "1h ago",
    details: [
      "Intel Core i5 (7th Gen) @ 2.60 GHz with Turbo Boost",
      "8GB DDR4 RAM + 256GB High-Speed SSD",
      "15.6-inch Anti-Glare HD Display with full numeric keypad",
      "Battery backup: ~3.5 hours on normal usage, original HP charger included",
      "Pre-installed with clean Windows 11 & essential developer tools (VS Code, Git)"
    ],
    seller: {
      name: "Arjun Verma",
      email: "arjun.cse@buykaro.in",
      college: "IIT Delhi",
      city: "New Delhi",
      joinedAt: "2024-03-10T10:00:00Z"
    }
  },
  {
    _id: "bk-item-2",
    title: "Hero Sprint 21-Speed Mountain Bike (Carrier & Lock)",
    description: "Sturdy blue campus mountain bike equipped with 21-speed Shimano gears, comfortable dual-cushion seat, and strong rear luggage carrier.",
    price: "2,499",
    numericPrice: 2499,
    image: "/images/products/2.jpg",
    category: "Cycles & Bikes",
    condition: "Good",
    location: "Main Gate",
    meta: "Good condition • Main Gate",
    status: "Available",
    timeAgo: "2h ago",
    details: [
      "26T High-tensile steel frame with ergonomic handlebars",
      "21-Speed Shimano Tourney thumb shifters for easy campus inclines",
      "Heavy-duty rear luggage rack for carrying college backpack or books",
      "Recently serviced with brand new brake pads and lubricated chain",
      "Includes heavy-duty cycle lock & campus parking stand"
    ],
    seller: {
      name: "Tanmay Deshmukh",
      email: "tanmay.mech@buykaro.in",
      college: "BITS Pilani",
      city: "Pilani",
      joinedAt: "2024-05-15T10:00:00Z"
    }
  },
  {
    _id: "bk-item-3",
    title: "Studio Monitoring Over-Ear DJ Headphones",
    description: "Closed-back DJ & studio monitoring headphones with thick noise-isolating ear cushions and heavy-duty coiled 3.5mm audio cable.",
    price: "899",
    numericPrice: 899,
    image: "/images/products/3.jpg",
    category: "Electronics",
    condition: "Like New",
    location: "North Hostel",
    meta: "Like New • North Hostel",
    status: "Available",
    timeAgo: "3h ago",
    details: [
      "40mm Neodymium dynamic drivers delivering balanced acoustic profile",
      "Passive noise isolation ear cups for library concentration",
      "Durable coiled spring cable with 3.5mm gold-plated jack (plus 6.35mm adapter)",
      "Foldable swivel ear-cups for compact backpack storage"
    ],
    seller: {
      name: "Kavya Nair",
      email: "kavya.media@buykaro.in",
      college: "Christ University",
      city: "Bengaluru",
      joinedAt: "2024-07-20T10:00:00Z"
    }
  },
  {
    _id: "bk-item-4",
    title: "Humanities & Social Sciences Core Textbook Stack",
    description: "Essential undergraduate semester bundle including Econometrics, Sociology, Molecular Biology of the Cell, and American Governance.",
    price: "599",
    numericPrice: 599,
    image: "/images/products/4.jpg",
    category: "Books & Notes",
    condition: "Good",
    location: "Library Area",
    meta: "Good condition • Library Area",
    status: "Available",
    timeAgo: "4h ago",
    details: [
      "Using Econometrics by Studenmund (Pearson 6th Edition)",
      "Macionis Sociology Comprehensive Global Edition",
      "Molecular Biology of the Cell (Alberts & Watson Edition)",
      "Clean pages with neatly highlighted exam summary sticky notes included"
    ],
    seller: {
      name: "Meera Sen",
      email: "meera.eco@buykaro.in",
      college: "Delhi University",
      city: "Delhi",
      joinedAt: "2024-01-12T10:00:00Z"
    }
  },
  {
    _id: "bk-item-5",
    title: "Dell Inspiron 14\" Portable Student Laptop (Core i3 / 8GB RAM)",
    description: "Compact and lightweight 14-inch Dell Inspiron laptop. Excellent for daily lectures, online quizzes, coding, and YouTube research.",
    price: "11,999",
    numericPrice: 11999,
    image: "/images/products/5.jpg",
    category: "Electronics",
    condition: "Good",
    location: "West Campus",
    meta: "Good condition • West Campus",
    status: "Available",
    timeAgo: "5h ago",
    details: [
      "Intel Core i3 6th Gen Processor with Intel HD Graphics",
      "8GB DDR3L RAM & 500GB Storage",
      "14-inch HD WLED display with crisp integrated 720p HD webcam",
      "Compact footprint fits easily into standard college backpacks",
      "Original Dell 45W AC adapter included"
    ],
    seller: {
      name: "Sameer Joshi",
      email: "sameer.civil@buykaro.in",
      college: "MIT Pune",
      city: "Pune",
      joinedAt: "2023-11-05T10:00:00Z"
    }
  },
  {
    _id: "bk-item-6",
    title: "Budget 4G Android Smartphones Combo Choice",
    description: "Reliable secondary 4G Android smartphones (Redmi 9 / Infinix / Samsung Galaxy). Ideal as a testing device for app development or backup phone.",
    price: "3,999",
    numericPrice: 3999,
    image: "/images/products/6.jpg",
    category: "Electronics",
    condition: "Fair",
    location: "Block C",
    meta: "Fair condition • Block C",
    status: "Available",
    timeAgo: "6h ago",
    details: [
      "Tested and 100% working display, camera, Wi-Fi hotspot, and calling",
      "Dual SIM 4G VoLTE support with dedicated MicroSD slot",
      "Long-lasting 5000mAh battery for all-day hotspot sharing",
      "Factory reset and ready for immediate login"
    ],
    seller: {
      name: "Rahul Saxena",
      email: "rahul.ece@buykaro.in",
      college: "DTU Delhi",
      city: "Delhi",
      joinedAt: "2024-02-18T10:00:00Z"
    }
  },
  {
    _id: "bk-item-7",
    title: "Apple iPad 9.7\" Retina Display Tablet (32GB Space Gray)",
    description: "Apple iPad with 9.7-inch crisp Retina display. Incredible tool for PDF textbook annotation, GoodNotes study notes, and lecture video streaming.",
    price: "10,999",
    numericPrice: 10999,
    image: "/images/products/7.jpg",
    category: "Electronics",
    condition: "Like New",
    location: "East Block",
    meta: "Like New • East Block",
    status: "Available",
    timeAgo: "7h ago",
    details: [
      "9.7-inch Retina Display (2048 x 1536 resolution, 264 ppi)",
      "32GB Storage with fast Apple A-Series chip",
      "Touch ID fingerprint scanner for secure logins",
      "Battery health at 88% — lasts up to 9 hours on single charge",
      "Includes protective magnetic flip case and Lightning charging cable"
    ],
    seller: {
      name: "Aayush Agarwal",
      email: "aayush.cse@buykaro.in",
      college: "VIT Vellore",
      city: "Vellore",
      joinedAt: "2024-04-22T10:00:00Z"
    }
  },
  {
    _id: "bk-item-8",
    title: "STEM Engineering & Science Textbook Bundle (Calculus & Chemistry)",
    description: "First-year and second-year STEM bundle: Calculus and Its Applications, Atoms-Focused General Chemistry, and Olin's Construction Principles.",
    price: "450",
    numericPrice: 450,
    image: "/images/products/8.jpg",
    category: "Books & Notes",
    condition: "Good",
    location: "Library Area",
    meta: "Good condition • Library Area",
    status: "Available",
    timeAgo: "8h ago",
    details: [
      "Calculus & Its Applications (11th Edition, Bittinger & Ellenbogen)",
      "Chemistry: An Atoms-Focused Approach (Gilbert, Kirss, Foster)",
      "Olin's Construction Principles and Materials (9th Edition)",
      "Binding is intact with zero missing pages"
    ],
    seller: {
      name: "Sneha Mukherjee",
      email: "sneha.sci@buykaro.in",
      college: "Jadavpur University",
      city: "Kolkata",
      joinedAt: "2024-06-11T10:00:00Z"
    }
  },
  {
    _id: "bk-item-9",
    title: "HP 15s Slim Core i5 15.6\" FHD Laptop (8GB / Fast NVMe SSD)",
    description: "Sleek HP 15s notebook in jet black. Fast NVMe SSD, 8GB DDR4 RAM, full-size keyboard with numeric keypad. Perfect for computer science projects.",
    price: "17,500",
    numericPrice: 17500,
    image: "/images/products/9.jpg",
    category: "Electronics",
    condition: "Like New",
    location: "North Hostel",
    meta: "Like New • North Hostel",
    status: "Available",
    timeAgo: "9h ago",
    details: [
      "Intel Core i5 8th Gen Quad-Core Processor",
      "8GB DDR4 RAM (expandable to 16GB) + 256GB M.2 NVMe SSD",
      "15.6-inch Full HD (1920x1080) Micro-edge display",
      "Dual speakers with HP Audio Boost, fast Wi-Fi 5 & Bluetooth 5",
      "Battery lasts 4+ hours, original 65W fast charger included"
    ],
    seller: {
      name: "Aditya Khurana",
      email: "aditya.se@buykaro.in",
      college: "SRM Chennai",
      city: "Chennai",
      joinedAt: "2024-01-30T10:00:00Z"
    }
  },
  {
    _id: "bk-item-10",
    title: "Toshiba / WD Canvio 1TB Portable External HDD (USB 3.0)",
    description: "Super-slim 1TB portable external hard drive with high-speed USB 3.0 interface and cable. Great for storing course recordings, datasets, and VMs.",
    price: "1,699",
    numericPrice: 1699,
    image: "/images/products/10.jpg",
    category: "Electronics",
    condition: "Like New",
    location: "West Campus",
    meta: "Like New • West Campus",
    status: "Available",
    timeAgo: "10h ago",
    details: [
      "1TB (1000GB) formatted NTFS storage capacity",
      "USB 3.0 transfer speeds up to 130 MB/s (backward compatible with USB 2.0)",
      "Matte shock-resistant slim casing fits in pocket",
      "100% Health verified via CrystalDiskInfo (zero bad sectors)"
    ],
    seller: {
      name: "Varun Nair",
      email: "varun.it@buykaro.in",
      college: "Manipal University",
      city: "Manipal",
      joinedAt: "2024-03-25T10:00:00Z"
    }
  },
  {
    _id: "bk-item-11",
    title: "3-Pack High-Speed USB 3.0 Flash Drives (SanDisk & Kingston)",
    description: "Trio pack of tested high-speed USB pen drives (SanDisk & Kingston). Essential for campus lab submissions, OS installations, and printing.",
    price: "320",
    numericPrice: 320,
    image: "/images/products/11.jpg",
    category: "Electronics",
    condition: "Good",
    location: "Library Area",
    meta: "Good condition • Library Area",
    status: "Available",
    timeAgo: "11h ago",
    details: [
      "Pack of 3 flash drives (Total ~128GB combined storage)",
      "Plug and play across Windows, Mac, Linux, and college lab PCs",
      "Keyring loop hole for attaching to college ID lanyard or room keys"
    ],
    seller: {
      name: "Devika Pillai",
      email: "devika.ee@buykaro.in",
      college: "NIT Trichy",
      city: "Tiruchirappalli",
      joinedAt: "2024-08-01T10:00:00Z"
    }
  },
  {
    _id: "bk-item-12",
    title: "4-Socket Heavy-Duty Power Strip Extension Board (3m Cord)",
    description: "Must-have hostel room extension cord with 4 universal 3-pin sockets and thick 3-meter heavy-gauge cable.",
    price: "250",
    numericPrice: 250,
    image: "/images/products/12.jpg",
    category: "Hostel Essentials",
    condition: "Good",
    location: "North Hostel",
    meta: "Good condition • North Hostel",
    status: "Available",
    timeAgo: "12h ago",
    details: [
      "4 Universal AC sockets with safety shutter protection",
      "3 Meter heavy-duty insulated copper power cord",
      "Built-in master on/off switch with LED indicator",
      "Wall mountable hanging slots on the back"
    ],
    seller: {
      name: "Rajat Chauhan",
      email: "rajat.hostel@buykaro.in",
      college: "IIT Roorkee",
      city: "Roorkee",
      joinedAt: "2023-10-15T10:00:00Z"
    }
  },
  {
    _id: "bk-item-13",
    title: "Seagate Backup Plus Slim 1TB External Hard Drive",
    description: "Brushed metal finish Seagate Backup Plus 1TB portable hard drive. High read/write speed for quick project backups and heavy media files.",
    price: "1,550",
    numericPrice: 1550,
    image: "/images/products/13.jpg",
    category: "Electronics",
    condition: "Good",
    location: "East Block",
    meta: "Good condition • East Block",
    status: "Available",
    timeAgo: "13h ago",
    details: [
      "1TB Storage with USB 3.0 high-speed data bus",
      "Premium brushed black aluminum protective top cover",
      "Tested 100% functional with zero drive errors",
      "Comes with original reinforced micro-B to USB-A data cable"
    ],
    seller: {
      name: "Pooja Hegde",
      email: "pooja.design@buykaro.in",
      college: "CEPT Ahmedabad",
      city: "Ahmedabad",
      joinedAt: "2024-02-14T10:00:00Z"
    }
  },
  {
    _id: "bk-item-14",
    title: "4-Piece High-Durability USB Pen Drive Assortment",
    description: "Assorted 4-piece pen drive collection including metal swivel drive, slider drive, and rugged rubberized thumb drive.",
    price: "399",
    numericPrice: 399,
    image: "/images/products/14.jpg",
    category: "Electronics",
    condition: "Good",
    location: "Main Gate",
    meta: "Good condition • Main Gate",
    status: "Available",
    timeAgo: "14h ago",
    details: [
      "4 Functional USB thumb drives formatted and wiped clean",
      "Capless slider and 360-degree metal swivel designs prevent lost caps",
      "Ideal for bootable Linux drives, assignments, and campus xerox runs"
    ],
    seller: {
      name: "Nitin Singhania",
      email: "nitin.phys@buykaro.in",
      college: "BHU Varanasi",
      city: "Varanasi",
      joinedAt: "2023-09-08T10:00:00Z"
    }
  },
  {
    _id: "bk-item-15",
    title: "6-Outlet Surge Protector Spike Guard with Master Switch",
    description: "Long 6-socket surge suppressor power strip with overload protection fuse. Powers laptop, monitor, phone charger, and table lamp simultaneously.",
    price: "299",
    numericPrice: 299,
    image: "/images/products/15.jpg",
    category: "Hostel Essentials",
    condition: "Good",
    location: "Block C",
    meta: "Good condition • Block C",
    status: "Available",
    timeAgo: "15h ago",
    details: [
      "6 Indian/Universal sockets with surge protection varistor",
      "Overload reset switch prevents room fuse trips during power spikes",
      "Thick 2-meter fire-retardant power cord"
    ],
    seller: {
      name: "Vikram Batra",
      email: "vikram.thapar@buykaro.in",
      college: "Thapar University",
      city: "Patiala",
      joinedAt: "2024-04-05T10:00:00Z"
    }
  },
  {
    _id: "bk-item-16",
    title: "Epson / NEC LCD Multimedia Classroom & Movie Projector",
    description: "High-brightness 3LCD multimedia projector with HDMI and VGA ports. Perfect for student club presentations, hackathons, and dorm movie nights.",
    price: "5,999",
    numericPrice: 5999,
    image: "/images/products/16.jpg",
    category: "Electronics",
    condition: "Good",
    location: "West Campus",
    meta: "Good condition • West Campus",
    status: "Available",
    timeAgo: "16h ago",
    details: [
      "3000 ANSI Lumens brightness delivers clear visuals even with room lights on",
      "HDMI, VGA, USB, and Audio In/Out connectivity",
      "Adjustable focus and keystone correction wheel with lens cap",
      "Includes power cable and 2-meter gold-plated HDMI cable"
    ],
    seller: {
      name: "Campus Tech Club",
      email: "techclub.iitb@buykaro.in",
      college: "IIT Bombay",
      city: "Mumbai",
      joinedAt: "2023-08-15T10:00:00Z"
    }
  },
  {
    _id: "bk-item-17",
    title: "Symphony Personal Room Air Cooler with Caster Wheels",
    description: "Personal evaporative desert air cooler on 4 smooth caster wheels. Essential for surviving hot campus summers in hostel rooms.",
    price: "1,750",
    numericPrice: 1750,
    image: "/images/products/17.jpg",
    category: "Appliances",
    condition: "Good",
    location: "North Hostel",
    meta: "Good condition • North Hostel",
    status: "Available",
    timeAgo: "17h ago",
    details: [
      "25L Water tank capacity with clear water level indicator",
      "Honeycomb cooling pads and high-velocity blower with motorized louvers",
      "Low power consumption (only 120W) — runs smoothly on hostel inverters",
      "4 Multi-directional caster wheels for effortless relocation"
    ],
    seller: {
      name: "Kunal Bansal",
      email: "kunal.mnit@buykaro.in",
      college: "MNIT Jaipur",
      city: "Jaipur",
      joinedAt: "2024-03-01T10:00:00Z"
    }
  },
  {
    _id: "bk-item-18",
    title: "Compact Mini Dorm Refrigerator with Freezer (White)",
    description: "Double-door compact student refrigerator with dedicated top freezer compartment. Keeps milk, fruits, cold beverages, and snacks fresh.",
    price: "3,650",
    numericPrice: 3650,
    image: "/images/products/18.jpg",
    category: "Appliances",
    condition: "Good",
    location: "Block C",
    meta: "Good condition • Block C",
    status: "Available",
    timeAgo: "18h ago",
    details: [
      "Compact dimensions fit perfectly beside hostel study desks",
      "Dedicated top freezer section for ice cubes and frozen treats",
      "Adjustable wire shelf and in-door can/bottle storage racks",
      "Energy efficient compressor with ultra-quiet 38dB operation"
    ],
    seller: {
      name: "Aniket & Roommates",
      email: "aniket.bits@buykaro.in",
      college: "BITS Goa",
      city: "Goa",
      joinedAt: "2023-12-10T10:00:00Z"
    }
  }
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
