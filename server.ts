import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Fallback high-quality curated luxury hotels (used if the API fails, is rate-limited, or returns empty)
const FALLBACK_HOTELS = [
  {
    id: 101,
    name: "Grand Horizon Resort & Spa",
    city: "Amalfi Coast",
    country: "Italy",
    rating: 4.9,
    price: 650,
    availability: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    description: "Perched majestically on the cliffs of the Amalfi Coast, Grand Horizon Resort & Spa offers breathtaking panoramic views of the Mediterranean Sea. Indulge in Michelin-starred dining, wind down in our state-of-the-art thermal spa, or relax by the heated infinity pool that blends seamlessly into the blue horizon.",
    amenities: ["Infinity Pool", "Thermal Spa", "Michelin Dining", "Private Beach Access", "Free Wi-Fi", "24/7 Butler Service"]
  },
  {
    id: 102,
    name: "The Gilded Pavilion",
    city: "Kyoto",
    country: "Japan",
    rating: 4.8,
    price: 480,
    availability: true,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    description: "An oasis of serenity in the heart of Kyoto's historic temple district. Surrounded by manicured Zen gardens, The Gilded Pavilion combines traditional Japanese architectural elements with minimalist ultra-luxury design. Experience authentic Kaiseki banquets, private open-air Onsen baths, and matcha tea ceremonies.",
    amenities: ["Private Onsen", "Zen Gardens", "Kaiseki Dining", "Tea Lounge", "Free Wi-Fi", "Airport Shuttle"]
  },
  {
    id: 103,
    name: "Azure Sands Sanctuary",
    city: "Maldives",
    country: "Maldives",
    rating: 5.0,
    price: 850,
    availability: true,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80",
    description: "Unrivaled luxury overwater villas floating atop a crystalline turquoise lagoon. Wake up to the gentle lull of waves and step directly from your private sun deck into the warm ocean. Azure Sands features an underwater fine-dining restaurant, a coral reef marine laboratory, and custom sandbank picnics under the stars.",
    amenities: ["Overwater Villas", "Private Plunge Pool", "Underwater Restaurant", "Snorkeling Reef", "Free Wi-Fi", "Yacht Transfers"]
  },
  {
    id: 104,
    name: "Royal Velvet Suites",
    city: "Paris",
    country: "France",
    rating: 4.7,
    price: 520,
    availability: true,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "Located steps from the iconic Place Vendôme, Royal Velvet Suites exudes classic French opulence. With grand crystal chandeliers, rich velvet draperies, and majestic high ceilings, this historic palace hotel combines historic grandeur with modern conveniences. Enjoy afternoon tea at the Salon and treatments at our Chanel spa.",
    amenities: ["Indoor Pool", "Luxury Spa", "French Bistro", "Fitness Center", "Free Wi-Fi", "Personal Shopper"]
  },
  {
    id: 105,
    name: "Vanguard Residence",
    city: "New York City",
    country: "USA",
    rating: 4.6,
    price: 390,
    availability: true,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    description: "Overlooking the vibrant skyline of Manhattan, Vanguard Residence offers a sleek, loft-style residential stay for the modern cosmopolitan traveler. Featuring floor-to-ceiling windows, customized state-of-the-art tech integrations, a private art collection, and a spectacular heated rooftop lounge that buzzes with energy.",
    amenities: ["Rooftop Lounge", "Sky Gym", "Smart Room Controls", "Concierge Service", "Free Wi-Fi", "Valet Parking"]
  },
  {
    id: 106,
    name: "Saffron Oasis Riad",
    city: "Marrakech",
    country: "Morocco",
    rating: 4.8,
    price: 280,
    availability: true,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    description: "A sanctuary of peace hidden within the bustling ancient Medina. Saffron Oasis centers around a stunning tiled courtyard featuring a cooling pool, orange trees, and fragrant jasmine. Each suite is masterfully decorated by local artisans with tadelakt walls, hand-woven Berber rugs, and traditional bronze lanterns.",
    amenities: ["Courtyard Pool", "Traditional Hammam", "Rooftop Terrace", "Cooking Classes", "Free Wi-Fi", "Local Tours"]
  },
  {
    id: 107,
    name: "The Emerald Canopy Resort",
    city: "Bali",
    country: "Indonesia",
    rating: 4.9,
    price: 340,
    availability: true,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    description: "Nestled in the lush, emerald-green jungle highlands of Ubud, this spectacular resort floats above the sacred Ayung River valley. Savor fresh, organic farm-to-table cuisine, engage in daily sunrise yoga overlooking the tropical rainforest, or revitalize your senses in our open-air bamboo sound-healing sanctuary.",
    amenities: ["Multi-tier Infinity Pool", "Yoga Shala", "Farm-to-Table Restaurant", "Sound Healing", "Free Wi-Fi", "Bike Rentals"]
  },
  {
    id: 108,
    name: "Starlight Alpine Manor",
    city: "Zermatt",
    country: "Switzerland",
    rating: 4.9,
    price: 720,
    availability: true,
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    description: "With unobstructed views of the legendary Matterhorn, Starlight Alpine Manor is the pinnacle of alpine luxury. Combining hand-carved timber accents, modern local-stone fireplaces, and glass walls, this ski-in/ski-out lodge includes a grand indoor-outdoor pool, a whiskey library, and customized heliskiing adventures.",
    amenities: ["Ski-in/Ski-out Access", "Whiskey Library", "Indoor-Outdoor Pool", "Fireplace Lounge", "Free Wi-Fi", "Ski Valet"]
  },
  {
    id: 109,
    name: "Château de L'Amour",
    city: "Provence",
    country: "France",
    rating: 4.7,
    price: 450,
    availability: false,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    description: "An authentic 18th-century French country castle nestled amidst endless blooming lavender fields and olive groves. Revel in timeless estate traditions, stroll down grand gravel paths, and dine under ancient oak trees. Featuring its own artisanal winery, tennis courts, and customized fragrance-making workshops.",
    amenities: ["On-site Winery", "Lavender Field Tours", "Tennis Courts", "Bicycles", "Free Wi-Fi", "Pet Friendly"]
  },
  {
    id: 110,
    name: "The Obsidian Tower",
    city: "Tokyo",
    country: "Japan",
    rating: 4.8,
    price: 590,
    availability: true,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80",
    description: "Rising high into the heavens above Tokyo, The Obsidian Tower occupies the top floors of a sleek architectural marvel. Blending ultra-modern Japanese high-tech with serene minimalist design, it offers unmatched panoramic views, a world-class sake tasting vault, and state-of-the-art wellness chambers.",
    amenities: ["Panoramic Sky Pool", "Sake Tasting Vault", "Oxygen Wellness Room", "Michelin Restaurant", "Free Wi-Fi", "Teppanyaki Dining"]
  },
  {
    id: 111,
    name: "Golden Crest Lodge",
    city: "Aspen",
    country: "USA",
    rating: 4.8,
    price: 580,
    availability: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    description: "A gorgeous, timber-framed mountain sanctuary in the high Rocky Mountains. Golden Crest Lodge offers rustic alpine beauty coupled with modern luxury: grand stone hearths, outdoor hot tubs under the pine trees, private cinema rooms, and professional ski guide services for an unforgettable mountain escape.",
    amenities: ["Outdoor Hot Tubs", "Private Cinema", "Ski Guides", "Game Room", "Free Wi-Fi", "Heated Ski Lockers"]
  },
  {
    id: 112,
    name: "Marina Bay Jewel",
    city: "Singapore",
    country: "Singapore",
    rating: 4.7,
    price: 460,
    availability: true,
    image: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&w=1200&q=80",
    description: "Experience the vibrant garden city from our striking high-rise sanctuary. Marina Bay Jewel features lush, sky-high hanging gardens, a modern glass-enclosed botanical conservatory, a beautiful outdoor pool suspended over the city, and direct luxury shopping mall access.",
    amenities: ["Sky Hanging Gardens", "Rooftop Pool", "Botanical Lounge", "Direct Mall Access", "Free Wi-Fi", "24/7 Concierge"]
  },
  {
    id: 113,
    name: "Amber Dunes Resort",
    city: "Dubai",
    country: "UAE",
    rating: 4.9,
    price: 680,
    availability: true,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    description: "A majestic Arabian palace emerging from the golden rolling dunes of the Arabian Desert. Experience world-renowned Middle Eastern hospitality, camel riding, private stargazing domes, customized falconry, and majestic sand boarding, paired with top-tier modern pool suites.",
    amenities: ["Private Pool Suites", "Desert Stargazing", "Camel Excursions", "Luxury Spa & Bath", "Free Wi-Fi", "Private Butler"]
  },
  {
    id: 114,
    name: "Serenade Suites",
    city: "Santorini",
    country: "Greece",
    rating: 4.9,
    price: 530,
    availability: true,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    description: "Whitewashed cave villas nestled into the caldera cliffs of Santorini. Marvel at the world's most beautiful sunset directly from your private infinity plunge pool. Savor Mediterranean wine tasting, fresh Greek seafood on the terrace, and bespoke private sailing tours.",
    amenities: ["Caldera Sunset Views", "Private Plunge Pool", "Wine Tasting Room", "Sailing Excursions", "Free Wi-Fi", "Greek Restaurant"]
  },
  {
    id: 115,
    name: "The Onyx Retreat",
    city: "Reykjavik",
    country: "Iceland",
    rating: 4.6,
    price: 320,
    availability: true,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    description: "Immerse yourself in geothermal tranquility at this volcanic stone retreat. The Onyx Retreat borders a peaceful thermal river, offering direct access to healing mineral waters. Features a stargazing lounge designed perfectly for watching the spectacular Northern Lights.",
    amenities: ["Geothermal Lagoon", "Northern Lights Lounge", "Icelandic Grill", "Swedish Spa", "Free Wi-Fi", "Volcano Tours"]
  },
  {
    id: 116,
    name: "Tapestry Boutique Hotel",
    city: "Barcelona",
    country: "Spain",
    rating: 4.7,
    price: 290,
    availability: true,
    image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1200&q=80",
    description: "Located in the artistic Eixample district, Tapestry Boutique Hotel is a celebration of Catalan design. Showcasing mosaic tile floors, custom stained-glass windows, and curated artwork, this hotel includes a rooftop tapas deck and customized walking tours of Gaudi's architecture.",
    amenities: ["Rooftop Tapas Deck", "Gaudi Walking Tours", "Art Gallery", "Cocktail Bar", "Free Wi-Fi", "Library"]
  },
  {
    id: 117,
    name: "Crestview Manor",
    city: "Queenstown",
    country: "New Zealand",
    rating: 4.8,
    price: 370,
    availability: true,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    description: "An exceptional lakeside escape sitting on the shores of Lake Wakatipu, framed by the dramatic Remarkables mountain range. Ideal for both adventure and relaxation, Crestview offers helicopter sightseeing, jet boating, organic gardens, and fine Pinot Noir tasting rooms.",
    amenities: ["Lakefront Access", "Helipad Sightseeing", "Pinot Noir Vault", "Organic Eatery", "Free Wi-Fi", "Fire Pit Lounge"]
  },
  {
    id: 118,
    name: "The Whispering Palms",
    city: "Phuket",
    country: "Thailand",
    rating: 4.7,
    price: 240,
    availability: true,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    description: "A private tropical paradise hidden amongst towering palms and blooming orchids. Whispering Palms features absolute beachfront luxury villas, traditional Thai massage therapy pavillions, cooking academies, and speedboats to the Phi Phi islands.",
    amenities: ["Beachfront Villas", "Thai Spa Pavillion", "Cooking Academy", "Speedboat Rentals", "Free Wi-Fi", "Kids Club"]
  },
  {
    id: 119,
    name: "Savannah Ridge Lodge",
    city: "Serengeti National Park",
    country: "Tanzania",
    rating: 4.9,
    price: 780,
    availability: true,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    description: "Wake up to elephants roaming the vast savannah grass plains. Structured elegantly on an elevated ridge, Savannah Ridge Lodge blends canvas and local stone for a true high-end safari experience. Savor daily guided 4x4 game drives and open-air boma dinners.",
    amenities: ["Guided 4x4 Safaris", "Open-air Boma Dining", "Binoculars & Optics", "Plunge Pool", "Free Wi-Fi", "Airport Airstrip Shuttle"]
  },
  {
    id: 120,
    name: "Velas Sapphire Bay",
    city: "Cabo San Lucas",
    country: "Mexico",
    rating: 4.8,
    price: 490,
    availability: true,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    description: "Where the golden Baja desert meets the sparkling Sea of Cortez. This ultra-luxury all-inclusive sanctuary provides swim-up bar suites, ocean-view gourmet dining, daily whale-watching yachts, and an expansive spa oasis focused on holistic Mexican rituals.",
    amenities: ["Swim-up Bar Suites", "Whale-watching Yacht", "All-inclusive Dining", "Holistic Spa Oasis", "Free Wi-Fi", "Tequila Sommelier"]
  }
];

