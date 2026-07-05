import { X, Star, Check, HelpCircle, Landmark } from "lucide-react";
import { Hotel } from "../types";

interface ComparisonModalProps {
  comparedHotels: Hotel[];
  onClose: () => void;
  onRemove: (hotel: Hotel) => void;
  onSelectDetails: (hotel: Hotel) => void;
}

export default function ComparisonModal({
  comparedHotels,
  onClose,
  onRemove,
  onSelectDetails,
}: ComparisonModalProps) {
  // Extract all unique amenities from all compared hotels to make a beautiful checklist row comparison
  const allAmenities = Array.from(
    new Set(comparedHotels.flatMap((h) => h.amenities))
  ).slice(0, 8); // Display top 8 amenities for comparison

  return (
    <div
      id="comparison-overlay"
      className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="comparison-modal-box"
        className="bg-white dark:bg-navy-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-navy-100 dark:border-navy-800 flex flex-col max-h-[90vh] animate-scale-up"
      >
        {/* Header */}
        <div className="bg-navy-800 dark:bg-navy-950 text-white px-6 py-5 flex items-center justify-between border-b border-navy-900">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
              Side-By-Side Showcase
            </span>
            <h2 className="font-serif text-xl font-medium tracking-tight mt-0.5">
              Hotel Comparison Portal
            </h2>
          </div>
          <button
            id="close-compare-portal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-navy-200 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-auto p-6">
          {comparedHotels.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Landmark className="w-12 h-12 text-navy-200 dark:text-navy-700 animate-pulse" />
              <p className="text-sm font-medium text-navy-500 dark:text-navy-400">
                Please select hotels from their cards to compare them here.
              </p>
            </div>
          ) : (
            <div className="min-w-[650px]">
              {/* Grid Header / Hotel Card row */}
              <div className="grid grid-cols-12 gap-4 pb-6 border-b border-navy-50 dark:border-navy-800/40">
                <div className="col-span-3 flex items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-navy-400 dark:text-navy-500">
                    Feature Criteria
                  </span>
                </div>
                
                {/* Hotels columns */}
                <div className={`col-span-9 grid grid-cols-${comparedHotels.length} gap-4`}>
                  {comparedHotels.map((hotel) => (
                    <div key={hotel.id} className="relative flex flex-col bg-navy-50/50 dark:bg-navy-950/40 p-3 rounded-2xl border border-navy-100/50 dark:border-navy-800/30">
                      {/* Delete check */}
                      <button
                        onClick={() => onRemove(hotel)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-navy-800 text-navy-400 hover:text-red-500 hover:scale-105 shadow-sm border border-navy-100 dark:border-navy-700 transition-all cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Image */}
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="aspect-video object-cover w-full rounded-xl mb-3 shadow-sm"
                      />

                      {/* Name */}
                      <h4
                        onClick={() => {
                          onSelectDetails(hotel);
                          onClose();
                        }}
                        className="font-serif text-sm font-semibold text-navy-800 dark:text-gold-200 hover:text-gold-600 line-clamp-1 cursor-pointer mb-1"
                      >
                        {hotel.name}
                      </h4>

                      <span className="text-[10px] font-medium text-navy-500 dark:text-navy-400">
                        {hotel.city}, {hotel.country}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row: Price Per Night */}
              <div className="grid grid-cols-12 gap-4 py-4 border-b border-navy-50 dark:border-navy-800/40 text-sm">
                <div className="col-span-3 font-semibold text-navy-700 dark:text-navy-400">
                  Price Per Night
                </div>
                <div className={`col-span-9 grid grid-cols-${comparedHotels.length} gap-4`}>
                  {comparedHotels.map((hotel) => (
                    <span key={hotel.id} className="font-serif font-bold text-navy-800 dark:text-gold-400 text-base">
                      ₹{hotel.price}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row: Rating */}
              <div className="grid grid-cols-12 gap-4 py-4 border-b border-navy-50 dark:border-navy-800/40 text-sm">
                <div className="col-span-3 font-semibold text-navy-700 dark:text-navy-400">
                  Guest Rating
                </div>
                <div className={`col-span-9 grid grid-cols-${comparedHotels.length} gap-4`}>
                  {comparedHotels.map((hotel) => (
                    <div key={hotel.id} className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                      <span className="font-bold text-navy-800 dark:text-white">
                        {hotel.rating.toFixed(1)} / 5.0
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row: Availability */}
              <div className="grid grid-cols-12 gap-4 py-4 border-b border-navy-50 dark:border-navy-800/40 text-sm">
                <div className="col-span-3 font-semibold text-navy-700 dark:text-navy-400">
                  Availability
                </div>
                <div className={`col-span-9 grid grid-cols-${comparedHotels.length} gap-4`}>
                  {comparedHotels.map((hotel) => (
                    <span
                      key={hotel.id}
                      className={`font-semibold text-xs ${
                        hotel.availability
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {hotel.availability ? "Rooms Available" : "Fully Booked"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rows: Specific Amenities Comparisons */}
              {allAmenities.map((amenity) => (
                <div key={amenity} className="grid grid-cols-12 gap-4 py-3.5 border-b border-navy-50 dark:border-navy-800/20 text-xs">
                  <div className="col-span-3 text-navy-500 dark:text-navy-400 font-medium">
                    {amenity}
                  </div>
                  <div className={`col-span-9 grid grid-cols-${comparedHotels.length} gap-4`}>
                    {comparedHotels.map((hotel) => {
                      const hasAmenity = hotel.amenities.some(
                        (a) => a.toLowerCase() === amenity.toLowerCase()
                      );
                      return (
                        <div key={hotel.id} className="flex items-center">
                          {hasAmenity ? (
                            <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3]" />
                          ) : (
                            <span className="text-navy-300 dark:text-navy-700">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-navy-50 dark:bg-navy-950 px-6 py-4 flex justify-between items-center border-t border-navy-100 dark:border-navy-900">
          <span className="text-xs text-navy-400 dark:text-navy-500 font-light">
            Compare up to 3 hotels at once for accurate selection.
          </span>
          <button
            id="close-compare-footer"
            onClick={onClose}
            className="px-5 py-2 bg-navy-800 dark:bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
}
