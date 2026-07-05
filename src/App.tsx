import React, { useState, useEffect, useMemo } from "react";
import { 
  Building, MapPin, Star, Heart, Clock, ArrowUp, 
  Sparkles, ShieldCheck, Mail, Phone, MessageSquare, 
  ChevronRight, Calendar, User, ShoppingBag, X, Bookmark, Globe, Compass
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

import { Hotel, FilterState, ToastNotification } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import HotelCard from "./components/HotelCard";
import HotelDetails from "./components/HotelDetails";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ComparisonModal from "./components/ComparisonModal";

function InteractiveGlassOrbs() {
  const { scrollYProgress } = useScroll();

  // Create subtle parallax scroll depth mappings
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const orb1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 0.85]);
  const orb1Rotate = useTransform(scrollYProgress, [0, 1], [0, 240]);

  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const orb2Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.2]);
  const orb2Rotate = useTransform(scrollYProgress, [0, 1], [0, -180]);

  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb3Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 0.9]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1: Gold Ambient Accent */}
      <motion.div
        style={{
          y: orb1Y,
          scale: orb1Scale,
          rotate: orb1Rotate,
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[12%] left-[4%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-gold-400/12 to-transparent blur-[110px] dark:from-gold-500/5"
      />
      
      {/* Orb 2: Midnight/Slate Ambient Glow */}
      <motion.div
        style={{
          y: orb2Y,
          scale: orb2Scale,
          rotate: orb2Rotate,
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[45%] right-[2%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-navy-400/10 to-transparent blur-[130px] dark:from-navy-600/6"
      />
      
      {/* Orb 3: Creamy Warm Gold Ambient Reflection */}
      <motion.div
        style={{
          y: orb3Y,
          scale: orb3Scale,
        }}
        animate={{
          x: [0, 40, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[78%] left-[12%] w-[380px] h-[380px] rounded-full bg-gradient-to-br from-gold-300/10 to-transparent blur-[100px] dark:from-gold-600/5"
      />
    </div>
  );
}

function ScrollReveal({ 
  children, 
  delay = 0, 
  y = 45, 
  x = 0, 
  rotateX = 8, 
  scale = 0.96,
  duration = 0.8
}: { 
  children: React.ReactNode; 
  delay?: number; 
  y?: number; 
  x?: number; 
  rotateX?: number; 
  scale?: number;
  duration?: number;
  key?: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, rotateX, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        type: "spring", 
        stiffness: 55, 
        damping: 14, 
        delay,
        duration
      }}
      style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  // --- Core States ---
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // --- Filter & Sorting States ---
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    city: "all",
    country: "all",
    minRating: 0,
    maxPrice: 1000,
    availability: "all",
  });
  const [sortBy, setSortBy] = useState("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // --- Modal & Drawer States ---
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [comparedHotels, setComparedHotels] = useState<Hotel[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [bookingInvoice, setBookingInvoice] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // --- Local Storage Syncing States ---
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("gh_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Hotel[]>(() => {
    try {
      const stored = localStorage.getItem("gh_recent_views");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- Fetch Hotels on Mount ---
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/hotels");
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setHotels(json.data);
          
          // Set dynamic max price filter
          const prices = json.data.map((h: Hotel) => h.price);
          const highestPrice = Math.max(...prices, 850);
          setFilters((prev) => ({ ...prev, maxPrice: highestPrice }));
        } else {
          throw new Error("Failed to load hotel records.");
        }
      } catch (err: any) {
        console.error("Fetch failure:", err);
        setError("Our booking systems are temporarily undergoing scheduled maintenance. Please try again soon.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // --- Scroll top listener ---
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Sync Dark Mode ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // --- Auto-scroll to top on view change ---
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    // Immediate fallback for robust iframe support
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedHotel]);

  // --- Reset selected hotel on nav changes to Home or Hotels ---
  useEffect(() => {
    if (activeSection === "home" || activeSection === "hotels") {
      setSelectedHotel(null);
    }
  }, [activeSection]);

  // --- Local Storage Syncing Effect ---
  useEffect(() => {
    localStorage.setItem("gh_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("gh_recent_views", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // --- Toast Manager Helpers ---
  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Toggle Wishlist/Favorites ---
  const handleToggleFavorite = (id: number) => {
    const isFav = favorites.includes(id);
    if (isFav) {
      setFavorites((prev) => prev.filter((favId) => favId !== id));
      addToast("Property removed from your luxury wishlist.", "info");
    } else {
      setFavorites((prev) => [...prev, id]);
      addToast("Property added to your luxury wishlist!", "success");
    }
  };

  // --- Handle Detail View Selection ---
  const handleSelectDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    
    // Add to Recently Viewed List (Keep unique up to top 5)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== hotel.id);
      return [hotel, ...filtered].slice(0, 5);
    });

    // Smooth scroll page viewport to top of detailed header
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Handle Comparison Toggles ---
  const handleToggleCompare = (hotel: Hotel) => {
    const exists = comparedHotels.some((h) => h.id === hotel.id);
    if (exists) {
      setComparedHotels((prev) => prev.filter((h) => h.id !== hotel.id));
      addToast(`${hotel.name} removed from comparison dashboard.`, "info");
    } else {
      if (comparedHotels.length >= 3) {
        addToast("You may compare up to 3 hotels at once.", "error");
        return;
      }
      setComparedHotels((prev) => [...prev, hotel]);
      addToast(`${hotel.name} added to comparison dashboard!`, "success");
    }
  };

  // --- Parse Location Inclusions for Dropdowns ---
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(hotels.map((h) => h.city.trim()))).sort();
  }, [hotels]);

  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(hotels.map((h) => h.country.trim()))).sort();
  }, [hotels]);

  const maxPriceLimit = useMemo(() => {
    if (hotels.length === 0) return 1000;
    return Math.max(...hotels.map((h) => h.price), 850);
  }, [hotels]);

  // --- Filter and Sort Core Processing ---
  const processedHotels = useMemo(() => {
    let result = [...hotels];

    // Search by Name, City, or Country
    if (filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q)
      );
    }

    // Filter by City
    if (filters.city !== "all") {
      const targetCity = filters.city.trim().toLowerCase();
      result = result.filter((h) => h.city.trim().toLowerCase() === targetCity);
    }

    // Filter by Country
    if (filters.country !== "all") {
      const targetCountry = filters.country.trim().toLowerCase();
      result = result.filter((h) => h.country.trim().toLowerCase() === targetCountry);
    }

    // Filter by Rating
    if (filters.minRating > 0) {
      result = result.filter((h) => h.rating >= filters.minRating);
    }

    // Filter by Price range
    result = result.filter((h) => h.price <= filters.maxPrice);

    // Filter by Availability
    if (filters.availability === "available") {
      result = result.filter((h) => h.availability);
    } else if (filters.availability === "unavailable") {
      result = result.filter((h) => !h.availability);
    }

    // Sort Inbound Properties
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });

    return result;
  }, [hotels, filters, sortBy]);

  // --- Pagination Slice ---
  const totalPages = Math.ceil(processedHotels.length / itemsPerPage);
  const paginatedHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedHotels.slice(startIndex, startIndex + itemsPerPage);
  }, [processedHotels, currentPage]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // --- Handle Custom Booking Form Completion ---
  const handleBookingSuccess = (invoiceDetails: any) => {
    setBookingInvoice(invoiceDetails);
    addToast("Suite reserved successfully! Receipt created.", "success");
  };

  // --- Handle Hero/Quick Search Bar Integration ---
  const handleQuickSearch = (query: string, city: string) => {
    // If the user typed a city, find a match in uniqueCities (case-insensitive) to update select dropdown correctly.
    let matchedCity = "all";
    if (city.trim() !== "") {
      const target = city.trim().toLowerCase();
      const match = uniqueCities.find((c) => c.toLowerCase() === target);
      matchedCity = match || city.trim();
    }

    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
      city: matchedCity,
    }));
    setActiveSection("hotels");
  };

  // --- Contact Form submission ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Your inquiry has been received by the butler desk. We will call you back within 15 minutes.", "success");
    setShowContactModal(false);
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${darkMode ? "bg-navy-950 text-white" : "bg-navy-50 text-navy-800"}`}>
      
      {/* Background moving glossy glass orbs */}
      <InteractiveGlassOrbs />
      
      {/* Toast notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Sticky Premium Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        favoritesCount={favorites.length}
        openFavorites={() => setIsFavoritesOpen(true)}
        onContactClick={() => setShowContactModal(true)}
        onAboutClick={() => setShowAboutModal(true)}
        selectedHotel={selectedHotel}
        onBack={() => setSelectedHotel(null)}
      />

      {/* Main Layout Views */}
      <AnimatePresence mode="wait">
        {!selectedHotel ? (
          <motion.div
            key="home-and-catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* HERO SECTION */}
            <Hero onSearch={handleQuickSearch} />

            {/* CATALOG LISTINGS SECTION */}
            <main id="hotels-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="flex flex-col gap-10">
                
                {/* Visual Header */}
                <ScrollReveal>
                  <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-navy-100 dark:border-navy-900 pb-8">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500">
                        Signature Collection
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-navy-800 dark:text-gold-100 mt-1">
                        World-Class Sanctuaries
                      </h2>
                      <p className="text-xs sm:text-sm text-navy-400 dark:text-navy-500 font-light mt-1.5 max-w-xl">
                        Explore our handpicked collection of heritage palaces, modern skyscraper residences, and romantic beachfront island resorts.
                      </p>
                    </div>

                    {/* Compared button indicator */}
                    {comparedHotels.length > 0 && (
                      <button
                        id="trigger-comparison-modal"
                        onClick={() => setIsComparisonOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-navy-800 to-navy-950 dark:from-navy-900 dark:to-navy-800 border border-gold-500/30 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-gold-500/10 hover:border-gold-500/60 transform hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Building className="w-4 h-4 text-gold-400" />
                        Compare Selected ({comparedHotels.length})
                      </button>
                    )}
                  </div>
                </ScrollReveal>

                {/* FILTERS PANEL */}
                <ScrollReveal delay={0.1}>
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    availableCities={uniqueCities}
                    availableCountries={uniqueCountries}
                    maxPriceLimit={maxPriceLimit}
                  />
                </ScrollReveal>

                {/* ERROR STATE */}
                {error && (
                  <div id="api-error-page" className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <span className="text-3xl">⚠️</span>
                    <h3 className="font-serif text-xl font-medium text-red-600 dark:text-red-400">
                      System Uplink Unavailable
                    </h3>
                    <p className="text-xs text-navy-500 dark:text-navy-400 max-w-md">
                      {error}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2.5 bg-red-600 text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition"
                    >
                      Retry System Uplink
                    </button>
                  </div>
                )}

                {/* CARDS GRID & SKELETON LOADERS */}
                {!error && (
                  <div>
                    {isLoading ? (
                      <div id="skeleton-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-navy-900/40 rounded-2xl overflow-hidden border border-navy-100 dark:border-navy-900 shadow-sm h-[400px] flex flex-col p-5 gap-4"
                          >
                            <div className="aspect-video bg-navy-100 dark:bg-navy-950 rounded-xl animate-pulse" />
                            <div className="h-4 bg-navy-100 dark:bg-navy-950 rounded-md w-3/4 animate-pulse mt-2" />
                            <div className="h-3 bg-navy-100 dark:bg-navy-950 rounded-md w-1/2 animate-pulse" />
                            <div className="h-3 bg-navy-100 dark:bg-navy-950 rounded-md w-1/3 animate-pulse mt-2" />
                            <div className="mt-auto h-10 bg-navy-100 dark:bg-navy-950 rounded-xl animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : paginatedHotels.length === 0 ? (
                      <div id="empty-results-box" className="py-20 text-center flex flex-col items-center justify-center gap-3">
                        <Bookmark className="w-12 h-12 text-navy-300 dark:text-navy-700 animate-pulse" />
                        <h3 className="font-serif text-lg font-medium text-navy-800 dark:text-gold-200">
                          No Properties Match Your Query
                        </h3>
                        <p className="text-xs text-navy-400 max-w-md">
                          We could not find any luxury hotel matching your active filters. Try easing price ceilings, selecting "Show All" cities, or resetting parameters.
                        </p>
                        <button
                          onClick={() => setFilters({
                            searchQuery: "",
                            city: "all",
                            country: "all",
                            minRating: 0,
                            maxPrice: maxPriceLimit,
                            availability: "all",
                          })}
                          className="mt-2 px-5 py-2.5 bg-navy-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div id="hotel-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedHotels.map((hotel, index) => (
                          <ScrollReveal 
                            key={hotel.id} 
                            delay={(index % 4) * 0.08} 
                            rotateX={12} 
                            scale={0.93}
                          >
                            <HotelCard
                              hotel={hotel}
                              isFavorite={favorites.includes(hotel.id)}
                              onToggleFavorite={handleToggleFavorite}
                              onSelectDetails={handleSelectDetails}
                              isComparing={comparedHotels.some((h) => h.id === hotel.id)}
                              onToggleCompare={handleToggleCompare}
                            />
                          </ScrollReveal>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PAGINATION PANEL */}
                {!isLoading && !error && totalPages > 1 && (
                  <div id="pagination-panel" className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-navy-100 dark:border-navy-900">
                    <button
                      id="pagination-btn-prev"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                      className="px-4 py-2 bg-white hover:bg-navy-100 dark:bg-navy-900 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-xs font-semibold uppercase tracking-wider rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer text-navy-700 dark:text-navy-300"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        id={`pagination-page-${idx + 1}`}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition duration-200 cursor-pointer ${
                          currentPage === idx + 1
                            ? "bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-md shadow-gold-500/10"
                            : "bg-white hover:bg-navy-100 dark:bg-navy-900 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-navy-700 dark:text-navy-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      id="pagination-btn-next"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                      className="px-4 py-2 bg-white hover:bg-navy-100 dark:bg-navy-900 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-xs font-semibold uppercase tracking-wider rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 cursor-pointer text-navy-700 dark:text-navy-300"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* RECENTLY VIEWED ROW */}
                {!isLoading && recentlyViewed.length > 0 && (
                  <ScrollReveal>
                    <div id="recent-views-panel" className="mt-12 pt-10 border-t border-navy-100 dark:border-navy-900">
                      <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-gold-500" />
                        <h3 className="font-serif text-lg font-medium text-navy-800 dark:text-gold-200">
                          Recently Viewed Havens
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-x-auto pb-2">
                        {recentlyViewed.map((recent) => (
                          <div
                            key={recent.id}
                            onClick={() => handleSelectDetails(recent)}
                            className="flex flex-col bg-white dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 p-3 rounded-2xl cursor-pointer group hover:border-gold-300/30 transition-all duration-300 shadow-sm"
                          >
                            <img
                              src={recent.image}
                              alt={recent.name}
                              className="aspect-video object-cover w-full rounded-xl mb-2.5"
                            />
                            <h4 className="font-serif text-xs font-semibold text-navy-800 dark:text-gold-200 group-hover:text-gold-600 line-clamp-1 transition-colors">
                              {recent.name}
                            </h4>
                            <span className="text-[10px] text-navy-400 mt-0.5 font-medium">
                              {recent.city}, {recent.country}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

              </div>
            </main>

            {/* CONCIERGE ASSISTANCE (FAQ) */}
            <FAQ />
          </motion.div>
        ) : (
          <motion.div
            key="detailed-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* HOTEL DETAILS VIEW */}
            <HotelDetails
              hotel={selectedHotel}
              onBack={() => setSelectedHotel(null)}
              onBookingSuccess={handleBookingSuccess}
              onAddToast={addToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <Footer onNavClick={(sec) => {
        if (sec === "about") {
          setShowAboutModal(true);
        } else if (sec === "contact") {
          setShowContactModal(true);
        } else {
          setActiveSection(sec);
          setSelectedHotel(null);
          if (sec === "home") window.scrollTo({ top: 0, behavior: "smooth" });
          else if (sec === "hotels") {
            const el = document.getElementById("hotels-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }} onAddToast={addToast} />

      {/* --- SIDEBAR WIDGETS & MODAL OVERLAYS --- */}

      {/* 1. Comparison Side-By-Side Portal */}
      {isComparisonOpen && (
        <ComparisonModal
          comparedHotels={comparedHotels}
          onClose={() => setIsComparisonOpen(false)}
          onRemove={(h) => handleToggleCompare(h)}
          onSelectDetails={handleSelectDetails}
        />
      )}

      {/* 2. Wishlist/Favorites Slide-out Drawer */}
      {isFavoritesOpen && (
        <div id="favorites-overlay" className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-navy-900 w-full max-w-md h-full shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="bg-navy-800 dark:bg-navy-950 text-white p-6 flex items-center justify-between border-b border-navy-900">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold-400 fill-gold-400" />
                <h3 className="font-serif text-lg font-medium">Your Wishlist</h3>
              </div>
              <button
                id="close-favorites-drawer"
                onClick={() => setIsFavoritesOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-navy-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {favorites.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-20">
                  <Heart className="w-12 h-12 text-navy-100 dark:text-navy-800 animate-pulse" />
                  <p className="text-sm font-semibold text-navy-700 dark:text-navy-400">
                    Your wishlist is empty.
                  </p>
                  <p className="text-xs text-navy-400 font-light max-w-xs">
                    Tap the heart icon on any hotel card to store your favorite destinations here.
                  </p>
                </div>
              ) : (
                hotels
                  .filter((h) => favorites.includes(h.id))
                  .map((fav) => (
                    <div
                      key={fav.id}
                      className="flex gap-4 p-3 bg-navy-50/50 dark:bg-navy-950/40 rounded-xl border border-navy-100/50 dark:border-navy-800/30 group"
                    >
                      <img
                        src={fav.image}
                        alt={fav.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 flex flex-col">
                        <h4
                          onClick={() => {
                            handleSelectDetails(fav);
                            setIsFavoritesOpen(false);
                          }}
                          className="font-serif text-xs sm:text-sm font-bold text-navy-800 dark:text-gold-200 hover:text-gold-600 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {fav.name}
                        </h4>
                        <span className="text-[10px] text-navy-400 mt-0.5">
                          {fav.city}, {fav.country}
                        </span>
                        <div className="flex justify-between items-center mt-auto pt-2">
                          <span className="font-serif text-sm font-bold text-navy-800 dark:text-gold-400">
                            ₹{fav.price} <span className="text-[9px] font-light text-navy-400">/ night</span>
                          </span>
                          <button
                            onClick={() => handleToggleFavorite(fav.id)}
                            className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Drawer Footer */}
            <div className="bg-navy-50 dark:bg-navy-950 p-6 border-t border-navy-100 dark:border-navy-900 text-center">
              <button
                id="favorites-btn-close-drawer"
                onClick={() => setIsFavoritesOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition duration-200 cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. Booking Success Receipt Modal Dialog */}
      {bookingInvoice && (
        <div id="invoice-overlay" className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="invoice-receipt-card"
            className="bg-white dark:bg-navy-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gold-500/20 max-h-[90vh] flex flex-col animate-scale-up"
          >
            {/* Header branding */}
            <div className="bg-navy-800 dark:bg-navy-950 text-white p-6 text-center border-b border-navy-900 relative">
              <Sparkles className="w-8 h-8 text-gold-400 mx-auto mb-2 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                Reservation Finalized
              </span>
              <h3 className="font-serif text-xl font-medium mt-0.5">
                Luxury Suite Receipt
              </h3>
              <p className="text-xs text-navy-400 font-mono mt-1">
                REF CODE: {bookingInvoice.bookingId}
              </p>
            </div>

            {/* Invoice Body content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-sm">
              {/* Animation Check circle */}
              <div className="text-center flex flex-col items-center gap-1.5 pb-4 border-b border-navy-50 dark:border-navy-800/40">
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20 mb-1">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-navy-800 dark:text-gold-200 leading-tight">
                  Grand Horizon Confirmed
                </h4>
                <p className="text-xs text-navy-400 font-light max-w-xs">
                  Your premium travel credits are successfully locked. Your personal butler has been notified.
                </p>
              </div>

              {/* Sanctuary specifics */}
              <div className="flex gap-4 p-3 bg-navy-50/50 dark:bg-navy-950/40 rounded-xl border border-navy-100/50 dark:border-navy-800/30">
                <img
                  src={bookingInvoice.hotel.image}
                  alt={bookingInvoice.hotel.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <h5 className="font-serif font-bold text-navy-800 dark:text-gold-200 line-clamp-1">
                    {bookingInvoice.hotel.name}
                  </h5>
                  <div className="flex items-center gap-1 text-[10px] text-navy-400 mt-1">
                    <MapPin className="w-3 h-3 text-gold-500" />
                    <span>{bookingInvoice.hotel.city}, {bookingInvoice.hotel.country}</span>
                  </div>
                  <div className="flex gap-1 items-center mt-1.5">
                    <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                    <span className="text-[10px] font-bold text-navy-600 dark:text-navy-300">
                      {bookingInvoice.hotel.rating} Stars Inbound
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest specifications */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Lead Guest
                  </span>
                  <p className="font-medium text-navy-800 dark:text-white mt-0.5">{bookingInvoice.details.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Inbound Guests
                  </span>
                  <p className="font-medium text-navy-800 dark:text-white mt-0.5">
                    {bookingInvoice.details.guests} {bookingInvoice.details.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Check-In Date
                  </span>
                  <p className="font-medium text-navy-800 dark:text-white mt-0.5">{bookingInvoice.details.checkIn}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Check-Out Date
                  </span>
                  <p className="font-medium text-navy-800 dark:text-white mt-0.5">{bookingInvoice.details.checkOut}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Contact Phone
                  </span>
                  <p className="font-medium text-navy-800 dark:text-white mt-0.5">{bookingInvoice.details.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Total Nights
                  </span>
                  <p className="font-medium text-navy-800 dark:text-white mt-0.5">{bookingInvoice.nights} Nights</p>
                </div>
              </div>

              {/* Special instructions */}
              {bookingInvoice.details.specialRequests && (
                <div className="pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">
                    Butler Instructions
                  </span>
                  <p className="p-2.5 bg-navy-50/50 dark:bg-navy-950/50 rounded-lg text-xs font-light text-navy-600 dark:text-navy-300 italic mt-1 leading-relaxed border border-navy-100/50 dark:border-navy-800/30">
                    "{bookingInvoice.details.specialRequests}"
                  </p>
                </div>
              )}

              {/* Bill details */}
              <div className="bg-gold-50 dark:bg-gold-950/20 p-4 rounded-xl border border-gold-200/50 dark:border-gold-800/20 flex justify-between items-center mt-3">
                <span className="text-xs font-bold text-gold-800 dark:text-gold-300 uppercase tracking-wider">
                  Total Credits Paid
                </span>
                <span className="font-serif text-lg font-bold text-gold-600 dark:text-gold-400">
                  ₹{bookingInvoice.totalCost}
                </span>
              </div>
            </div>

            {/* Footer action close */}
            <div className="bg-navy-50 dark:bg-navy-950 p-6 border-t border-navy-100 dark:border-navy-900 flex flex-col gap-3">
              <div className="flex gap-1.5 items-center justify-center text-[10px] text-navy-400 dark:text-navy-500 font-semibold uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span>An official receipt has been dispatched to {bookingInvoice.details.email}</span>
              </div>
              <button
                id="btn-invoice-dismiss"
                onClick={() => {
                  setBookingInvoice(null);
                  setSelectedHotel(null); // Return to list view
                }}
                className="w-full py-3.5 bg-navy-800 dark:bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs uppercase tracking-widest rounded-xl shadow-md transition cursor-pointer text-center"
              >
                Return to Grand Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. About Heritage Modal */}
      {showAboutModal && (
        <div id="about-overlay" className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-navy-100 dark:border-navy-800 max-h-[90vh] flex flex-col animate-scale-up">
            <div className="bg-navy-800 dark:bg-navy-950 text-white p-6 flex items-center justify-between border-b border-navy-900">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-medium">Our Story & Heritage</h3>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="p-1.5 rounded-full hover:bg-white/10 text-navy-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-sm text-navy-600 dark:text-navy-300 font-light leading-relaxed tracking-wide">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
                alt="Grand Horizon Lobby"
                className="w-full h-48 object-cover rounded-2xl mb-2"
              />
              <p>
                Founded in 1924, <span className="font-semibold text-navy-800 dark:text-gold-200">Grand Horizon Luxury Hotels Group</span> has spent over a century redefining the paradigms of premium hospitality. What started as a singular, majestic castle sanctuary on the French Riviera has grown into a prestigious global collection of 20+ signature properties.
              </p>
              <p>
                We curate locations where historical architecture meets contemporary refinement. Every hotel in our collection operates under our strict **Signature Promise**: providing guests with dedicated 24/7 personal butler service, fine Michelin-starred dining, private chauffeur transfers, and state-of-the-art wellness centers.
              </p>
              <p>
                Our philosophy centers around **architectural preservation** and **ecological stewardship**. We commit to carbon-neutral operations, dynamic local community support, and complete water and energy autonomy while never compromising on luxury and comfort.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 text-center border-t border-navy-50 dark:border-navy-800/40">
                <div>
                  <span className="font-serif text-2xl font-bold text-gradient-gold">100+</span>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-navy-400 mt-1">Years of Opulence</p>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-gradient-gold">20+</span>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-navy-400 mt-1">Global Sanctuaries</p>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-gradient-gold">120K+</span>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-navy-400 mt-1">Satisfied Members</p>
                </div>
              </div>
            </div>
            <div className="bg-navy-50 dark:bg-navy-950 px-6 py-4 border-t border-navy-100 dark:border-navy-900 text-right">
              <button onClick={() => setShowAboutModal(false)} className="px-5 py-2.5 bg-gradient-to-r from-gold-400 to-gold-600 text-white font-semibold text-xs uppercase tracking-widest rounded-xl cursor-pointer">
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Contact Concierge Modal */}
      {showContactModal && (
        <div id="contact-overlay" className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-navy-100 dark:border-navy-800 max-h-[90vh] flex flex-col animate-scale-up">
            <div className="bg-navy-800 dark:bg-navy-950 text-white p-6 flex items-center justify-between border-b border-navy-900">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg font-medium">Contact Grand Concierge</h3>
              </div>
              <button onClick={() => setShowContactModal(false)} className="p-1.5 rounded-full hover:bg-white/10 text-navy-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div className="text-center pb-4 border-b border-navy-50 dark:border-navy-800/40">
                <p className="text-xs text-navy-500 dark:text-navy-400">
                  Our professional travel concierges are ready to craft custom travel itineraries, manage exclusive requests, or guide reservations.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <input required type="text" placeholder="e.g. Richard Hammond" className="w-full pl-10 pr-3 py-2.5 text-sm bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850 rounded-xl text-navy-800 dark:text-white focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Your Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <input required type="email" placeholder="e.g. richard@domain.com" className="w-full pl-10 pr-3 py-2.5 text-sm bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850 rounded-xl text-navy-800 dark:text-white focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Special Enquiry / Request</label>
                <textarea required rows={4} placeholder="Type your personalized travel requirements..." className="w-full p-3.5 text-sm bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850 rounded-xl text-navy-800 dark:text-white focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-3.5 mt-2 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white font-semibold text-xs uppercase tracking-widest rounded-xl shadow-md transition cursor-pointer">
                Send Concierge Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scroll-To-Top Circular Button */}
      {showScrollTop && (
        <button
          id="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-navy-800 dark:bg-navy-800 hover:bg-gold-500 dark:hover:bg-gold-500 text-white dark:text-white hover:scale-110 shadow-lg transform transition duration-300 border border-navy-700 cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      )}

    </div>
  );
}
