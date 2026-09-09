import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BestSellerCard from './BestSellerCard';

const categories = [
  "All",
  "Rings",
  "Earrings",
  "Bracelets",
  "Pendants",
  "Necklaces",
  "Charms"
];

const ChooseYourJewellery = ({ products = [] }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleViewFullCollection = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (activeCategory === "All") {
      navigate(`/all-jewellery`);
    } else {
      navigate(`/all-jewellery/category/${activeCategory.toLowerCase()}`);
    }
  };

  // Filter products by active category
  // Assuming product.category.name or product.secondLevelCategory contains the category string
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter((p) => {
        const catName = p?.category?.name || p?.secondLevelCategory || "";
        return catName.toLowerCase() === activeCategory.toLowerCase();
      });

  // Take up to 4 products to show, or just let them wrap in a grid
  const displayProducts = filteredProducts.slice(0, 4);

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: '#ffffff', overflow: 'hidden' }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
        
        {/* Top small title */}
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#3c7399',
            textTransform: 'uppercase',
            mb: 1
          }}
        >
          ATTRACTIVE JEWELLERY
        </Typography>

        {/* Main Title */}
        <Typography
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 500,
            fontFamily: "'Playfair Display', serif",
            color: '#000000',
            mb: 2
          }}
        >
          Choose Your Jewellery
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: { xs: '0.9rem', md: '1rem' },
            color: '#666666',
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto',
            mb: 5
          }}
        >
          Get your stunning diamond jewellery with fast, one-day shipping for ultimate convenience and style.
        </Typography>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#3c7399] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {displayProducts.length > 0 ? (
                displayProducts.map((product, index) => (
                  <BestSellerCard key={product._id || index} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500">
                  <Typography variant="h6">No products found for {activeCategory}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Check back later for new arrivals.</Typography>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View Full Collection Button */}
        <div className="mt-12">
          <Button
            onClick={handleViewFullCollection}
            variant="outlined"
            sx={{
              borderColor: '#e5e7eb',
              color: '#374151',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#3c7399',
                backgroundColor: 'transparent',
                color: '#3c7399'
              }
            }}
          >
            View Full Collection
          </Button>
        </div>

      </div>
    </Box>
  );
};

export default ChooseYourJewellery;
