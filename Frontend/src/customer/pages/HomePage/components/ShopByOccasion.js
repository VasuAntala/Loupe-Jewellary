import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const occasions = [
  {
    id: 1,
    title: 'Workwear Elegance',
    badgeText: 'WORKWEAR ELEGANCE',
    subtitle: 'Solitaire Ring & Tennis Bracelet',
    image: '',
    fallback: '/Occasion/1stoccasion.png',
    alt: 'Workwear Elegance',
    occasionKey: 'office',
    objectPos: 'center center',
  },
  {
    id: 2,
    title: 'Everyday Essentials',
    badgeText: 'EVERYDAY ESSENTIALS',
    subtitle: 'Solitaire Diamond Pendant',
    image: '',
    fallback: '/Occasion/2ndoccasion.png',
    alt: 'Everyday Essentials',
    occasionKey: 'casual',
    objectPos: 'center center',
  },
  {
    id: 3,
    title: 'Bridal Collection',
    badgeText: 'BRIDAL COLLECTION',
    subtitle: 'Royal Diamond Mangalsutra',
    image: '',
    fallback: '/Occasion/3rdoccasion.png',
    alt: 'Bridal Collection',
    occasionKey: 'bridal',
    objectPos: 'center center',
  },
  {
    id: 4,
    title: 'Festive Glam',
    badgeText: 'FESTIVE GLAM',
    subtitle: 'Traditional Emerald Kundan Set',
    image: '',
    fallback: '/Occasion/4thoccasion.png',
    alt: 'Festive Glam',
    occasionKey: 'traditional-ethenic',
    objectPos: 'center 30%',
  },
];

const ShopByOccasion = () => {
  const navigate = useNavigate();

  const handleOccasionClick = (occasionKey) => {
    navigate(`/all-jewellery/all/jewellery?occasion=${occasionKey}`);
  };

  return (
    <Box sx={{ py: { xs: 6, md: 12 }, bgcolor: '#ffffff' }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header section */}
        <div className="text-center mb-8 md:mb-14">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 600,
              color: '#000000',
              mb: 1.5,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            Shop by Occasion
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.85rem', md: '1.1rem' },
              color: '#3c7399',
              fontWeight: 500,
              px: 2
            }}
          >
            From office wear to festive looks, find jewellery crafted for every moment.
          </Typography>
        </div>

        {/* Cards Grid - Highlight Worn Jewellery */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {occasions.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleOccasionClick(occasion.occasionKey)}
              className="relative group cursor-pointer overflow-hidden aspect-[3/4.2] sm:aspect-[3/4.4] shadow-md hover:shadow-2xl transition-all duration-500 rounded-sm sm:rounded-md bg-slate-100"
            >
              {/* Highlighted Model Jewellery Image */}
              <img
                src={occasion.image}
                alt={occasion.alt}
                style={{ objectPosition: occasion.objectPos }}
                onError={(e) => {
                  if (occasion.fallback && e.target.src !== occasion.fallback) {
                    e.target.src = occasion.fallback;
                  }
                }}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-[1.03] contrast-[1.06] group-hover:brightness-[1.08]"
              />
              
              {/* Soft Gradient Overlay for Jewellery Clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 group-hover:from-black/65 transition-colors duration-500" />

              {/* Centered White Rectangular Badge Button */}
              <div className="absolute bottom-5 sm:bottom-7 left-1/2 transform -translate-x-1/2 w-[85%] sm:w-[80%] z-10 text-center">
                <div className="bg-white text-slate-900 px-2 sm:px-4 py-2 sm:py-3 shadow-lg group-hover:bg-[#3c7399] group-hover:text-white transition-all duration-300">
                  <span className="text-[0.65rem] sm:text-[0.78rem] font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase font-sans block line-clamp-1">
                    {occasion.badgeText}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default ShopByOccasion;
