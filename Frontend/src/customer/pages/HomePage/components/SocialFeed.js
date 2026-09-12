import React from 'react';
import { Box, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from 'framer-motion';

const socialImages = [
    "/product/product4.jpeg",
    "/product/Necklace.jpeg",
    "/product/product.png",
    "/product/product 2.png",
    "/product/_.jpeg",
    "/product/product5.jpeg"
];

const SocialFeed = () => {
    return (
        <Box sx={{ py: { xs: 6, md: 14 }, px: { xs: 3, sm: 6, md: 12 }, bgcolor: '#ffffff' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '32px' }}
            >
                <Typography
                    variant="overline"
                    sx={{ letterSpacing: { xs: 2, sm: 4 }, fontWeight: 800, color: '#3c7399', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                >
                    FOLLOW @LOUPE_DIAMONDS
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#64748b', mt: 1, fontWeight: 500, letterSpacing: 1 }}
                >
                    Tag us to get featured #loupe_diamonds
                </Typography>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-5"
            >
                {socialImages.map((img, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative group cursor-pointer"
                    >
                        <Box
                            sx={{
                                aspectRatio: '1/1',
                                overflow: 'hidden',
                                borderRadius: '24px',
                                position: 'relative',
                                '&:hover img': { transform: 'scale(1.1)' },
                                '&:hover .social-overlay': { opacity: 1 }
                            }}
                        >
                            <img
                                src={img}
                                alt={`Social ${i}`}
                                className="w-full h-full object-cover transition-transform duration-1000"
                            />
                            <Box
                                className="social-overlay"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: 'rgba(151, 194, 213, 0.4)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.4s'
                                }}
                            >
                                <InstagramIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
                            </Box>
                        </Box>
                    </motion.div>
                ))}
            </motion.div>
        </Box>
    );
};

export default SocialFeed;
