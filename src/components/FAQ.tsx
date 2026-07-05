import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does the Grand Horizon 24/7 Butler Service work?",
    answer: "Every reservation at Grand Horizon includes access to a dedicated personal butler. Upon arrival, your butler will assist with luggage unpacking, coordinate custom dining preferences, arrange private excursions, prepare bespoke baths, and remain contactable at any hour via our in-room smart tablet or directly from your phone."
  },
  {
    question: "Is complimentary airport transfer included in all bookings?",
    answer: "Yes, our commitment to hassle-free luxury means that round-trip private chauffeur transfers are fully included with every booking. Once your booking is confirmed, your personal concierge will reach out to request your flight details and coordinate a luxurious Mercedes-Benz, Tesla, or yacht transfer directly to our resort."
  },
  {
    question: "What is your cancellation and date alteration policy?",
    answer: "We offer complete luxury-class flexibility. Bookings can be canceled or rescheduled without any penalty up to 48 hours prior to your scheduled check-in. Any cancellations within 48 hours will incur a single-night fee, while date modifications remain entirely complimentary subject to seasonal room availability."
  },
  {
    question: "Can I arrange private, custom chef-cooked meals or handle specific dietary needs?",
    answer: "Unrivaled culinary tailoring is our pride. Our resorts house Michelin-starred kitchen teams ready to create fully customized menus based on your dietary lifestyle, allergies, or spiritual guidelines. You can easily communicate requirements to your butler prior to check-in or during your stay."
  },
  {
    question: "Are private pools, mineral thermal baths, and spa sanctuaries open 24/7?",
    answer: "While beach and infinity pool areas remain open at any hour, organized spa thermal chambers, saunas, and indoor onsens operate daily from 6:00 AM to 11:00 PM to ensure pristine sanitization standards. However, your in-villa private plunge pools, cave baths, or open-air hot tubs are fully operational 24/7."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-20 bg-navy-50/30 dark:bg-navy-950/20 border-t border-navy-100/50 dark:border-navy-900/40 relative overflow-hidden">
      {/* Glossy background detail */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-100/50 dark:bg-gold-950/10 border border-gold-500/10 text-[10px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-gold-500" />
            Curated Concierge Assistance
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-navy-800 dark:text-gold-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-navy-500 dark:text-navy-400 font-light max-w-xl mx-auto mt-2">
            Everything you need to know about our high-end booking experiences, personalized butler inclusions, and flexible stay policies.
          </p>
        </motion.div>

        {/* FAQ Grid with viewport entries */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                id={`faq-item-${index}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 80, damping: 16, delay: index * 0.08 }}
                className="bg-white/50 dark:bg-navy-900/30 backdrop-blur-xl border border-white/40 dark:border-navy-800/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-serif text-sm sm:text-base font-semibold text-navy-800 dark:text-gold-100 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-500 shrink-0 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] border-t border-navy-100/30 dark:border-navy-800/40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  } overflow-hidden`}
                >
                  <div className="p-6 text-xs sm:text-sm text-navy-600 dark:text-navy-300 font-light leading-relaxed tracking-wide bg-navy-50/25 dark:bg-navy-950/25">
                    {faq.answer}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
