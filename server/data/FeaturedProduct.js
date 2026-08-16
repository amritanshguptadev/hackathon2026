const featuredProduct = [
  {
    id: 1,
    title: "HP ProBook 15.6\" Student Laptop (Core i5 / 8GB / 256GB SSD)",
    description: "HP ProBook 15.6-inch laptop with Intel Core i5 processor, 8GB RAM, and 256GB SSD. Perfect for coding, college assignments, and web development.",
    price: 13999,
    image: "/images/products/1.jpg",
    images: ["/images/products/1.jpg"],
    category: "Electronics",
    condition: "Good",
    location: "Library Area",
    campusLocation: "Central Library Entrance",
    status: "Available",
    details: [
      "Intel Core i5 (7th Gen) @ 2.60 GHz with Turbo Boost",
      "8GB DDR4 RAM + 256GB High-Speed SSD",
      "15.6-inch Anti-Glare HD Display with full numeric keypad",
      "Battery backup: ~3.5 hours on normal usage, original HP charger included",
      "Pre-installed with clean Windows 11 & essential developer tools (VS Code, Git)"
    ],
    dimensions: "37.5 x 25.6 x 2.0 cm",
    seller: {
      name: "Arjun Verma",
      email: "arjun.cse@buykaro.in",
      college: "IIT Delhi",
      city: "New Delhi",
      joinedAt: "2024-03-10T10:00:00Z"
    }
  },
  {
    id: 2,
    title: "Hero Sprint 21-Speed Mountain Bike (Carrier & Lock)",
    description: "Sturdy blue campus mountain bike equipped with 21-speed Shimano gears, comfortable dual-cushion seat, and strong rear luggage carrier.",
    price: 2499,
    image: "/images/products/2.jpg",
    images: ["/images/products/2.jpg"],
    category: "Cycles & Bikes",
    condition: "Good",
    location: "Main Gate",
    campusLocation: "Campus Main Gate",
    status: "Available",
    details: [
      "26T High-tensile steel frame with ergonomic handlebars",
      "21-Speed Shimano Tourney thumb shifters for easy campus inclines",
      "Heavy-duty rear luggage rack for carrying college backpack or books",
      "Recently serviced with brand new brake pads and lubricated chain",
      "Includes heavy-duty cycle lock & campus parking stand"
    ],
    dimensions: "170 x 60 x 100 cm",
    seller: {
      name: "Tanmay Deshmukh",
      email: "tanmay.mech@buykaro.in",
      college: "BITS Pilani",
      city: "Pilani",
      joinedAt: "2024-05-15T10:00:00Z"
    }
  },
  {
    id: 3,
    title: "Studio Monitoring Over-Ear DJ Headphones",
    description: "Closed-back DJ & studio monitoring headphones with thick noise-isolating ear cushions and heavy-duty coiled 3.5mm audio cable.",
    price: 899,
    image: "/images/products/3.jpg",
    images: ["/images/products/3.jpg"],
    category: "Electronics",
    condition: "Like New",
    location: "North Hostel",
    campusLocation: "North Hostel Reception",
    status: "Available",
    details: [
      "40mm Neodymium dynamic drivers delivering balanced acoustic profile",
      "Passive noise isolation ear cups for library concentration",
      "Durable coiled spring cable with 3.5mm gold-plated jack (plus 6.35mm adapter)",
      "Foldable swivel ear-cups for compact backpack storage"
    ],
    dimensions: "19 x 17 x 8.5 cm",
    seller: {
      name: "Kavya Nair",
      email: "kavya.media@buykaro.in",
      college: "Christ University",
      city: "Bengaluru",
      joinedAt: "2024-07-20T10:00:00Z"
    }
  },
  {
    id: 4,
    title: "Humanities & Social Sciences Core Textbook Stack",
    description: "Essential undergraduate semester bundle including Econometrics, Sociology, Molecular Biology of the Cell, and American Governance.",
    price: 599,
    image: "/images/products/4.jpg",
    images: ["/images/products/4.jpg"],
    category: "Books & Notes",
    condition: "Good",
    location: "Library Area",
    campusLocation: "Arts & Humanities Block",
    status: "Available",
    details: [
      "Using Econometrics by Studenmund (Pearson 6th Edition)",
      "Macionis Sociology Comprehensive Global Edition",
      "Molecular Biology of the Cell (Alberts & Watson Edition)",
      "Clean pages with neatly highlighted exam summary sticky notes included"
    ],
    dimensions: "28 x 22 x 15 cm",
    seller: {
      name: "Meera Sen",
      email: "meera.eco@buykaro.in",
      college: "Delhi University",
      city: "Delhi",
      joinedAt: "2024-01-12T10:00:00Z"
    }
  },
  {
    id: 5,
    title: "Dell Inspiron 14\" Portable Student Laptop (Core i3 / 8GB RAM)",
    description: "Compact and lightweight 14-inch Dell Inspiron laptop. Excellent for daily lectures, online quizzes, coding, and YouTube research.",
    price: 11999,
    image: "/images/products/5.jpg",
    images: ["/images/products/5.jpg"],
    category: "Electronics",
    condition: "Good",
    location: "West Campus",
    campusLocation: "Engineering Academic Block",
    status: "Available",
    details: [
      "Intel Core i3 6th Gen Processor with Intel HD Graphics",
      "8GB DDR3L RAM & 500GB Storage",
      "14-inch HD WLED display with crisp integrated 720p HD webcam",
      "Compact footprint fits easily into standard college backpacks",
      "Original Dell 45W AC adapter included"
    ],
    dimensions: "34.5 x 24.0 x 2.1 cm",
    seller: {
      name: "Sameer Joshi",
      email: "sameer.civil@buykaro.in",
      college: "MIT Pune",
      city: "Pune",
      joinedAt: "2023-11-05T10:00:00Z"
    }
  },
  {
    id: 6,
    title: "Budget 4G Android Smartphones Combo Choice",
    description: "Reliable secondary 4G Android smartphones (Redmi 9 / Infinix / Samsung Galaxy). Ideal as a testing device for app development or backup phone.",
    price: 3999,
    image: "/images/products/6.jpg",
    images: ["/images/products/6.jpg"],
    category: "Electronics",
    condition: "Fair",
    location: "Block C",
    campusLocation: "Student Center SAC",
    status: "Available",
    details: [
      "Tested and 100% working display, camera, Wi-Fi hotspot, and calling",
      "Dual SIM 4G VoLTE support with dedicated MicroSD slot",
      "Long-lasting 5000mAh battery for all-day hotspot sharing",
      "Factory reset and ready for immediate login"
    ],
    dimensions: "16.4 x 7.6 x 0.9 cm",
    seller: {
      name: "Rahul Saxena",
      email: "rahul.ece@buykaro.in",
      college: "DTU Delhi",
      city: "Delhi",
      joinedAt: "2024-02-18T10:00:00Z"
    }
  },
  {
    id: 7,
    title: "Apple iPad 9.7\" Retina Display Tablet (32GB Space Gray)",
    description: "Apple iPad with 9.7-inch crisp Retina display. Incredible tool for PDF textbook annotation, GoodNotes study notes, and lecture video streaming.",
    price: 10999,
    image: "/images/products/7.jpg",
    images: ["/images/products/7.jpg"],
    category: "Electronics",
    condition: "Like New",
    location: "East Block",
    campusLocation: "Hostel Block D Gate",
    status: "Available",
    details: [
      "9.7-inch Retina Display (2048 x 1536 resolution, 264 ppi)",
      "32GB Storage with fast Apple A-Series chip",
      "Touch ID fingerprint scanner for secure logins",
      "Battery health at 88% — lasts up to 9 hours on single charge",
      "Includes protective magnetic flip case and Lightning charging cable"
    ],
    dimensions: "24.0 x 16.9 x 0.75 cm",
    seller: {
      name: "Aayush Agarwal",
      email: "aayush.cse@buykaro.in",
      college: "VIT Vellore",
      city: "Vellore",
      joinedAt: "2024-04-22T10:00:00Z"
    }
  },
  {
    id: 8,
    title: "STEM Engineering & Science Textbook Bundle (Calculus & Chemistry)",
    description: "First-year and second-year STEM bundle: Calculus and Its Applications, Atoms-Focused General Chemistry, and Olin's Construction Principles.",
    price: 450,
    image: "/images/products/8.jpg",
    images: ["/images/products/8.jpg"],
    category: "Books & Notes",
    condition: "Good",
    location: "Library Area",
    campusLocation: "Science Dept Lawn",
    status: "Available",
    details: [
      "Calculus & Its Applications (11th Edition, Bittinger & Ellenbogen)",
      "Chemistry: An Atoms-Focused Approach (Gilbert, Kirss, Foster)",
      "Olin's Construction Principles and Materials (9th Edition)",
      "Binding is intact with zero missing pages"
    ],
    dimensions: "26 x 20 x 12 cm",
    seller: {
      name: "Sneha Mukherjee",
      email: "sneha.sci@buykaro.in",
      college: "Jadavpur University",
      city: "Kolkata",
      joinedAt: "2024-06-11T10:00:00Z"
    }
  },
  {
    id: 9,
    title: "HP 15s Slim Core i5 15.6\" FHD Laptop (8GB / Fast NVMe SSD)",
    description: "Sleek HP 15s notebook in jet black. Fast NVMe SSD, 8GB DDR4 RAM, full-size keyboard with numeric keypad. Perfect for computer science projects.",
    price: 17500,
    image: "/images/products/9.jpg",
    images: ["/images/products/9.jpg"],
    category: "Electronics",
    condition: "Like New",
    location: "North Hostel",
    campusLocation: "Boys Hostel Block B",
    status: "Available",
    details: [
      "Intel Core i5 8th Gen Quad-Core Processor",
      "8GB DDR4 RAM (expandable to 16GB) + 256GB M.2 NVMe SSD",
      "15.6-inch Full HD (1920x1080) Micro-edge display",
      "Dual speakers with HP Audio Boost, fast Wi-Fi 5 & Bluetooth 5",
      "Battery lasts 4+ hours, original 65W fast charger included"
    ],
    dimensions: "35.8 x 24.2 x 1.79 cm",
    seller: {
      name: "Aditya Khurana",
      email: "aditya.se@buykaro.in",
      college: "SRM Chennai",
      city: "Chennai",
      joinedAt: "2024-01-30T10:00:00Z"
    }
  },
  {
    id: 10,
    title: "Toshiba / WD Canvio 1TB Portable External HDD (USB 3.0)",
    description: "Super-slim 1TB portable external hard drive with high-speed USB 3.0 interface and cable. Great for storing course recordings, datasets, and VMs.",
    price: 1699,
    image: "/images/products/10.jpg",
    images: ["/images/products/10.jpg"],
    category: "Electronics",
    condition: "Like New",
    location: "West Campus",
    campusLocation: "Central Library Steps",
    status: "Available",
    details: [
      "1TB (1000GB) formatted NTFS storage capacity",
      "USB 3.0 transfer speeds up to 130 MB/s (backward compatible with USB 2.0)",
      "Matte shock-resistant slim casing fits in pocket",
      "100% Health verified via CrystalDiskInfo (zero bad sectors)"
    ],
    dimensions: "10.9 x 7.8 x 1.4 cm",
    seller: {
      name: "Varun Nair",
      email: "varun.it@buykaro.in",
      college: "Manipal University",
      city: "Manipal",
      joinedAt: "2024-03-25T10:00:00Z"
    }
  },
  {
    id: 11,
    title: "3-Pack High-Speed USB 3.0 Flash Drives (SanDisk & Kingston)",
    description: "Trio pack of tested high-speed USB pen drives (SanDisk & Kingston). Essential for campus lab submissions, OS installations, and printing.",
    price: 320,
    image: "/images/products/11.jpg",
    images: ["/images/products/11.jpg"],
    category: "Electronics",
    condition: "Good",
    location: "Library Area",
    campusLocation: "College Xerox Center",
    status: "Available",
    details: [
      "Pack of 3 flash drives (Total ~128GB combined storage)",
      "Plug and play across Windows, Mac, Linux, and college lab PCs",
      "Keyring loop hole for attaching to college ID lanyard or room keys"
    ],
    dimensions: "6.0 x 1.8 x 0.8 cm",
    seller: {
      name: "Devika Pillai",
      email: "devika.ee@buykaro.in",
      college: "NIT Trichy",
      city: "Tiruchirappalli",
      joinedAt: "2024-08-01T10:00:00Z"
    }
  },
  {
    id: 12,
    title: "4-Socket Heavy-Duty Power Strip Extension Board (3m Cord)",
    description: "Must-have hostel room extension cord with 4 universal 3-pin sockets and thick 3-meter heavy-gauge cable.",
    price: 250,
    image: "/images/products/12.jpg",
    images: ["/images/products/12.jpg"],
    category: "Hostel Essentials",
    condition: "Good",
    location: "North Hostel",
    campusLocation: "Hostel 4 Ground Floor",
    status: "Available",
    details: [
      "4 Universal AC sockets with safety shutter protection",
      "3 Meter heavy-duty insulated copper power cord",
      "Built-in master on/off switch with LED indicator",
      "Wall mountable hanging slots on the back"
    ],
    dimensions: "28 x 6.5 x 3.5 cm",
    seller: {
      name: "Rajat Chauhan",
      email: "rajat.hostel@buykaro.in",
      college: "IIT Roorkee",
      city: "Roorkee",
      joinedAt: "2023-10-15T10:00:00Z"
    }
  },
  {
    id: 13,
    title: "Seagate Backup Plus Slim 1TB External Hard Drive",
    description: "Brushed metal finish Seagate Backup Plus 1TB portable hard drive. High read/write speed for quick project backups and heavy media files.",
    price: 1550,
    image: "/images/products/13.jpg",
    images: ["/images/products/13.jpg"],
    category: "Electronics",
    condition: "Good",
    location: "East Block",
    campusLocation: "Architecture Studio",
    status: "Available",
    details: [
      "1TB Storage with USB 3.0 high-speed data bus",
      "Premium brushed black aluminum protective top cover",
      "Tested 100% functional with zero drive errors",
      "Comes with original reinforced micro-B to USB-A data cable"
    ],
    dimensions: "11.3 x 7.6 x 1.2 cm",
    seller: {
      name: "Pooja Hegde",
      email: "pooja.design@buykaro.in",
      college: "CEPT Ahmedabad",
      city: "Ahmedabad",
      joinedAt: "2024-02-14T10:00:00Z"
    }
  },
  {
    id: 14,
    title: "4-Piece High-Durability USB Pen Drive Assortment",
    description: "Assorted 4-piece pen drive collection including metal swivel drive, slider drive, and rugged rubberized thumb drive.",
    price: 399,
    image: "/images/products/14.jpg",
    images: ["/images/products/14.jpg"],
    category: "Electronics",
    condition: "Good",
    location: "Main Gate",
    campusLocation: "Main Gate Cafe",
    status: "Available",
    details: [
      "4 Functional USB thumb drives formatted and wiped clean",
      "Capless slider and 360-degree metal swivel designs prevent lost caps",
      "Ideal for bootable Linux drives, assignments, and campus xerox runs"
    ],
    dimensions: "6.5 x 2.0 x 1.0 cm",
    seller: {
      name: "Nitin Singhania",
      email: "nitin.phys@buykaro.in",
      college: "BHU Varanasi",
      city: "Varanasi",
      joinedAt: "2023-09-08T10:00:00Z"
    }
  },
  {
    id: 15,
    title: "6-Outlet Surge Protector Spike Guard with Master Switch",
    description: "Long 6-socket surge suppressor power strip with overload protection fuse. Powers laptop, monitor, phone charger, and table lamp simultaneously.",
    price: 299,
    image: "/images/products/15.jpg",
    images: ["/images/products/15.jpg"],
    category: "Hostel Essentials",
    condition: "Good",
    location: "Block C",
    campusLocation: "Hostel 7 Common Room",
    status: "Available",
    details: [
      "6 Indian/Universal sockets with surge protection varistor",
      "Overload reset switch prevents room fuse trips during power spikes",
      "Thick 2-meter fire-retardant power cord"
    ],
    dimensions: "36 x 6.5 x 3.8 cm",
    seller: {
      name: "Vikram Batra",
      email: "vikram.thapar@buykaro.in",
      college: "Thapar University",
      city: "Patiala",
      joinedAt: "2024-04-05T10:00:00Z"
    }
  },
  {
    id: 16,
    title: "Epson / NEC LCD Multimedia Classroom & Movie Projector",
    description: "High-brightness 3LCD multimedia projector with HDMI and VGA ports. Perfect for student club presentations, hackathons, and dorm movie nights.",
    price: 5999,
    image: "/images/products/16.jpg",
    images: ["/images/products/16.jpg"],
    category: "Electronics",
    condition: "Good",
    location: "West Campus",
    campusLocation: "SAC Auditorium Entrance",
    status: "Available",
    details: [
      "3000 ANSI Lumens brightness delivers clear visuals even with room lights on",
      "HDMI, VGA, USB, and Audio In/Out connectivity",
      "Adjustable focus and keystone correction wheel with lens cap",
      "Includes power cable and 2-meter gold-plated HDMI cable"
    ],
    dimensions: "30.2 x 23.4 x 8.7 cm",
    seller: {
      name: "Campus Tech Club",
      email: "techclub.iitb@buykaro.in",
      college: "IIT Bombay",
      city: "Mumbai",
      joinedAt: "2023-08-15T10:00:00Z"
    }
  },
  {
    id: 17,
    title: "Symphony Personal Room Air Cooler with Caster Wheels",
    description: "Personal evaporative desert air cooler on 4 smooth caster wheels. Essential for surviving hot campus summers in hostel rooms.",
    price: 1750,
    image: "/images/products/17.jpg",
    images: ["/images/products/17.jpg"],
    category: "Appliances",
    condition: "Good",
    location: "North Hostel",
    campusLocation: "Hostel Block B Parking",
    status: "Available",
    details: [
      "25L Water tank capacity with clear water level indicator",
      "Honeycomb cooling pads and high-velocity blower with motorized louvers",
      "Low power consumption (only 120W) — runs smoothly on hostel inverters",
      "4 Multi-directional caster wheels for effortless relocation"
    ],
    dimensions: "45 x 30 x 78 cm",
    seller: {
      name: "Kunal Bansal",
      email: "kunal.mnit@buykaro.in",
      college: "MNIT Jaipur",
      city: "Jaipur",
      joinedAt: "2024-03-01T10:00:00Z"
    }
  },
  {
    id: 18,
    title: "Compact Mini Dorm Refrigerator with Freezer (White)",
    description: "Double-door compact student refrigerator with dedicated top freezer compartment. Keeps milk, fruits, cold beverages, and snacks fresh.",
    price: 3650,
    image: "/images/products/18.jpg",
    images: ["/images/products/18.jpg"],
    category: "Appliances",
    condition: "Good",
    location: "Block C",
    campusLocation: "Hostel 3 Main Lobby",
    status: "Available",
    details: [
      "Compact dimensions fit perfectly beside hostel study desks",
      "Dedicated top freezer section for ice cubes and frozen treats",
      "Adjustable wire shelf and in-door can/bottle storage racks",
      "Energy efficient compressor with ultra-quiet 38dB operation"
    ],
    dimensions: "48 x 45 x 85 cm",
    seller: {
      name: "Aniket & Roommates",
      email: "aniket.bits@buykaro.in",
      college: "BITS Goa",
      city: "Goa",
      joinedAt: "2023-12-10T10:00:00Z"
    }
  },
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
      email: "ravi.chennai@buykaro.in",
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
      email: "ananya.coolgadgets@buykaro.in",
      joinedAt: "2024-02-14T15:00:00Z",
      city: "Delhi",
      college: "Lady Shri Ram College",
    },
  }
];

export default featuredProduct;
