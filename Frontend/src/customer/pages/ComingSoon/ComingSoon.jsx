import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="relative min-h-screen bg-[#a9cee5] text-[#1e3545] font-['Outfit',sans-serif] flex flex-col justify-between overflow-x-hidden selection:bg-[#1e3545] selection:text-white">
      {/* Background Soft Lighting Accents matching Website Header Theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle lighter center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] bg-white/25 blur-[100px] rounded-full" />
        {/* Subtle accent corner highlights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8bbddc]/40 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3c7399]/20 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-between min-h-screen text-center">
        
        {/* Brand Logo Header */}
        <header className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="p-4 sm:p-6 rounded-3xl bg-[#1e3545]/90 backdrop-blur-md shadow-[0_10px_30px_rgba(30,53,69,0.25)] border border-[#1e3545]/20 flex items-center justify-center">
              <img
                src="/Loupe-logo.png"
                alt="Loupe Jewellery"
                className="h-20 sm:h-28 md:h-32 w-auto object-contain drop-shadow-md"
              />
            </div>
            <img
              src="/Loupe-logo.png"
              alt="Loupe Jewellery"
              className="h-36 sm:h-48 md:h-56 w-auto object-contain"
            />
          </motion.div>
        </header>

        {/* Hero Content */}
        <main className="my-auto py-8 sm:py-12 flex flex-col items-center max-w-2xl">
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3545] text-white text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-6 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ebd69d]" />
            <span>COMING SOON</span>
          </motion.div>

          {/* Slogan Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-['Playfair_Display',serif] text-3xl sm:text-5xl md:text-6xl font-bold text-[#1e3545] leading-[1.2] tracking-tight"
          >
            Crafted to Perfection.<br />
            <span className="italic font-normal text-[#1e3545]/90">
              Made to Be Yours.
            </span>
          </motion.h1>

          {/* Subtitle Message */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-[#1e3545]/85 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed"
          >
            Our official online store is currently under creation. We are curating 
            an exclusive collection of fine handcrafted jewellery, certified solitaires, 
            and timeless creations.
          </motion.p>

          {/* Elegant Divider Accent */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-3 w-48"
          >
            <span className="h-px bg-[#1e3545]/30 flex-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e3545]/60" />
            <span className="h-px bg-[#1e3545]/30 flex-1" />
          </motion.div>
        </main>

        {/* Clean Footer */}
        <footer className="pt-6 border-t border-[#1e3545]/15 w-full text-center">
          <p className="text-xs text-[#1e3545]/70 tracking-wider font-medium">
            &copy; {new Date().getFullYear()} LOUPE JEWELLERY. ALL RIGHTS RESERVED.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default ComingSoon;
