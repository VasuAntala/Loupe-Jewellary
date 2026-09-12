import React, { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';

const LifestyleSplit = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
    const y3 = useTransform(scrollYProgress, [0, 1], [120, -120]);

    return (
        <Box ref={containerRef} sx={{ py: { xs: 6, sm: 10, md: 16 }, px: { xs: 3, sm: 6, md: 12 }, bgcolor: '#f8fafc', overflow: 'hidden' }}>
            <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-24 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: 'serif',
                            fontWeight: 400,
                            color: '#3c7399',
                            fontSize: { xs: '2rem', sm: '2.8rem', md: '4rem' },
                            lineHeight: 1.1,
                            mb: { xs: 2, md: 4 }
                        }}
                    >
                        Crafted for <br />
                        <span className="italic text-[#3c7399]">Every Moment</span>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            fontSize: { xs: '0.95rem', md: '1.15rem' },
                            lineHeight: 1.7,
                            mb: { xs: 3, md: 6 },
                            maxWidth: 500
                        }}
                    >
                        From everyday elegance to unforgettable occasions, our pieces are made to be a part of your story.
                        Each design is a testament to timeless beauty and modern sophistication.
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#3c7399',
                            color: '#3c7399',
                            px: { xs: 3.5, sm: 5 },
                            py: { xs: 1.2, sm: 1.8 },
                            borderRadius: '100px',
                            fontWeight: 700,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            fontSize: { xs: '0.72rem', sm: '0.8rem' },
                            borderWidth: '2px',
                            '&:hover': {
                                borderWidth: '2px',
                                borderColor: '#7ea9bd',
                                bgcolor: 'rgba(151,194,213,0.05)',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s'
                        }}
                    >
                        Explore Lookbook
                    </Button>
                </motion.div>

                {/* Images Grid - Mosaic Style */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5 items-center">
                    {/* First Image - Space on Top */}
                    <motion.div
                        style={{ y: y1 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="mt-6 sm:mt-12 md:mt-20"
                    >
                        <Box
                            sx={{
                                borderRadius: { xs: '16px', sm: '28px', md: '40px' },
                                overflow: 'hidden',
                                aspectRatio: '1/1.5',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                            }}
                        >
                            <img
                                src="/lifestyle/lifestyle_ring.jpg"
                                style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                                className="hover:scale-105 transition-transform duration-1000"
                                alt="Ring — Every Moment"
                            />
                        </Box>
                    </motion.div>

                    {/* Second Image - Complete/Center */}
                    <motion.div
                        style={{ y: y2 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Box
                            sx={{
                                borderRadius: { xs: '16px', sm: '28px', md: '40px' },
                                overflow: 'hidden',
                                aspectRatio: '1/1.5',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                            }}
                        >
                            <img
                                src="/lifestyle/lifestyle_necklace.jpg"
                                style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                                className="hover:scale-105 transition-transform duration-1000"
                                alt="Necklace — Every Moment"
                            />
                        </Box>
                    </motion.div>

                    {/* Third Image - Space on Bottom (Shifted Up) */}
                    <motion.div
                        style={{ y: y3 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="-mt-6 sm:-mt-12 md:-mt-20"
                    >
                        <Box
                            sx={{
                                borderRadius: { xs: '16px', sm: '28px', md: '40px' },
                                overflow: 'hidden',
                                aspectRatio: '1/1.5',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                            }}
                        >
                            <img
                                src="/lifestyle/lifestyle_earrings.jpg"
                                style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
                                className="hover:scale-105 transition-transform duration-1000"
                                alt="Earrings — Every Moment"
                            />
                        </Box>
                    </motion.div>
                </div>

            </div>
        </Box>
    );
};

export default LifestyleSplit;