const getCountryForCity = (city: string, fallbackCountry: string): string => {
  const c = city.trim().toLowerCase();
  const map: Record<string, string> = {
    "mumbai": "India",
    "noida": "India",
    "gurgaon": "India",
    "kolkata": "India",
    "chennai": "India",
    "hyderabad": "India",
    "jaipur": "India",
    "delhi": "India",
    "bengaluru": "India",
    "bangalore": "India",
    "goa": "India",
    "pune": "India",
    "ahmedabad": "India",
    "agra": "India",
    "amalfi coast": "Italy",
    "kyoto": "Japan",
    "maldives": "Maldives",
    "paris": "France",
    "new york city": "USA",
    "new york": "USA",
    "marrakech": "Morocco",
    "bali": "Indonesia",
    "zermatt": "Switzerland",
    "provence": "France",
    "tokyo": "Japan",
    "aspen": "USA",
    "singapore": "Singapore",
    "dubai": "UAE",
    "santorini": "Greece",
    "reykjavik": "Iceland",
    "barcelona": "Spain",
    "queenstown": "New Zealand",
    "phuket": "Thailand",
    "serengeti": "Tanzania",
    "serengeti national park": "Tanzania",
    "cabo san lucas": "Mexico"
  };
  return map[c] || fallbackCountry;
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for body parsing
  app.use(express.json());

  // API Proxy Route with CORS, fallback and normalization mechanisms
  app.get("/api/hotels", async (req, res) => {
    try {
      // Fetch from pythonanywhere REST API with a timeout
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

      const apiResponse = await fetch("https://demohotelsapi.pythonanywhere.com/hotels/", {
        signal: controller.signal,
        headers: {
          "Accept": "application/json"
        }
      });
      clearTimeout(id);

      if (!apiResponse.ok) {
        throw new Error(`External API responded with status ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      
      // Normalize external API data structure
      let rawHotels = [];
      if (Array.isArray(data)) {
        rawHotels = data;
      } else if (data && typeof data === "object" && Array.isArray(data.results)) {
        rawHotels = data.results;
      } else if (data && typeof data === "object") {
        // Look for any array property
        const arrayProp = Object.values(data).find(val => Array.isArray(val));
        if (arrayProp) {
          rawHotels = arrayProp;
        } else {
          throw new Error("Could not find array of hotels in API response");
        }
      }

      if (rawHotels.length === 0) {
        throw new Error("External API returned empty list");
      }

      // Map dynamic fields to strict clean frontend types.
      // E.g., handling variable key names (image/image_url/imageUrl, price/price_per_night, availability/is_available)
      const mappedHotels = rawHotels.map((h: any, idx: number) => {
        // Fallback Unsplash image based on index to ensure beautiful displays if API has broken image URLs
        const defaultUnsplashImg = FALLBACK_HOTELS[idx % FALLBACK_HOTELS.length].image;
        
        let imageUrl = h.image || h.image_url || h.imageUrl || h.photo || defaultUnsplashImg;
        if (typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
          imageUrl = defaultUnsplashImg;
        }

        const priceVal = Number(h.price || h.price_per_night || h.pricePerNight || h.rate || 150);
        const ratingVal = Number(h.rating || h.stars || h.score || 4.5);
        const amenitiesList = Array.isArray(h.amenities) 
          ? h.amenities 
          : typeof h.amenities === "string" 
            ? h.amenities.split(",").map((a: string) => a.trim())
            : FALLBACK_HOTELS[idx % FALLBACK_HOTELS.length].amenities;

        const mappedCity = (h.city || h.location || FALLBACK_HOTELS[idx % FALLBACK_HOTELS.length].city || "").trim();
        const mappedCountry = (h.country || getCountryForCity(mappedCity, FALLBACK_HOTELS[idx % FALLBACK_HOTELS.length].country)).trim();

        return {
          id: h.id || (1000 + idx),
          name: h.name || h.hotel_name || h.title || `Boutique Hotel ${idx + 1}`,
          city: mappedCity,
          country: mappedCountry,
          rating: isNaN(ratingVal) ? 4.5 : ratingVal,
          price: isNaN(priceVal) ? 220 : priceVal,
          availability: h.availability !== undefined ? !!h.availability : (h.is_available !== undefined ? !!h.is_available : true),
          image: imageUrl,
          description: h.description || h.text || h.info || FALLBACK_HOTELS[idx % FALLBACK_HOTELS.length].description,
          amenities: amenitiesList
        };
      });

      // Combine API hotels with fallback database so we have a super-rich set of 30+ properties
      // This solves any paging/filtering limits and makes the experience feel truly premium and exhaustive
      const mergedHotels = [...mappedHotels, ...FALLBACK_HOTELS.filter(fh => !mappedHotels.some(mh => mh.name.toLowerCase() === fh.name.toLowerCase()))];
      
      return res.json({
        success: true,
        source: "external_api",
        data: mergedHotels
      });

    } catch (error: any) {
      console.warn("Hotel API Fetch error, serving elegant fallback list:", error.message || error);
      
      // Serve the fallback database beautifully
      return res.json({
        success: true,
        source: "fallback_database",
        message: "Loaded cached premium database. (External demo API is currently resting or rate-limited).",
        data: FALLBACK_HOTELS
      });
    }
  });

  // Mock booking endpoint to validate and return success response
  app.post("/api/bookings", (req, res) => {
    const { name, email, phone, checkIn, checkOut, guests, hotelId, specialRequests } = req.body;

    if (!name || !email || !phone || !checkIn || !checkOut || !guests || !hotelId) {
      return res.status(400).json({
        success: false,
        error: "Please fill out all required fields."
      });
    }

    // Return custom success object
    const bookingId = "GHB-" + Math.floor(100000 + Math.random() * 900000);
    return res.json({
      success: true,
      bookingId,
      message: `Successfully booked! Your reference is ${bookingId}.`,
      details: {
        name,
        email,
        phone,
        checkIn,
        checkOut,
        guests,
        specialRequests,
        bookingTimestamp: new Date().toISOString()
      }
    });
  });

  // Serve static assets and handle routing for development & production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Grand Horizon Server] Running perfectly at http://localhost:${PORT}`);
  });
}

startServer();
