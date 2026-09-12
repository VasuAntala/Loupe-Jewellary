import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatPriceINR } from "../../../../utils/price";

const fallbackStories = [
    {
        id: "fallback-1",
        image: "/product/product7.jpeg",
        title: "Celestial Radiance Band",
        price: 24500,
        discount: "5% OFF",
        category: "LUXE ESSENTIALS",
        isFallback: true,
    },
    {
        id: "fallback-2",
        image: "/product/product6.jpeg",
        title: "Marquise Dream Ring",
        price: 18900,
        discount: "3% OFF",
        category: "BRIDAL STORY",
        isFallback: true,
    },
    {
        id: "fallback-3",
        image: "/product/product5.jpeg",
        title: "Ethereal Halo Studs",
        price: 12500,
        discount: "8% OFF",
        category: "EVERYDAY GLOW",
        isFallback: true,
    },
    {
        id: "fallback-4",
        image: "/product/product4.jpeg",
        title: "Infinite Grace Bangle",
        price: 32000,
        discount: "4% OFF",
        category: "STATEMENT PIECE",
        isFallback: true,
    },
];

const getProductImage = (p) => {
    if (!p) return "/product/product7.jpeg";
    if (typeof p.image === 'string' && p.image) return p.image;
    if (typeof p.imageUrl === 'string' && p.imageUrl) return p.imageUrl;
    if (Array.isArray(p.imageUrls) && p.imageUrls.length > 0) {
        const first = p.imageUrls[0];
        if (typeof first === 'string') return first;
        if (first?.imageUrl) return first.imageUrl;
        if (first?.url) return first.url;
        if (Array.isArray(first?.images) && first.images.length > 0) return first.images[0];
    }
    if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
    return "/product/product7.jpeg";
};

const StyleStory = ({ products = [] }) => {
    const navigate = useNavigate();

    // Prepare display stories from real tagged products, or fallback to default styled cards
    const displayStories = (Array.isArray(products) && products.length > 0)
        ? products.slice(0, 8).map((p) => {
            const price = Number(p.discountedPrice || p.price || p.minPrice || 0);
            const originalPrice = Number(p.price || p.maxPrice || 0);
            let discountStr = "";
            if (p.discountPercent) {
                discountStr = `${p.discountPercent}% OFF`;
            } else if (originalPrice > price && originalPrice > 0) {
                discountStr = `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`;
            }

            const rawCat = p.secondLevelCategory || p.category?.name || "STYLE STORY";
            const categoryLabel = rawCat.replace(/-/g, ' ').toUpperCase();

            return {
                id: p._id,
                image: getProductImage(p),
                title: p.title || "Jewellery Piece",
                price: price,
                discount: discountStr,
                category: categoryLabel,
                isFallback: false,
            };
        })
        : fallbackStories;

    const handleCardClick = (story) => {
        if (story.isFallback) {
            navigate('/all-jewellery/category/jewellery');
        } else {
            navigate(`/product/${story.id}`);
        }
    };

    return (
        <Box sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography
                    sx={{
                        fontSize: { xs: '0.7rem', md: '0.8rem' },
                        fontWeight: 900,
                        color: '#3c7399',
                        letterSpacing: 4,
                        mb: 2,
                        textTransform: 'uppercase'
                    }}
                >
                    The Art of Adornment
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: '2rem', md: '3.5rem' },
                        fontWeight: 300,
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: 1,
                        color: '#3c7399',
                        mb: 2,
                        textTransform: 'uppercase'
                    }}
                >
                    Style Stories
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        color: '#64748b',
                        maxWidth: 600,
                        mx: 'auto',
                        mb: 4,
                        lineHeight: 1.6,
                        fontWeight: 400
                    }}
                >
                    Discover the effortless elegance of Loupe Jeweller through our curated lifestyle moments and high-fidelity craftsmanship.
                </Typography>
                <div className="w-16 h-[2px] bg-[#3c7399] mx-auto opacity-30" />
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 4, md: 10 },
                    maxWidth: 1600,
                    mx: 'auto'
                }}
            >
                {displayStories.map((story) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="group relative cursor-pointer"
                        onClick={() => handleCardClick(story)}
                    >
                        {/* Vertical Image Frame */}
                        <Box
                            sx={{
                                position: 'relative',
                                aspectRatio: '3/4',
                                borderRadius: { xs: '8px', sm: '12px' },
                                overflow: 'hidden',
                                mb: { xs: 1.5, sm: 3 },
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'all 0.5s ease',
                                bgcolor: '#f8fafc'
                            }}
                        >
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Category Overlay */}
                            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                                <span className="bg-white/90 backdrop-blur-md text-[#3c7399] text-[7px] sm:text-[8px] font-black tracking-widest px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm uppercase">
                                    {story.category}
                                </span>
                            </div>

                            {/* Hover Action Overlay */}
                            <div className="hidden sm:block absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(story);
                                    }}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#3c7399',
                                        fontSize: '0.7rem',
                                        fontWeight: 900,
                                        '&:hover': { bgcolor: '#3c7399', color: 'white' }
                                    }}
                                >
                                    Shop the look
                                </Button>
                            </div>
                        </Box>

                        {/* Card Meta */}
                        <div className="px-1 text-center">
                            <Typography
                                sx={{
                                    fontSize: { xs: '0.78rem', sm: '0.9rem' },
                                    fontWeight: 600,
                                    color: '#3c7399',
                                    fontFamily: "'Outfit', sans-serif",
                                    mb: 0.5,
                                    lineHeight: 1.2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {story.title}
                            </Typography>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-[#3c7399] font-serif italic text-sm sm:text-lg">₹{formatPriceINR(story.price)}</span>
                                {story.discount && (
                                    <span className="text-[#3c7399] text-[9px] sm:text-[10px] font-black tracking-tighter uppercase">{story.discount}</span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

export default StyleStory;
