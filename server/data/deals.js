const deals = [
  {
    id: 1,
    title: "HP Pavilion Laptop",
    description: "Refurbished HP Pavilion, 8GB RAM, 512GB SSD, ideal for coding.",
    price: 28999,
    image: "https://images.unsplash.com/photo-1663354027456-ce6a7e07d212?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      "8GB DDR4 RAM allows seamless multitasking across multiple apps or tabs.",
      "512GB SSD ensures fast boot times and swift data transfers, ideal for developers.",
      "Intel i5 10th Gen processor delivers reliable performance for both productivity and entertainment.",
      "14-inch Full HD display with anti-glare coating, perfect for extended study sessions.",
      "Battery lasts up to 6 hours on moderate usage, with fast-charging capability.",
      "Laptop body has been cleaned, tested, and comes with a 3-month seller warranty."
    ],
    dimensions: "32 x 22 x 2 cm",
    seller: {
      name: "Ankit Sharma",
      email: "ankit.hp@gmail.com",
      joinedAt: "2023-07-15T12:00:00Z",
      city: "Delhi",
      college: "Delhi University"
    }
  },
  {
    id: 2,
    title: "Dell Inspiron Laptop",
    description: "Used Dell Inspiron, 16GB RAM, 1TB HDD, great condition.",
    price: 25999,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      "16GB RAM enables smooth performance for development tools, virtual machines, and large datasets.",
      "1TB HDD offers plenty of storage for files, games, and software installs.",
      "15.6-inch HD LED-backlit display offers decent color accuracy and viewing angles.",
      "Pre-installed with licensed Windows 10 Home edition with latest updates applied.",
      "Comes with original Dell power adapter and well-maintained keyboard and trackpad.",
      "Perfect for students handling heavy academic workloads and media storage needs."
    ],
    dimensions: "36 x 25 x 2.2 cm",
    seller: {
      name: "Priya Verma",
      email: "priya.dell@gmail.com",
      joinedAt: "2023-08-01T10:00:00Z",
      city: "Mumbai",
      college: "Mumbai University"
    }
  },
  {
    id: 3,
    title: "Wooden Study Table",
    description: "Refurbished wooden study table with drawer.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      "Made from durable engineered wood with a smooth finish for a premium look.",
      "Spacious tabletop accommodates laptops, books, and study materials comfortably.",
      "Includes a lockable drawer to securely store valuables or stationery.",
      "Scratch-resistant laminate surface designed for everyday use by students.",
      "Legroom clearance allows for ergonomic seating even in compact rooms.",
      "Ideal for hostels, PGs, or studio apartments."
    ],
    dimensions: "90 x 50 x 75 cm",
    seller: {
      name: "Rahul Kumar",
      email: "rahul.table@gmail.com",
      joinedAt: "2023-10-20T09:30:00Z",
      city: "Patna",
      college: "NIT Patna"
    }
  },
  {
    id: 4,
    title: "Ergonomic Chair",
    description: "Comfortable mesh back chair for long study hours.",
    price: 1299,
    image: "https://thot-media.thehouseofthings.com/media/catalog/product/cache/1148ab7f72254d0ec9e2adc78dc49797/c/o/cordoba-leather-chair-1800x1200.jpg",
    details: [
      "Adjustable height and tilt mechanism to suit different desk heights and sitting preferences.",
      "Breathable mesh backrest improves air circulation and prevents heat build-up.",
      "High-density foam cushion seat provides comfort during long study sessions.",
      "Sturdy base with 360-degree swivel and noiseless rolling wheels for smooth mobility.",
      "Supports up to 110kg weight, ideal for everyday use by students or professionals.",
      "Delivered fully assembled or with quick-assembly instructions."
    ],
    dimensions: "60 x 60 x 100 cm",
    seller: {
      name: "Simran Batra",
      email: "simran.chair@gmail.com",
      joinedAt: "2023-06-12T14:45:00Z",
      city: "Bangalore",
      college: "Christ University"
    }
  },
  {
    id: 5,
    title: "Single Bed with Storage",
    description: "Used single bed, pine wood, with storage drawer.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1424847262089-18a6858bd7e2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      "Solid pine wood frame provides excellent strength and long-term durability.",
      "Single pull-out drawer spans full width for storing clothes, books, or shoes.",
      "Sleek polished finish complements modern student rooms or studio apartments.",
      "Accommodates standard 3x6 ft mattress (included) with supportive slats underneath.",
      "Low-profile headboard makes it suitable for low-ceiling rooms or attic spaces.",
      "Easy to clean surface and minor signs of wear from previous usage."
    ],
    dimensions: "200 x 90 x 45 cm",
    seller: {
      name: "Karan Mehta",
      email: "karan.bed@gmail.com",
      joinedAt: "2023-09-05T11:00:00Z",
      city: "Ahmedabad",
      college: "IIT Gandhinagar"
    }
  },
  {
    id: 6,
    title: "Electric Kettle",
    description: "1.5L capacity, perfect for hostel chai sessions.",
    price: 599,
    image: "https://images.unsplash.com/photo-1594213114663-d94db9b17125?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      "1.5-liter stainless steel kettle perfect for tea, coffee, or Maggi prep.",
      "Automatic shut-off prevents overboiling and ensures safe operation.",
      "Fast boiling technology heats water in under 5 minutes.",
      "Cordless 360-degree base design for easy pouring and mobility.",
      "Cool-touch handle with flip-lid system for convenient one-hand use.",
      "Compact size fits well on hostel desks or kitchen shelves."
    ],
    dimensions: "22 x 16 x 20 cm",
    seller: {
      name: "Anjali Roy",
      email: "anjali.kettle@gmail.com",
      joinedAt: "2023-11-18T08:20:00Z",
      city: "Chandigarh",
      college: "Punjab University"
    }
  },
  {
    id: 7,
    title: "Microwave Oven",
    description: "Samsung 20L Solo Microwave Oven in good condition.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    details: [
      "20-liter solo microwave ideal for reheating, defrosting, and simple cooking.",
      "Multiple power levels let you customize heat intensity based on food type.",
      "Mechanical rotary dials for reliable and user-friendly operation.",
      "Comes with a durable glass turntable and internal light.",
      "Outer body cleaned and tested for power, heating, and safety.",
      "Great value for students managing their own food prep in hostels or flats."
    ],
    dimensions: "45 x 30 x 26 cm",
    seller: {
      name: "Mohit Raj",
      email: "mohit.microwave@gmail.com",
      joinedAt: "2023-08-22T07:10:00Z",
      city: "Kolkata",
      college: "Jadavpur University"
    }
  },
  {
    id: 10,
    title: "Mi LED Desk Lamp",
    description: "Minimalist LED lamp, 3 brightness modes.",
    price: 799,
    image: "https://m.media-amazon.com/images/I/31AU6yvEYXL.jpg",
    details: [
      "Three customizable brightness modes to suit late-night studying or ambient lighting.",
      "Slim, space-saving design with flexible hinge for precise light direction.",
      "Touch-sensitive controls for smooth brightness adjustment and quick ON/OFF.",
      "Long-lasting LED bulbs reduce eye strain and save power.",
      "USB-powered, compatible with power banks and laptop ports.",
      "Built from lightweight but durable ABS plastic with a matte finish."
    ],
    dimensions: "15 x 12 x 38 cm",
    seller: {
      name: "Rohan Verma",
      email: "rohan.verma21@du.ac.in",
      joinedAt: "2024-09-20T00:00:00Z",
      city: "Delhi",
      college: "Atma Ram Sanatan Dharma College"
    }
  }
];


module.exports = deals;
