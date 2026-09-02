import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { formatPriceINR } from "../../../../utils/price";

const stories = [
    {
        id: 1,
        image: "/product/product7.jpeg",
        title: "Celestial Radiance Band",
        price: 24500,
        discount: "5% OFF",
        category: "LUXE ESSENTIALS"
    },
    {
        id: 2,
        image: "/product/product6.jpeg",
        title: "Marquise Dream Ring",
        price: 18900,
        discount: "3% OFF",
        category: "BRIDAL STORY"
    },
    {
        id: 3,
        image: "/product/product5.jpeg",
        title: "Ethereal Halo Studs",
        price: 12500,
        discount: "8% OFF",
        category: "EVERYDAY GLOW"
    },
    {
        id: 4,
        image: "/product/product4.jpeg",
        title: "Infinite Grace Bangle",
        price: 32000,
        discount: "4% OFF",
        category: "STATEMENT PIECE"
    },
    // {
    //     id: 5,
    //     image: "/product/product 3.png",
    //     title: "Infinite Grace Bangle",
    //     price: 32000,
    //     discount: "4% OFF",
    //     category: "STATEMENT PIECE"
    // }
];

const StyleStory = () => {
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
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
                    gap: 3,
                    px: { xs: 2, md: 10 },
                    maxWidth: 1600,
                    mx: 'auto'
                }}
            >
                {stories.map((story) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="group relative cursor-pointer"
                    >
                        {/* Vertical Image Frame */}
                        <Box
                            sx={{
                                position: 'relative',
                                aspectRatio: '3/4',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                mb: 3,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'all 0.5s ease'
                            }}
                        >
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            {/* Category Overlay */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-md text-[#3c7399] text-[8px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                    {story.category}
                                </span>
                            </div>

                            {/* Hover Action Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <Button
                                    variant="contained"
                                    fullWidth
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
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#3c7399',
                                    fontFamily: "'Outfit', sans-serif",
                                    mb: 1
                                }}
                            >
                                {story.title}
                            </Typography>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-[#3c7399] font-serif italic text-lg">₹{formatPriceINR(story.price)}</span>
                                <span className="text-[#3c7399] text-[10px] font-black tracking-tighter uppercase">{story.discount}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

export default StyleStory;
