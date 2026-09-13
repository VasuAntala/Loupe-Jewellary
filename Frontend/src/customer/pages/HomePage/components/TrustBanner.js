import React from 'react';
import { Box, Typography } from '@mui/material';
import { RefreshCcw, Gem, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <RefreshCcw size={28} strokeWidth={1.5} />,
        title: 'Buyback & Exchange',
        desc: 'Exchange old designs, upgrade anytime'
    },
    {
        icon: <Gem size={28} strokeWidth={1.5} />,
        title: 'Certified Diamond',
        desc: '100 % Lab certified IGI, SGL'
    },
    {
        icon: <Truck size={28} strokeWidth={1.5} />,
        title: '7 Day Return',
        desc: 'Easy Returns Within a Week'
    }
];

const TrustBanner = () => {
    return (
        <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4, lg: 6 }, bgcolor: '#ffffff' }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
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
                    Why Shop With Us?
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: '1.5rem', md: '2.5rem' },
                        fontWeight: 300,
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: 2,
                        color: '#3c7399',
                        mb: 3,
                        textTransform: 'uppercase'
                    }}
                >
                    The Loupe Promise
                </Typography>
                <div className="w-16 h-[2px] bg-[#f1f5f9] mx-auto" />
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
                    gap: 3,
                    maxWidth: 1600,
                    mx: 'auto'
                }}
            >
                {features.map((f, i) => (
                    <Box
                        key={i}
                        component={motion.div}
                        whileHover={{ y: -8 }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 4,
                            borderRadius: '20px',
                            bgcolor: '#ffffff',
                            color: '#3c7399',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                bgcolor: '#3c7399', // Match website theme
                                color: '#ffffff',
                                border: '1px solid #3c7399',
                                boxShadow: '0 20px 40px rgba(64, 45, 67, 0.2)',
                                '& .icon-box': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff',
                                    transform: 'scale(1.1)'
                                },
                                '& .desc-text': {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        }}
                    >
                        <Box
                            className="icon-box"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 60,
                                height: 60,
                                borderRadius: '50%',
                                bgcolor: '#f8fafc',
                                color: '#3c7399',
                                mr: 3,
                                transition: 'all 0.4s ease'
                            }}
                        >
                            {f.icon}
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    fontFamily: "'Outfit', sans-serif",
                                    mb: 0.5
                                }}
                            >
                                {f.title}
                            </Typography>
                            <Typography
                                className="desc-text"
                                sx={{
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    lineHeight: 1.5,
                                    fontWeight: 400,
                                    transition: 'color 0.4s ease'
                                }}
                            >
                                {f.desc}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TrustBanner;
