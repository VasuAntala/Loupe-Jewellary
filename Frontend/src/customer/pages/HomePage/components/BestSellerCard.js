import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, Tooltip, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPriceINR } from "../../../../utils/price";
import { MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';

const BestSellerCard = ({ product }) => {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [wishlisted, setWishlisted] = useState(false);
    const navigate = useNavigate();

    // Determine category name to navigate to (Option B)
    const categoryName = product?.category?.name || product?.secondLevelCategory || 'jewellery';

    // Extract image URL safely
    const mainImage = Array.isArray(product?.imageUrls) && product.imageUrls.length > 0
        ? product.imageUrls[0]?.imageUrl
        : (product?.imageUrl || product?.image || '/product/product4.jpeg');

    const colorOptions = product.colors || [
        { colorName: 'Yellow Gold', colorCode: '#eab308', image: mainImage },
        { colorName: 'Rose Gold', colorCode: '#da8a8a', image: mainImage },
        { colorName: 'White Gold', colorCode: '#f1f5f9', image: mainImage }
    ];

    const currentImage = colorOptions[selectedColorIndex]?.image || mainImage;

    const handleNavigate = () => {
        navigate(`/all-jewellery/category/${categoryName}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-white px-2 py-2 transition-all duration-500 max-w-[17rem] mx-auto w-full"
        >
            {/* 1. Luxury Image Frame */}
            <Box
                className="relative aspect-[4/5] w-full mb-3 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#fcfcfc] to-[#f3f4f6]/30 border border-gray-100/50 transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] group-hover:-translate-y-1 flex items-center justify-center cursor-pointer"
                onClick={handleNavigate}
            >
                {/* Floating "New Tier" Badge */}
                <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-full shadow-sm">
                        <Sparkles size={10} className="text-[#97c2d5]" />
                        <span className="text-[7px] font-black tracking-widest text-gray-500">EXCLUSIVE</span>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={currentImage}
                        alt={product.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full object-cover drop-shadow-[0_15px_30px_rgba(0,0,0,0.05)] group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = "/product/product4.jpeg";
                        }}
                    />
                </AnimatePresence>

                {/* Glass Action Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

                {/* Persistent Wishlist */}
                <div className="absolute top-3 right-3 z-20">
                    <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white transition-all duration-300 hover:scale-110 active:scale-95">
                        <Checkbox
                            checked={wishlisted}
                            onChange={(e) => setWishlisted(e.target.checked)}
                            icon={<FavoriteBorderIcon sx={{ fontSize: 16, color: '#94a3b8' }} />}
                            checkedIcon={<FavoriteIcon sx={{ fontSize: 16, color: '#ef4444' }} />}
                            sx={{ p: 0.75 }}
                        />
                    </div>
                </div>

                {/* Quick Buy Toggles (Bottom Hover) */}
                <div className="absolute bottom-4 inset-x-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                    <IconButton
                        size="small"
                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#25D366', color: 'white' }, transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', p: 1 }}
                        onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/yournumber`, '_blank'); }}
                    >
                        <MessageCircle size={14} />
                    </IconButton>
                    <button onClick={handleNavigate} className="flex-1 bg-white text-[#1e293b] text-[9px] font-black tracking-widest uppercase rounded-full shadow-md hover:bg-[#1e293b] hover:text-white transition-all duration-300 transform active:scale-95 border border-white py-1.5">
                        Discovery
                    </button>
                    <IconButton
                        size="small"
                        sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#1e293b', color: 'white' }, transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', p: 1 }}
                        onClick={handleNavigate}
                    >
                        <ShoppingBag size={14} />
                    </IconButton>
                </div>
            </Box>

            {/* 2. Editorial Typography Stack */}
            <div className="px-1 relative">
                <Typography
                    sx={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        color: '#94a3b8',
                        letterSpacing: '0.2em',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        textAlign: 'left'
                    }}
                >
                    {product.brand || "Premium Selection"}
                </Typography>

                <Typography
                    onClick={handleNavigate}
                    className="text-[#1e293b] font-medium leading-tight mb-2 group-hover:text-[#3c7399] transition-colors duration-300 cursor-pointer"
                    sx={{
                        fontSize: '0.85rem',
                        fontFamily: "'Outfit', sans-serif",
                        height: '2.2rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {product.title}
                </Typography>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-[8px] font-bold tracking-widest uppercase mb-0.5">Value Est.</span>
                        <div className="flex items-baseline gap-1.5">
                            {product.minPrice && product.maxPrice ? (
                                <span className="text-[#1e293b] font-serif italic text-xs">
                                    ₹{formatPriceINR(product.minPrice)} - ₹{formatPriceINR(product.maxPrice)}
                                </span>
                            ) : (
                                <span className="text-[#1e293b] font-serif italic text-base font-medium">
                                    ₹{formatPriceINR(product.discountedPrice || product.price || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 3. Luxury Swatch System */}
                    <div className="flex items-center gap-1.5">
                        {colorOptions.map((opt, idx) => (
                            <Tooltip key={idx} title={opt.colorName} arrow placement="top">
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedColorIndex(idx);
                                    }}
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: opt.colorCode,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: -2,
                                            borderRadius: '50%',
                                            border: selectedColorIndex === idx ? '1px solid #1e293b' : '1px solid transparent',
                                            transition: 'border-color 0.3s'
                                        },
                                        '&:hover': { transform: 'scale(1.2)' }
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BestSellerCard;
