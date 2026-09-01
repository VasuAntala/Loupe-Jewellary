import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  {
    id: "rings",
    tag: "01",
    title: "Rings",
    subtitle: "Symbolic & stunning",
    image: "https://res.cloudinary.com/deq0hxr3t/image/upload/v1710439067/3_xwvjdr.jpg",
    categoryParam: "rings"
  },
  {
    id: "necklaces",
    tag: "02",
    title: "Necklaces",
    subtitle: "Graceful & statement",
    image: "https://res.cloudinary.com/deq0hxr3t/image/upload/v1707742460/45_eqespc.jpg",
    categoryParam: "nacklaces"
  },
  {
    id: "earrings",
    tag: "03",
    title: "Earrings",
    subtitle: "Brilliant & refined",
    image: "https://res.cloudinary.com/deq0hxr3t/image/upload/v1710439069/1_hvyglx.jpg",
    categoryParam: "earrings"
  },
  {
    id: "bracelets",
    tag: "04",
    title: "Bracelets",
    subtitle: "Classic & delicate",
    image: "https://res.cloudinary.com/deq0hxr3t/image/upload/v1711731943/fod-bracelet_um6zoo.webp",
    categoryParam: "bracelet"
  },
  {
    id: "watches",
    tag: "05",
    title: "Watches",
    subtitle: "Timeless luxury",
    image: "https://res.cloudinary.com/deq0hxr3t/image/upload/v1711731879/fod-bangle_bsxfzl.webp",
    categoryParam: "wedding"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  }
};

const ChooseYourJewellery = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryParam) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/all-jewellery/category/${categoryParam}`);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#ffffff', overflow: 'hidden' }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
        {/* Header Stack */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0f9ff] border border-[#bae6fd] mb-3">
            <Sparkles size={14} className="text-[#3c7399]" />
            <Typography
              sx={{
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#3c7399',
                textTransform: 'uppercase'
              }}
            >
              EXPLORE OUR MASTERPIECES
            </Typography>
          </div>

          <Typography
            sx={{
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 400,
              fontFamily: "'Playfair Display', serif",
              color: '#0f172a',
              letterSpacing: '-0.02em',
              mt: 1
            }}
          >
            Choose Your Jewellery
          </Typography>
          <div className="w-20 h-[2px] bg-[#3c7399] mx-auto mt-4 " />
        </motion.div>

        {/* 5 Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {categories.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              onClick={() => handleCategoryClick(item.categoryParam)}
              className="group cursor-pointer flex flex-col text-left"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:rounded-3xl bg-[#f8fafc] border border-gray-100/80 shadow-sm transition-all duration-700 group-hover:shadow-[0_25px_60px_-15px_rgba(60,115,153,0.25)] group-hover:border-[#3c7399]/40 group-hover:-translate-y-1.5">
                {/* Index Tag */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-[#3c7399] shadow-sm border border-white/60">
                  {item.tag}
                </div>

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "/product/product4.jpeg";
                  }}
                />

                {/* Animated Glass Blur Backdrop on Hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4 backdrop-blur-[3px] z-10">
                  {/* Shop Collection Animated CTA Button */}
                  <div className="flex items-center gap-2 bg-white text-[#0f172a] text-[11px] font-black tracking-[0.2em] uppercase px-5 py-3 shadow-2xl transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 group-hover:scale-105 hover:bg-[#3c7399] hover:text-white border border-white">
                    <span>SHOP COLLECTION</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle below card */}
              <div className="pt-4 px-1">
                <div className="flex items-center justify-between">
                  <Typography
                    sx={{
                      fontSize: { xs: '1.2rem', md: '1.3rem' },
                      fontWeight: 500,
                      fontFamily: "'Playfair Display', serif",
                      color: '#0f172a',
                      transition: 'color 0.3s ease'
                    }}
                    className="group-hover:text-[#3c7399]"
                  >
                    {item.title}
                  </Typography>
                </div>
                {/* Sliding Accent Line */}
                <div className="w-0 group-hover:w-12 transition-all duration-500 h-[2px] bg-[#3c7399] my-1" />
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    color: '#64748b',
                    fontWeight: 400
                  }}
                  className="group-hover:text-slate-700 transition-colors"
                >
                  {item.subtitle}
                </Typography>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Box>
  );
};

export default ChooseYourJewellery;
