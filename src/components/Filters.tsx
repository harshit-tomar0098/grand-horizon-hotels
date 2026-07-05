import React from "react";
import { SlidersHorizontal, Search, RotateCcw, X, MapPin, Globe, Star, Flame, ArrowUpDown } from "lucide-react";
import { FilterState } from "../types";
import { motion } from "motion/react";

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sortBy: string;
  setSortBy: (sort: string) => void;
  availableCities: string[];
  availableCountries: string[];
  maxPriceLimit: number;
}

export default function Filters({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  availableCities,
  availableCountries,
  maxPriceLimit,
}: FiltersProps) {
  const handleReset = () => {
    setFilters({
      searchQuery: "",
      city: "all",
      country: "all",
      minRating: 0,
      maxPrice: maxPriceLimit,
      availability: "all",
    });
    setSortBy("rating-desc");
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      id="filters-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative overflow-hidden bg-white/40 dark:bg-navy-950/30 backdrop-blur-xl border border-white/30 dark:border-navy-800/40 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)]"
    >
      {/* Background elegant abstract moving visual or subtle glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-navy-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-6 mb-6 border-b border-navy-100/50 dark:border-navy-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy-900 dark:text-gold-100 tracking-tight">
              Refine Search
            </h2>
            <p className="text-[10px] font-medium text-navy-400 dark:text-navy-500 uppercase tracking-widest mt-0.5">
              Curate Your Perfect Escape
            </p>
          </div>
        </div>
        <motion.button
          id="btn-clear-filters"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-navy-500 dark:text-navy-400 hover:text-gold-500 dark:hover:text-gold-400 bg-navy-100/40 dark:bg-navy-900/30 hover:bg-gold-500/10 border border-navy-200/30 dark:border-navy-800/30 transition-all duration-300 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </motion.button>
      </div>

      {/* Filters Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Text Search */}
        <motion.div 
          className="flex flex-col gap-1.5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 flex items-center gap-1">
            <Search className="w-3 h-3 text-gold-500" />
            Search Properties
          </label>
          <div className="relative group">
            <input
              id="filter-input-search"
              type="text"
              placeholder="e.g. Resort, Villa, Hotel..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 text-sm bg-white/50 dark:bg-navy-900/30 border border-navy-200/50 dark:border-navy-800/50 rounded-2xl text-navy-800 dark:text-white placeholder-navy-400/70 focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300 backdrop-blur-md"
            />
            {filters.searchQuery ? (
              <button
                onClick={() => updateFilter("searchQuery", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 text-navy-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400/70 group-focus-within:text-gold-500 transition-colors" />
            )}
          </div>
        </motion.div>

        {/* City Filter */}
        <motion.div 
          className="flex flex-col gap-1.5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gold-500" />
            Destination City
          </label>
          <div className="relative">
            <select
              id="filter-select-city"
              value={filters.city}
              onChange={(e) => updateFilter("city", e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white/50 dark:bg-navy-900/30 border border-navy-200/50 dark:border-navy-800/50 rounded-2xl text-navy-800 dark:text-white focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300 cursor-pointer appearance-none backdrop-blur-md"
            >
              <option value="all" className="dark:bg-navy-950 dark:text-white">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city} className="dark:bg-navy-950 dark:text-white">
                  {city}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-navy-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Country Filter */}
        <motion.div 
          className="flex flex-col gap-1.5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-gold-500" />
            Select Country
          </label>
          <div className="relative">
            <select
              id="filter-select-country"
              value={filters.country}
              onChange={(e) => updateFilter("country", e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white/50 dark:bg-navy-900/30 border border-navy-200/50 dark:border-navy-800/50 rounded-2xl text-navy-800 dark:text-white focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300 cursor-pointer appearance-none backdrop-blur-md"
            >
              <option value="all" className="dark:bg-navy-950 dark:text-white">All Countries</option>
              {availableCountries.map((country) => (
                <option key={country} value={country} className="dark:bg-navy-950 dark:text-white">
                  {country}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-navy-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Rating Filter */}
        <motion.div 
          className="flex flex-col gap-1.5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-gold-500" />
            Minimum Rating
          </label>
          <div className="relative">
            <select
              id="filter-select-rating"
              value={filters.minRating}
              onChange={(e) => updateFilter("minRating", Number(e.target.value))}
              className="w-full px-4 py-2.5 text-sm bg-white/50 dark:bg-navy-900/30 border border-navy-200/50 dark:border-navy-800/50 rounded-2xl text-navy-800 dark:text-white focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300 cursor-pointer appearance-none backdrop-blur-md"
            >
              <option value="0" className="dark:bg-navy-950 dark:text-white">Any Rating</option>
              <option value="4.5" className="dark:bg-navy-950 dark:text-white">4.5★ & Above</option>
              <option value="4.7" className="dark:bg-navy-950 dark:text-white">4.7★ & Above</option>
              <option value="4.9" className="dark:bg-navy-950 dark:text-white">4.9★ & Above</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-navy-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Price Slider */}
        <motion.div 
          className="flex flex-col gap-1.5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
              Maximum Budget
            </label>
            <span className="text-xs font-extrabold text-gold-500 dark:text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-500/20">
              ₹{filters.maxPrice}
            </span>
          </div>
          <div className="relative pt-2">
            <input
              id="filter-slider-price"
              type="range"
              min="100"
              max={maxPriceLimit || 1000}
              step="10"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-navy-200/50 dark:bg-navy-800/80 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[8px] font-bold text-navy-400 dark:text-navy-500 mt-1">
              <span>₹100</span>
              <span>₹{maxPriceLimit || 1000}</span>
            </div>
          </div>
        </motion.div>

        {/* Sort By Selector */}
        <motion.div 
          className="flex flex-col gap-1.5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-gold-500" />
            Sort Order
          </label>
          <div className="relative">
            <select
              id="filter-select-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white/50 dark:bg-navy-900/30 border border-navy-200/50 dark:border-navy-800/50 rounded-2xl text-navy-800 dark:text-white focus:outline-none focus:border-gold-500/80 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300 cursor-pointer appearance-none backdrop-blur-md"
            >
              <option value="rating-desc" className="dark:bg-navy-950 dark:text-white">Rating: High to Low</option>
              <option value="price-asc" className="dark:bg-navy-950 dark:text-white">Price: Low to High</option>
              <option value="price-desc" className="dark:bg-navy-950 dark:text-white">Price: High to Low</option>
              <option value="name-asc" className="dark:bg-navy-950 dark:text-white">Alphabetical: A to Z</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-navy-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sub-Filters: Availability Toggle */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-navy-100/30 dark:border-navy-800/30">
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy-400 dark:text-navy-500 mr-2">
          Availability Status
        </span>
        <div className="flex flex-wrap gap-2.5">
          {[
            { id: "all", label: "Show All" },
            { id: "available", label: "Available Rooms" },
            { id: "unavailable", label: "Fully Booked" },
          ].map((opt) => {
            const isSelected = filters.availability === opt.id;
            return (
              <motion.button
                key={opt.id}
                id={`filter-btn-avail-${opt.id}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => updateFilter("availability", opt.id)}
                className={`relative px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "text-navy-900 bg-gold-500 shadow-lg shadow-gold-500/25 border border-gold-400"
                    : "text-navy-600 dark:text-navy-300 bg-white/30 dark:bg-navy-900/40 hover:bg-gold-500/10 border border-navy-200/50 dark:border-navy-800/60"
                }`}
              >
                <span className="relative z-10">{opt.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeAvailabilityIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
