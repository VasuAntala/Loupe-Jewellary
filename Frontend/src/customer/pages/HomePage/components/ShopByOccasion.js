import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const occasions = [
  {
    id: 1,
    title: 'Workwear Elegance',
    image: '/Occasion/Workwear Elegance.png',
    alt: 'Workwear Elegance',
  },
  {
    id: 2,
    title: 'Bridal Collection',
    image: '/Occasion/Bridal Collection.png',
    alt: 'Bridal Collection',
  },
  {
    id: 3,
    title: 'Everyday Essentials',
    image: '/Occasion/EveryDay Essential.png',
    alt: 'Everyday Essentials',
  },
  {
    id: 4,
    title: 'Festive Glam',
    image: '/Occasion/Festival Glam.jpeg',
    alt: 'Festive Glam',
  },
];

const ShopByOccasion = () => {
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
            From office wear to festive looks, find jewellery for every occasion.
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
              className="relative group cursor-pointer rounded-[18px] sm:rounded-[30px] overflow-hidden aspect-[3/4]"
            >
              {/* Image */}
              <img
                src={occasion.image}
                alt={occasion.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 w-full p-3 sm:p-6 text-center">
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontSize: { xs: '0.9rem', sm: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                    fontFamily: '"Playfair Display", serif',
                    lineHeight: 1.2
                  }}
                >
                  {occasion.title}
                </Typography>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default ShopByOccasion;
