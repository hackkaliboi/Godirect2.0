
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  featured: boolean;
  status: 'For Sale' | 'For Rent' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  images: string[];
  amenities: string[];
  propertyType: 'House' | 'Apartment' | 'Condo' | 'Townhouse';
  yearBuilt: number;
  agentId: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  image: string;
  title: string;
  bio: string;
  ratings: number;
  reviews: number;
  specializations: string[];
  listings: number;
  sales: number;
  experience: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  testimonial: string;
  rating: number;
  location: string;
}

// Mock properties data
export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Luxury Villa with Ocean View",
    description: "This stunning contemporary villa offers breathtaking ocean views and luxurious amenities. Featuring an open floor plan, gourmet kitchen, infinity pool, and extensive outdoor living space. Perfect for those seeking an upscale lifestyle with magnificent sunsets and modern comforts.",
    price: 1250000,
    featured: true,
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3800,
    address: {
      street: "123 Oceanview Drive",
      city: "Malibu",
      state: "CA",
      zipCode: "90265"
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687644-a7e5a079469a?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop"
    ],
    amenities: [
      "Swimming Pool",
      "Home Theater",
      "Smart Home System",
      "Wine Cellar",
      "Outdoor Kitchen",
      "Ocean View"
    ],
    propertyType: "House",
    yearBuilt: 2018,
    agentId: "1",
    createdAt: "2023-08-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Charming Downtown Apartment",
    description: "Located in the heart of downtown, this charming apartment offers modern living in a vibrant setting. Featuring hardwood floors, stainless steel appliances, and a private balcony with city views. Walking distance to restaurants, shops, and entertainment.",
    price: 450000,
    featured: true,
    status: "For Sale",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    address: {
      street: "456 Urban Lane",
      city: "Austin",
      state: "TX",
      zipCode: "78701"
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1800&auto=format&fit=crop"
    ],
    amenities: [
      "Fitness Center",
      "Rooftop Terrace",
      "24/7 Concierge",
      "Pet Friendly",
      "Bike Storage",
      "City Views"
    ],
    propertyType: "Apartment",
    yearBuilt: 2015,
    agentId: "2",
    createdAt: "2023-09-22T14:45:00Z"
  },
  {
    id: "3",
    title: "Spacious Family Home in Quiet Neighborhood",
    description: "This spacious family home is located in a quiet, tree-lined neighborhood. Featuring a large backyard, updated kitchen, hardwood floors, and a finished basement. Close to schools, parks, and shopping centers, making it perfect for families.",
    price: 685000,
    featured: false,
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2850,
    address: {
      street: "789 Maple Street",
      city: "Portland",
      state: "OR",
      zipCode: "97205"
    },
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1800&auto=format&fit=crop"
    ],
    amenities: [
      "Finished Basement",
      "Fireplace",
      "Hardwood Floors",
      "Fenced Yard",
      "Garage",
      "Central Air"
    ],
    propertyType: "House",
    yearBuilt: 2005,
    agentId: "3",
    createdAt: "2023-10-05T09:15:00Z"
  },
  {
    id: "4",
    title: "Waterfront Condo with Marina Views",
    description: "Enjoy luxury waterfront living in this modern condo with stunning marina views. This recently renovated unit features high-end finishes, an open concept layout, and a private balcony overlooking the water. Resort-style amenities and convenient location make this a must-see property.",
    price: 875000,
    featured: true,
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    address: {
      street: "101 Harbor Drive",
      city: "San Diego",
      state: "CA",
      zipCode: "92101"
    },
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577552568192-467a12a7f376?q=80&w=1800&auto=format&fit=crop"
    ],
    amenities: [
      "Waterfront",
      "Pool & Spa",
      "Gym",
      "Security System",
      "Covered Parking",
      "Marina Access"
    ],
    propertyType: "Condo",
    yearBuilt: 2017,
    agentId: "4",
    createdAt: "2023-11-11T16:20:00Z"
  },
  {
    id: "5",
    title: "Historic Brownstone with Modern Updates",
    description: "This beautifully restored brownstone combines historic charm with modern amenities. Original architectural details include crown moldings, hardwood floors, and a grand staircase, while updates include a gourmet kitchen, spa-like bathrooms, and smart home technology.",
    price: 1495000,
    featured: false,
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 3200,
    address: {
      street: "222 Heritage Lane",
      city: "Boston",
      state: "MA",
      zipCode: "02116"
    },
    images: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1800&auto=format&fit=crop"
    ],
    amenities: [
      "Historic Features",
      "Smart Home",
      "Gourmet Kitchen",
      "Rooftop Deck",
      "Wine Cellar",
      "Garden"
    ],
    propertyType: "Townhouse",
    yearBuilt: 1890,
    agentId: "1",
    createdAt: "2023-12-03T11:00:00Z"
  },
  {
    id: "6",
    title: "Mountain View Retreat with Acreage",
    description: "Escape to this tranquil mountain retreat situated on 5 acres of private land. This custom-built home offers spectacular mountain views from every window, vaulted ceilings, a stone fireplace, and extensive outdoor living spaces including a deck and patio for entertaining.",
    price: 925000,
    featured: false,
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2600,
    address: {
      street: "555 Mountain Ridge Road",
      city: "Aspen",
      state: "CO",
      zipCode: "81611"
    },
    images: [
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?q=80&w=1800&auto=format&fit=crop"
    ],
    amenities: [
      "Mountain Views",
      "5 Acres",
      "Stone Fireplace",
      "Vaulted Ceilings",
      "Hiking Trails",
      "Outdoor Living"
    ],
    propertyType: "House",
    yearBuilt: 2010,
    agentId: "2",
    createdAt: "2024-01-07T13:30:00Z"
  }
];

