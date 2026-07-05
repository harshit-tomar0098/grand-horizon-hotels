import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Hotel, Heart, ArrowLeft } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  favoritesCount: number;
  openFavorites: () => void;
  onContactClick: () => void;
  onAboutClick: () => void;
  selectedHotel?: any;
  onBack?: () => void;
}

export default function Navbar({
  darkMode,
  setDarkMode,
  activeSection,
  setActiveSection,
  favoritesCount,
  openFavorites,
  onContactClick,
  onAboutClick,
  selectedHotel,
  onBack,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    
    if (section === "about") {
      onAboutClick();
    } else if (section === "contact") {
      onContactClick();
    } else if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "hotels") {
      const el = document.getElementById("hotels-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 shadow-lg bg-navy-800/95 backdrop-blur-md border-b border-gold-500/30 text-white"
          : "py-5 bg-navy-800 border-b border-gold-500/20 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          id="brand-logo"
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick("home")}
        >
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform duration-300">
            <Hotel className="w-5 h-5 text-navy-800" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-wider font-semibold text-white group-hover:text-gold-500 transition-colors duration-300 uppercase">
              Grand<span className="text-gold-500"> Horizon</span>
            </span>
            <p className="text-[9px] tracking-[0.25em] text-gold-500/80 uppercase leading-none font-medium mt-0.5">
              Luxury Hotels
            </p>
          </div>
        </div>

        {/* Back to Catalog Sticky Buttons */}
        {selectedHotel && onBack && (
          <>
            {/* Desktop Back Button */}
            <button
              id="nav-back-to-catalog"
              onClick={onBack}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-navy-950 font-bold text-xs uppercase tracking-widest shadow-md shadow-gold-500/20 hover:shadow-gold-500/40 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gold-300/30 ml-4 mr-auto"
            >
              <ArrowLeft className="w-4 h-4 text-navy-950" />
              <span>Back to Catalog</span>
            </button>

            {/* Mobile Back Button */}
            <button
              id="mobile-nav-back-to-catalog"
              onClick={onBack}
              className="flex md:hidden items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold text-[10px] uppercase tracking-wider shadow-md shadow-gold-500/20 cursor-pointer transition-all duration-300 transform active:scale-95 ml-2 mr-auto animate-pulse"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-navy-950" />
              <span>Catalog</span>
            </button>
          </>
        )}

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
          {[
            { id: "home", label: "Home" },
            { id: "hotels", label: "Hotels" },
            { id: "about", label: "About" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 relative py-1 cursor-pointer ${
                activeSection === item.id
                  ? "text-gold-500"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 shadow-[0_0_10px_#D4AF37]" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div id="nav-actions" className="hidden md:flex items-center gap-4">
          {/* Wishlist Button */}
          <button
            id="nav-wishlist-toggle"
            onClick={openFavorites}
            className="p-2 rounded-full transition-all duration-300 relative cursor-pointer bg-white/5 hover:bg-gold-500/10 text-white/90 hover:text-gold-500 border border-white/10"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 hover:scale-110 transition-transform duration-300" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-navy-800 text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse border border-navy-800">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition-all duration-300 cursor-pointer bg-white/5 hover:bg-gold-500/10 text-white/90 hover:text-gold-500 border border-white/10"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Wishlist Icon for Mobile */}
          <button
            id="mobile-wishlist-toggle"
            onClick={openFavorites}
            className="p-2 rounded-full relative text-white/90 hover:text-gold-500"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-navy-800 text-[9px] font-bold flex items-center justify-center rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Theme toggle for Mobile */}
          <button
            id="mobile-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-white/90 hover:text-gold-500"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:text-gold-500 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden absolute top-full left-0 right-0 bg-navy-800/95 backdrop-blur-lg border-b border-gold-500/20 shadow-2xl transition-all duration-300 py-4 px-6 flex flex-col gap-4 animate-fade-in text-white"
        >
          {[
            { id: "home", label: "Home" },
            { id: "hotels", label: "Hotels" },
            { id: "about", label: "About" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`text-left py-2 text-sm font-semibold tracking-widest uppercase border-b border-white/5 ${
                activeSection === item.id
                  ? "text-gold-500"
                  : "text-white/80 hover:text-gold-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
