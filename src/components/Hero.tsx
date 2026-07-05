import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Award, Landmark, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeroProps {
  onSearch: (query: string, city: string) => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80", // lobby
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80", // pool facade
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80", // island resort
];

export default function Hero({ onSearch }: HeroProps) {
  const [currentBg, setCurrentBg] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchName, searchCity);
    const hotelsSection = document.getElementById("hotels-section");
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0 bg-navy-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentBg]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-navy-950/75 z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-gold-300 border border-gold-500/20 text-xs font-semibold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Experience True Luxury
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto"
        >
          Your Private Sanctuary <br/><span className="italic font-normal text-gold-500">Awaits.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-navy-200 font-light tracking-wide max-w-2xl mx-auto mb-10"
        >
          Discover curated luxury boutique hotels, private overwater sanctuaries, and scenic castle retreats across iconic global destinations.
        </motion.p>

        {/* Search Panel with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto w-full mb-16 relative"
        >
          <motion.form
            id="hero-search-form"
            onSubmit={handleSubmit}
            whileHover={{ y: -4, boxShadow: "0 0 45px rgba(212,175,55,0.3)" }}
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative overflow-hidden bg-white/5 dark:bg-navy-950/20 backdrop-blur-3xl border border-gold-500/40 hover:border-gold-400/70 p-3 rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.2)] flex flex-col sm:flex-row items-center gap-4 text-left transition-all duration-300"
          >
            {/* continuous glowing shining sheen sweep */}
            <motion.div
              initial={{ left: "-150%" }}
              animate={{ left: "250%" }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 3.5,
                ease: "linear",
              }}
              className="absolute top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none z-10"
            />

            {/* Name Input */}
            <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-white/10 transition-colors duration-300">
              <Search className="w-5 h-5 text-gold-400 shrink-0 transition-colors duration-300" />
              <div className="w-full">
                <label className="block text-[10px] uppercase text-gold-400 font-bold tracking-wider leading-none mb-1 transition-colors duration-300">
                  Destination or Hotel Name
                </label>
                <input
                  id="hero-input-name"
                  type="text"
                  placeholder="Where to?"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-transparent border-none text-white placeholder-white/30 text-sm font-medium focus:outline-none p-0 cursor-text"
                />
              </div>
            </div>

            {/* City Input */}
            <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-2">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0 transition-colors duration-300" />
              <div className="w-full">
                <label className="block text-[10px] uppercase text-gold-400 font-bold tracking-wider leading-none mb-1 transition-colors duration-300">
                  City / Location
                </label>
                <input
                  id="hero-input-city"
                  type="text"
                  placeholder="e.g. Kyoto, Amalfi"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent border-none text-white placeholder-white/30 text-sm font-medium focus:outline-none p-0 cursor-text"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="hero-submit-search"
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-navy-950 font-bold uppercase text-xs tracking-widest rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer shrink-0 z-20"
            >
              Search
            </button>
          </motion.form>
        </motion.div>

        {/* Stats Grid */}
        <div id="stats-panel" className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/10">
          {[
            { icon: Award, value: "100%", label: "Curated Luxury" },
            { icon: Landmark, value: "24/7", label: "Butler Service" },
            { icon: Users, value: "120K+", label: "Happy Guests" },
            { icon: Sparkles, value: "4.9★", label: "Average Rating" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <stat.icon className="w-6 h-6 text-gold-400 mb-2" />
              <span className="font-serif text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy-300 mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