// Mock agents data
export const agents: Agent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "sarah.johnson@homepulse.com",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop",
    title: "Senior Real Estate Agent",
    bio: "With over 15 years of experience in luxury real estate, Sarah specializes in high-end properties and has a keen eye for investment opportunities.",
    ratings: 4.9,
    reviews: 132,
    specializations: ["Luxury Homes", "Waterfront Properties", "Investment Properties"],
    listings: 25,
    sales: 342,
    experience: 15
  },
  {
    id: "2",
    name: "Michael Chen",
    phone: "(555) 234-5678",
    email: "michael.chen@homepulse.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    title: "Real Estate Consultant",
    bio: "Michael brings a strategic approach to every transaction. His background in finance gives clients an edge in negotiations and investment decisions.",
    ratings: 4.8,
    reviews: 97,
    specializations: ["Urban Properties", "First-time Buyers", "Market Analysis"],
    listings: 18,
    sales: 210,
    experience: 8
  },
  {
    id: "3",
    name: "Jessica Martinez",
    phone: "(555) 345-6789",
    email: "jessica.martinez@homepulse.com",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    title: "Residential Specialist",
    bio: "Jessica is passionate about helping families find their perfect home. Her attention to detail and personalized approach has earned her a loyal client base.",
    ratings: 4.9,
    reviews: 158,
    specializations: ["Family Homes", "School Districts", "Relocation Services"],
    listings: 22,
    sales: 275,
    experience: 12
  },
  {
    id: "4",
    name: "David Wilson",
    phone: "(555) 456-7890",
    email: "david.wilson@homepulse.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    title: "Commercial Real Estate Agent",
    bio: "David specializes in commercial properties and development opportunities. His industry knowledge and networking skills make him a valuable asset for business clients.",
    ratings: 4.7,
    reviews: 76,
    specializations: ["Commercial Properties", "Development", "Business Relocation"],
    listings: 15,
    sales: 122,
    experience: 10
  }
];

// Mock testimonials data
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Emily & Robert Taylor",
    image: "https://images.unsplash.com/photo-1537655780520-1e392ead81f2?q=80&w=200&auto=format&fit=crop",
    testimonial: "Sarah went above and beyond to help us find our dream home. Her knowledge of the local market was invaluable, and she made the entire process stress-free.",
    rating: 5,
    location: "Malibu, CA"
  },
  {
    id: "2",
    name: "James Peterson",
    image: "https://images.unsplash.com/photo-1639747280804-dd2d6b3d88ac?q=80&w=200&auto=format&fit=crop",
    testimonial: "As a first-time buyer, I had so many questions. Michael took the time to explain everything and found me a property that perfectly matched my needs and budget.",
    rating: 5,
    location: "Austin, TX"
  },
  {
    id: "3",
    name: "Maria Sanchez",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    testimonial: "Jessica's dedication to finding the perfect family home for us was incredible. She understood exactly what we needed and delivered beyond our expectations.",
    rating: 4,
    location: "Portland, OR"
  }
];

// Market trends data
export const marketTrends = [
  {
    id: "1",
    title: "Home Price Index",
    value: "+5.8%",
    trend: "up",
    description: "Year-over-year increase in home prices"
  },
  {
    id: "2",
    title: "Days on Market",
    value: "18",
    trend: "down",
    description: "Average days on market for listed properties"
  },
  {
    id: "3",
    title: "Inventory Levels",
    value: "+2.3%",
    trend: "up",
    description: "Increase in available properties"
  },
  {
    id: "4",
    title: "Mortgage Rate",
    value: "3.25%",
    trend: "stable",
    description: "Average 30-year fixed-rate mortgage"
  }
];

// Property types
export const propertyTypes = [
  "House", "Apartment", "Condo", "Townhouse", "Land", "Multi-Family", "Commercial", "Industrial"
];

// Amenities
export const amenities = [
  "Swimming Pool", "Garden", "Garage", "Fireplace", "Air Conditioning", "Balcony", 
  "Gym", "Elevator", "Pet Friendly", "Security System", "Waterfront", "Mountain View",
  "Smart Home", "Solar Panels", "Wine Cellar", "Home Theater", "Outdoor Kitchen"
];

// Price ranges
export const priceRanges = [
  { min: 0, max: 300000, label: "Under $300k" },
  { min: 300000, max: 500000, label: "$300k - $500k" },
  { min: 500000, max: 750000, label: "$500k - $750k" },
  { min: 750000, max: 1000000, label: "$750k - $1M" },
  { min: 1000000, max: 1500000, label: "$1M - $1.5M" },
  { min: 1500000, max: 2000000, label: "$1.5M - $2M" },
  { min: 2000000, max: null, label: "Over $2M" }
];

// Helper function to format price
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}k`;
  } else {
    return `$${price}`;
  }
};

export const formatPriceWithCommas = (price: number): string => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
};
