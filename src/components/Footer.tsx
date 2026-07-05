import React, { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Sparkles, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavClick: (section: string) => void;
  onAddToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function Footer({ onNavClick, onAddToast }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      onAddToast("Please enter a valid email address.", "error");
      return;
    }
    setSubscribed(true);
    onAddToast("Thank you for subscribing to our luxury newsletter!", "success");
    setEmail("");
  };

  return (
    <footer id="main-footer" className="bg-navy-900 dark:bg-navy-950 text-white border-t border-navy-800">
      {/* Top Newsletter & Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-navy-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
              Exclusive Travel Circle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight mt-1">
              Unlock Extraordinary Destinies
            </h3>
            <p className="text-xs sm:text-sm text-navy-300 font-light max-w-md mt-1">
              Subscribe to receive private invitations, early access announcements, and curations from Grand Horizon.
            </p>
          </div>
          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-2.5 p-4 bg-gold-950/20 border border-gold-500/20 rounded-xl text-gold-300">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  You have been successfully added to our elite list.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-navy-950/60 border border-navy-800 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-gold-500/40 transition-colors"
                  />
                </div>
                <button
                  id="btn-subscribe-newsletter"
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Join Circle
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-widest font-semibold text-gold-100 uppercase">
              Grand Horizon
            </span>
          </div>
          <p className="text-xs text-navy-300 font-light leading-relaxed">
            Crafting the world's most luxurious escape sanctuaries. We unite timeless, heritage architecture with hyper-personalized 24/7 butler attention and Michelin-starred dining.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Twitter, label: "Twitter" },
              { icon: Instagram, label: "Instagram" },
              { icon: Linkedin, label: "Linkedin" },
            ].map((soc, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-full bg-navy-950/80 hover:bg-gold-500/10 border border-navy-800 hover:border-gold-500/20 text-navy-400 hover:text-gold-400 transition-all duration-300 cursor-pointer"
                aria-label={soc.label}
              >
                <soc.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-gold-400 uppercase">
            Quick Navigation
          </h4>
          <nav className="flex flex-col gap-2.5">
            {[
              { id: "home", label: "Home Base" },
              { id: "hotels", label: "Luxury Hotels" },
              { id: "about", label: "About Heritage" },
              { id: "contact", label: "Contact Concierge" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className="text-left text-xs text-navy-300 hover:text-gold-400 transition-colors duration-200 uppercase tracking-widest font-medium cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Support & Policies Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-gold-400 uppercase">
            Curated Services
          </h4>
          <nav className="flex flex-col gap-2.5 text-xs text-navy-300 font-medium">
            <a href="#" className="hover:text-gold-400 transition-colors">24/7 Butler Services</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Private Chauffeur Fleet</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Wellness & Bath Hammams</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Michelin-starred Dining</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Bespoke Destination Yachts</a>
          </nav>
        </div>

        {/* Contact Details Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-gold-400 uppercase">
            Hotel Concierge
          </h4>
          <div className="flex flex-col gap-3.5 text-xs text-navy-300 font-light">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
              <span>714 Ocean Drive, Suite 900, Beverly Hills, CA 90210</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <span>+1 (800) HORIZON / +1 (555) 014-9988</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold-500 shrink-0" />
              <span>concierge@grandhorizonhotels.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-navy-950 text-center py-6 border-t border-navy-800/40 text-[10px] font-semibold uppercase tracking-widest text-navy-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© {new Date().getFullYear()} Grand Horizon Luxury Hotels Group. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Opulence</a>
            <span>•</span>
            <a href="#" className="hover:text-gold-400 transition-colors">Cookie Ledger</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
