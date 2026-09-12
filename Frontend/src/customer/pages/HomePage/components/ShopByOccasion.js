import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const occasions = [
  {
    id: 1,
    title: 'Workwear Elegance',
    subtitle: 'Office & Everyday Professional',
    image: '/Occasion/Workwear Elegance.png',
    alt: 'Workwear Elegance',
    occasionKey: 'office',
  },
  {
    id: 2,
    title: 'Bridal Collection',
    subtitle: 'Timeless Grand Wedding Sets',
    image: '/Occasion/Bridal Collection.png',
    alt: 'Bridal Collection',
    occasionKey: 'bridal',
  },
  {
    id: 3,
    title: 'Everyday Essentials',
    subtitle: 'Lightweight Daily Radiance',
    image: '/Occasion/EveryDay Essential.png',
    alt: 'Everyday Essentials',
    occasionKey: 'casual',
  },
  {
    id: 4,
    title: 'Festive Glam',
    subtitle: 'Traditional & Ethnic Celebrations',
    image: '/Occasion/Festival Glam.jpeg',
    alt: 'Festive Glam',
    occasionKey: 'traditional-ethenic',
  },
];

const ShopByOccasion = () => {
  const navigate = useNavigate();

  const handleOccasionClick = (occasionKey) => {
    navigate(`/all-jewellery/all/jewellery?occasion=${occasionKey}`);
  };

  return (
    <Box sx={{ py: { xs: 6, md: 12 }, bgcolor: '#ffffff' }}>
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 md:px-12">
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

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {occasions.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleOccasionClick(occasion.occasionKey)}
              className="relative group cursor-pointer rounded-[18px] sm:rounded-[30px] overflow-hidden aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <img
                src={occasion.image}
                alt={occasion.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Text & Action */}
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-6 text-center transition-transform duration-300 group-hover:-translate-y-1">
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontSize: { xs: '0.95rem', sm: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    textShadow: '0px 2px 4px rgba(0,0,0,0.6)',
                    fontFamily: '"Playfair Display", serif',
                    lineHeight: 1.2,
                    mb: 0.5
                  }}
                >
                  {occasion.title}
                </Typography>
                
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: { xs: '0.65rem', sm: '0.78rem' },
                    display: { xs: 'none', sm: 'block' },
                    mb: 1.5,
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  {occasion.subtitle}
                </Typography>

                {/* Explore Button / Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] sm:text-xs text-white uppercase tracking-wider font-semibold border border-white/30 group-hover:bg-white group-hover:text-[#3c7399] transition-all duration-300">
                  <span>Explore Collection</span>
                  <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
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
