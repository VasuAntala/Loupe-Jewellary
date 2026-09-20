import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, ShieldCheck, Gift } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <Box
            component="section"
            sx={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#c2d8f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: {
                    xs: 'none',
                    md: 'calc(100dvh - 108px)'
                }
            }}
        >
            {/* Background Images with AnimatePresence for Smooth Crossfades */}
            <AnimatePresence initial={false}>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url("${slides[current].image}")`,
                            filter: 'brightness(0.65)'
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Slide Content with Staggered Element Transitions */}
            <div className="relative z-10 h-full mx-auto max-w-[1400px] flex items-center px-6 lg:px-12">
                <div className="max-w-[700px] w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.15
                                    }
                                },
                                exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
                            }}
                        >
                            {/* Overline Text */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                }}
                            >
                                <Typography
                                    variant="overline"
                                    sx={{
                                        letterSpacing: 6,
                                        fontWeight: 700,
                                        color: '#3c7399',
                                        fontSize: { xs: '0.75rem', md: '0.85rem' },
                                        mb: 2,
                                        display: 'block'
                                    }}
                                >
                                    {slides[current].overline}
                                </Typography>
                            </motion.div>

                    {/* 2. Main Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: {
                                    xs: 'clamp(0.95rem, 3.8vw, 1.5rem)',
                                    sm: 'clamp(1.5rem, 3.8vw, 2.4rem)',
                                    md: 'clamp(2.1rem, 3.5vw, 3.4rem)',
                                    lg: 'clamp(2.6rem, 3.4vw, 4.2rem)'
                                },
                                fontWeight: 700,
                                lineHeight: { xs: 1.14, sm: 1.12, md: 1.1 },
                                color: '#092b4f',
                                mb: { xs: 0.4, sm: 1, md: 1.6 },
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Crafted for<br />
                            Life’s Brighter<br />
                            Moments
                        </Typography>
                    </motion.div>

                    {/* 3. Decorative Accent Line */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '42px', opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
                    >
                        <Box
                            sx={{
                                height: { xs: '1.5px', sm: '2px' },
                                width: { xs: '24px', sm: '36px', md: '44px' },
                                bgcolor: '#2b5a88',
                                mb: { xs: 0.4, sm: 1, md: 1.5 },
                                borderRadius: '2px',
                            }}
                        />
                    </motion.div>

                    {/* 4. Sub-paragraph */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Typography
                            sx={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: {
                                    xs: 'clamp(0.48rem, 1.4vw, 0.65rem)',
                                    sm: 'clamp(0.65rem, 1.4vw, 0.85rem)',
                                    md: 'clamp(0.85rem, 1.2vw, 1.05rem)'
                                },
                                fontWeight: 400,
                                lineHeight: { xs: 1.25, sm: 1.35, md: 1.45 },
                                color: '#1c3d5e',
                                maxWidth: { xs: '95%', sm: '320px', md: '440px' },
                                mb: { xs: 0.8, sm: 1.8, md: 2.8 },
                            }}
                        >
                            Fine jewellery that celebrates your today, 
                            <br />tomorrow and always.
                        </Typography>
                    </motion.div>

                    {/* 5. Explore Collection CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Box
                            component="button"
                            onClick={() => navigate('/all-jewellery')}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: { xs: 0.6, sm: 1, md: 1.4 },
                                bgcolor: '#0b2f53',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '9999px',
                                px: { xs: 1.4, sm: 2.4, md: 3.4 },
                                py: { xs: 0.35, sm: 0.7, md: 1.1 },
                                fontSize: {
                                    xs: 'clamp(0.46rem, 1.2vw, 0.62rem)',
                                    sm: 'clamp(0.62rem, 1.1vw, 0.78rem)',
                                    md: '0.84rem'
                                },
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(11, 47, 83, 0.28)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: '#194c7c',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 24px rgba(25, 76, 124, 0.38)',
                                    '& .hero-cta-arrow': {
                                        transform: 'translateX(4px)',
                                    }
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                }
                            }}
                        >
                            <span>EXPLORE COLLECTION</span>
                            <ArrowRight
                                className="hero-cta-arrow"
                                size={15}
                                style={{ transition: 'transform 0.3s ease' }}
                            />
                        </Box>
                    </motion.div>

                    {/* 6. Three Value Proposition Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: '100%' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: { xs: 1, sm: 2, md: 3, lg: 4 },
                                mt: { xs: 0.8, sm: 1.8, md: 3, lg: 4 },
                            }}
                        >
                            {/* Timeless Designs */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.4, sm: 0.7, md: 1 } }}>
                                <Box sx={{ color: '#092b4f', display: 'flex', alignItems: 'center' }}>
                                    <Gem size={17} strokeWidth={1.8} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        TIMELESS
                                    </Typography>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        DESIGNS
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Premium Craftsmanship */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.4, sm: 0.7, md: 1 } }}>
                                <Box sx={{ color: '#092b4f', display: 'flex', alignItems: 'center' }}>
                                    <ShieldCheck size={17} strokeWidth={1.8} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        PREMIUM
                                    </Typography>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        CRAFTSMANSHIP
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Perfect for Every Occasion */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.4, sm: 0.7, md: 1 } }}>
                                <Box sx={{ color: '#092b4f', display: 'flex', alignItems: 'center' }}>
                                    <Gift size={17} strokeWidth={1.8} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        PERFECT
                                    </Typography>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        FOR EVERY 
                                    </Typography>
                                    <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: { xs: '0.38rem', sm: '0.52rem', md: '0.64rem', lg: '0.7rem' }, fontWeight: 800, letterSpacing: '0.05em', color: '#092b4f', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                        OCCASION
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </motion.div>
                </Box>
            </Box>
        </Box>
    );
};

export default HeroSection;
