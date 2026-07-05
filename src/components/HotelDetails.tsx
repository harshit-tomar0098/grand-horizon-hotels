import React, { useEffect } from "react";
import { ArrowLeft, Star, MapPin, Shield, Check, Info, Landmark } from "lucide-react";
import * as Icons from "lucide-react";
import { Hotel } from "../types";
import BookingForm from "./BookingForm";
import { motion } from "motion/react";

interface HotelDetailsProps {
  hotel: Hotel;
  onBack: () => void;
  onBookingSuccess: (bookingDetails: any) => void;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
}

// Map amenity terms to Lucide React icons dynamically
const getAmenityIcon = (amenity: string) => {
  const norm = amenity.toLowerCase();
  if (norm.includes("wifi") || norm.includes("wi-fi") || norm.includes("internet")) {
    return <Icons.Wifi className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("pool") || norm.includes("lagoon") || norm.includes("swim")) {
    return <Icons.Waves className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("dining") || norm.includes("bistro") || norm.includes("restaurant") || norm.includes("eatery") || norm.includes("food")) {
    return <Icons.Utensils className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("spa") || norm.includes("hammam") || norm.includes("massage") || norm.includes("wellness")) {
    return <Icons.Sparkles className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("wine") || norm.includes("sake") || norm.includes("whiskey") || norm.includes("sommelier") || norm.includes("bar")) {
    return <Icons.Wine className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("beach") || norm.includes("snorkel") || norm.includes("water") || norm.includes("reef") || norm.includes("yacht") || norm.includes("sailing")) {
    return <Icons.Ship className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("gym") || norm.includes("fitness") || norm.includes("athletic")) {
    return <Icons.Dumbbell className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("butler") || norm.includes("concierge") || norm.includes("shopper") || norm.includes("service")) {
    return <Icons.ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("shuttle") || norm.includes("valet") || norm.includes("parking") || norm.includes("car") || norm.includes("helipad") || norm.includes("sightseeing")) {
    return <Icons.Car className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("garden") || norm.includes("park") || norm.includes("terrace") || norm.includes("courtyard") || norm.includes("lavender") || norm.includes("hanging")) {
    return <Icons.Trees className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("yoga") || norm.includes("healing") || norm.includes("shala")) {
    return <Icons.Activity className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  if (norm.includes("cinema") || norm.includes("game") || norm.includes("tv") || norm.includes("tech") || norm.includes("controls")) {
    return <Icons.Tv className="w-5 h-5 text-gold-500 shrink-0" />;
  }
  return <Icons.CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />;
};

export default function HotelDetails({
  hotel,
  onBack,
  onBookingSuccess,
  onAddToast,
}: HotelDetailsProps) {
  // Automatically scroll to top when hotel details are opened
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hotel.id]);

  return (
    <div id="hotel-details-page" className="bg-white dark:bg-navy-950 min-h-screen pt-32 pb-20 relative">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.button
          id="btn-back-to-hotels"
          onClick={onBack}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-navy-900 dark:bg-navy-900 border border-gold-500/35 text-xs font-bold uppercase tracking-widest text-gold-400 hover:text-navy-950 hover:bg-gold-500 shadow-lg shadow-gold-500/5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)] transition-all duration-300 cursor-pointer"
        >
          <div className="p-1 rounded-full bg-gold-500/10 text-gold-400 group-hover:bg-navy-950 group-hover:text-gold-400 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Back to Catalog</span>
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Media Gallery, Info, Amenities */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Main Hero Image */}
            <div id="details-image-container" className="relative h-[300px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border border-navy-100 dark:border-navy-900">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-md ${
                    hotel.availability
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hotel.availability ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    }`}
                  />
                  {hotel.availability ? "Available Now" : "Booked Out"}
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div>
              <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400 text-xs sm:text-sm font-medium mb-2.5">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span>{hotel.city}, {hotel.country}</span>
              </div>

              <h1 id="details-hotel-name" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-navy-800 dark:text-gold-100 tracking-tight mb-4">
                {hotel.name}
              </h1>

              {/* Stars display */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(hotel.rating)
                          ? "fill-gold-400 text-gold-400"
                          : "text-navy-200 dark:text-navy-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-navy-700 dark:text-navy-300">
                  {hotel.rating.toFixed(1)} / 5.0 Rating
                </span>
                <span className="text-xs text-navy-400">•</span>
                <span className="text-xs font-medium text-navy-500 dark:text-navy-400">
                  Perfected Luxury Standards
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-navy-50 dark:border-navy-900 pt-6">
              <h2 className="font-serif text-xl font-medium text-navy-800 dark:text-gold-100 mb-3.5">
                About the Sanctuary
              </h2>
              <p className="text-sm text-navy-600 dark:text-navy-300 font-light leading-relaxed tracking-wide">
                {hotel.description}
              </p>
            </div>

            {/* Dynamic Custom Amenities Section */}
            <div className="border-t border-navy-50 dark:border-navy-900 pt-6">
              <h2 className="font-serif text-xl font-medium text-navy-800 dark:text-gold-100 mb-5">
                Exclusive Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-navy-50/40 dark:bg-navy-900/20 border border-navy-100/50 dark:border-navy-800/30"
                  >
                    {getAmenityIcon(amenity)}
                    <div>
                      <h4 className="text-xs font-semibold text-navy-800 dark:text-gold-100 leading-tight">
                        {amenity}
                      </h4>
                      <p className="text-[10px] text-navy-400 mt-0.5">
                        Complimentary premium access
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Horizon Signature Details */}
            <div className="border-t border-navy-50 dark:border-navy-900 pt-6">
              <div className="p-4 bg-gold-50 dark:bg-gold-950/20 rounded-xl border border-gold-200/50 dark:border-gold-800/20 flex gap-4">
                <Shield className="w-8 h-8 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-gold-800 dark:text-gold-200 uppercase tracking-widest mb-1">
                    Grand Horizon Signature Promise
                  </h3>
                  <p className="text-xs text-gold-700/80 dark:text-gold-300/80 font-light leading-relaxed">
                    Enjoy elite inclusions with every booking: a dedicated 24/7 personal butler service, complimentary airport chauffeur transfers, curated daily breakfast by award-winning chefs, and holistic wellness treatments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Booking Form Widget */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="sticky top-28 shadow-2xl rounded-2xl overflow-hidden">
              <BookingForm
                hotel={hotel}
                onBookingSuccess={onBookingSuccess}
                onAddToast={onAddToast}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
