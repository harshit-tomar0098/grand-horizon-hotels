import React from "react";
import { Star, MapPin, Heart, ArrowRight } from "lucide-react";
import { Hotel } from "../types";
import { motion } from "motion/react";

interface HotelCardProps {
  key?: any;
  hotel: Hotel;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelectDetails: (hotel: Hotel) => void;
  isComparing: boolean;
  onToggleCompare: (hotel: Hotel) => void;
}

export default function HotelCard({
  hotel,
  isFavorite,
  onToggleFavorite,
  onSelectDetails,
  isComparing,
  onToggleCompare,
}: HotelCardProps) {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [imgX, setImgX] = React.useState(0);
  const [imgY, setImgY] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [shineStyle, setShineStyle] = React.useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position of mouse relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const midX = mouseX - width / 2;
    const midY = mouseY - height / 2;

    // Calculate elegant rotation (max 7 degrees for classy tilt)
    const rX = -(midY / (height / 2)) * 7;
    const rY = (midX / (width / 2)) * 7;
    
    setRotateX(rX);
    setRotateY(rY);
    setIsHovered(true);

    // Parallax image shifting (slight translation in opposite direction of mouse)
    setImgX(-(midX / (width / 2)) * 12);
    setImgY(-(midY / (height / 2)) * 12);

    // Dynamic sheen shine coordinates (percent)
    const percentX = (mouseX / width) * 100;
    const percentY = (mouseY / height) * 100;
    setShineStyle({
      x: percentX,
      y: percentY,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setImgX(0);
    setImgY(0);
    setIsHovered(false);
    setShineStyle({ x: 0, y: 0, opacity: 0 });
  };

  // Render rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= floorRating
              ? "fill-gold-400 text-gold-400"
              : i - rating < 1 && i - rating > 0
              ? "fill-gold-400 text-gold-400 opacity-70"
              : "text-navy-200 dark:text-navy-700"
          }`}
        />
      );
    }
    return <div className="flex gap-0.5 items-center">{stars}</div>;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      whileHover={{ 
        scale: 1.025,
        z: 15
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 20,
        mass: 0.6
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative flex flex-col h-full bg-white/45 dark:bg-navy-950/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/40 dark:border-navy-800/50 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_60px_rgba(180,140,40,0.1)] dark:hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] hover:border-gold-300/40 dark:hover:border-gold-500/30 transition-all duration-300"
    >
      {/* Real-time elegant light sheen/glowing spotlight following the cursor */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-overlay"
        style={{
          opacity: shineStyle.opacity,
          background: `radial-gradient(circle at ${shineStyle.x}% ${shineStyle.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`
        }}
      />

      {/* Compare Checkbox Cover */}
      <div 
        className="absolute top-4 left-4 z-10 flex items-center"
        style={{ transform: "translateZ(25px)" }}
      >
        <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-navy-950/80 backdrop-blur-md shadow-sm border border-navy-100 dark:border-navy-800 text-[10px] font-semibold text-navy-800 dark:text-navy-200 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isComparing}
            onChange={() => onToggleCompare(hotel)}
            className="w-3.5 h-3.5 rounded text-gold-500 border-navy-300 focus:ring-gold-500 cursor-pointer"
          />
          Compare
        </label>
      </div>

      {/* Favorite Heart Button */}
      <button
        onClick={() => onToggleFavorite(hotel.id)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-navy-950/80 backdrop-blur-md shadow-sm border border-navy-100 dark:border-navy-800 text-navy-500 dark:text-navy-400 hover:text-red-500 dark:hover:text-red-400 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        style={{ transform: "translateZ(25px)" }}
        title="Add to Wishlist"
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-navy-500 dark:text-navy-400"
          }`}
        />
      </button>

      {/* Image Container */}
      <div 
        className="relative aspect-video w-full overflow-hidden bg-navy-100 dark:bg-navy-950 cursor-pointer" 
        onClick={() => onSelectDetails(hotel)}
        style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
      >
        <motion.img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          animate={{
            x: imgX,
            y: imgY,
            scale: isHovered ? 1.14 : 1.0,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 120, 
            damping: 22,
            mass: 0.5
          }}
          className="object-cover w-full h-full transform-gpu"
        />
        {/* Availability Badge */}
        <div 
          className="absolute bottom-3 right-3"
          style={{ transform: "translateZ(20px)" }}
        >
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md shadow-sm ${
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
            {hotel.availability ? "Available" : "Fully Booked"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div 
        className="flex flex-col flex-1 p-5"
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
      >
        {/* Destination Location */}
        <div className="flex items-center gap-1 text-gold-500 text-[10px] uppercase font-bold tracking-widest mb-1">
          <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
          <span>{hotel.city}, {hotel.country}</span>
        </div>

        {/* Hotel Name */}
        <h3 
          className="font-serif text-lg font-medium text-navy-800 dark:text-gold-50 group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors duration-300 line-clamp-1 mb-2 cursor-pointer"
          onClick={() => onSelectDetails(hotel)}
        >
          {hotel.name}
        </h3>

        {/* Stars and Score */}
        <div className="flex items-center justify-between mb-4">
          {renderStars(hotel.rating)}
          <span className="text-xs font-bold text-navy-700 dark:text-navy-300">
            {hotel.rating.toFixed(1)} / 5.0
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Pricing & Call to Action */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-100 dark:border-navy-800/40">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 leading-none mb-1">
              Price per night
            </p>
            <span className="font-serif text-xl font-bold text-navy-800 dark:text-gold-400">
              ₹{hotel.price}
            </span>
          </div>

          <button
            id={`view-details-${hotel.id}`}
            onClick={() => onSelectDetails(hotel)}
            className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-800 font-bold uppercase text-[10px] tracking-widest rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all duration-300 cursor-pointer inline-flex items-center gap-1"
          >
            Details
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
