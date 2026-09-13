import React, { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LifestyleSplit = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
    const y3 = useTransform(scrollYProgress, [0, 1], [90, -90]);

    return (
        <Box ref={containerRef} sx={{ py: { xs: 6, sm: 10, md: 16 }, px: 0, bgcolor: '#f8fafc', overflow: 'hidden' }}>
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-24 items-center">

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
                        onClick={() => navigate('/all-jewellery/all/jewellery')}
                        sx={{
                            borderColor: '#3c7399',
                            borderWidth: '2px',
                            color: '#3c7399',
                            px: { xs: 4, sm: 6 },
                            py: { xs: 1.5, sm: 1.8 },
                            borderRadius: '100px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            bgcolor: 'transparent',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                borderWidth: '2px',
                                borderColor: '#3c7399',
                                bgcolor: '#3c7399',
                                color: '#ffffff',
                                boxShadow: '0 6px 20px rgba(60, 115, 153, 0.3)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Explore Lookbook
                    </Button>
                </motion.div>

                {/* Images Grid - Mosaic Style */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5 items-center">
                    {/* First Image - Space on Top (Bracelet / Bangle) */}
                    <motion.div
                        style={{ y: y1 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="mt-6 sm:mt-12 md:mt-20 cursor-pointer"
                        onClick={() => navigate('/all-jewellery/category/bracelets')}
                    >
                        <Box
                            sx={{
                                borderRadius: { xs: '16px', sm: '28px', md: '40px' },
                                overflow: 'hidden',
                                aspectRatio: '1/1.5',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #edf2f7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: { xs: 1.5, sm: 2.5 },
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    borderColor: '#3c7399',
                                    boxShadow: '0 25px 60px rgba(60,115,153,0.15)'
                                }
                            }}
                        >
                            <img
                                src="/product/bracelet-1.jpg"
                                style={{ objectFit: 'contain', width: '100%', height: '100%', display: 'block' }}
                                className="hover:scale-108 transition-transform duration-700"
                                alt="Floral Diamond Bracelet — Every Moment"
                            />
                        </Box>
                    </motion.div>

                    {/* Second Image - Complete/Center (Necklace) */}
                    <motion.div
                        style={{ y: y2 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="cursor-pointer"
                        onClick={() => navigate('/all-jewellery/category/necklaces')}
                    >
                        <Box
                            sx={{
                                borderRadius: { xs: '16px', sm: '28px', md: '40px' },
                                overflow: 'hidden',
                                aspectRatio: '1/1.5',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #edf2f7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: { xs: 1.5, sm: 2.5 },
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    borderColor: '#3c7399',
                                    boxShadow: '0 25px 60px rgba(60,115,153,0.15)'
                                }
                            }}
                        >
                            <img
                                src="/product/necklace-1.jpg"
                                style={{ objectFit: 'contain', width: '100%', height: '100%', display: 'block' }}
                                className="hover:scale-108 transition-transform duration-700"
                                alt="Tennis Y-Drop Diamond Necklace — Every Moment"
                            />
                        </Box>
                    </motion.div>

                    {/* Third Image - Space on Bottom (Earrings) */}
                    <motion.div
                        style={{ y: y3 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="-mt-6 sm:-mt-12 md:-mt-20 cursor-pointer"
                        onClick={() => navigate('/all-jewellery/category/earrings')}
                    >
                        <Box
                            sx={{
                                borderRadius: { xs: '16px', sm: '28px', md: '40px' },
                                overflow: 'hidden',
                                aspectRatio: '1/1.5',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                                bgcolor: '#ffffff',
                                border: '1.5px solid #edf2f7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: { xs: 1.5, sm: 2.5 },
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    borderColor: '#3c7399',
                                    boxShadow: '0 25px 60px rgba(60,115,153,0.15)'
                                }
                            }}
                        >
                            <img
                                src="/product/earring-2.jpg"
                                style={{ objectFit: 'contain', width: '100%', height: '100%', display: 'block' }}
                                className="hover:scale-108 transition-transform duration-700"
                                alt="Triple Heart Diamond Drop Earrings — Every Moment"
                            />
                        </Box>
                    </motion.div>
                </div>

            </div>
        </Box>
    );
};

export default LifestyleSplit;
