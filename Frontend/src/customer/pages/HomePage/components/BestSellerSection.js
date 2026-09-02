import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import BestSellerCard from './BestSellerCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const NextArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: 'absolute',
            right: { xs: 0, md: -30 },
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: '#3c7399',
            color: 'white',
            width: 40,
            height: 40,
            '&:hover': { bgcolor: '#3c7399' },
            transition: 'all 0.3s'
        }}
    >
        <ChevronRight size={20} />
    </IconButton>
);

const PrevArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: 'absolute',
            left: { xs: 0, md: -30 },
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            bgcolor: '#3c7399',
            color: 'white',
            width: 40,
            height: 40,
            '&:hover': { bgcolor: '#3c7399' },
            transition: 'all 0.3s'
        }}
    >
        <ChevronLeft size={20} />
    </IconButton>
);

const BestSellerSection = ({ title = "Best Sellers", products = [] }) => {
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: products.length > 4,
        speed: 500,
        slidesToShow: products.length > 0 ? Math.min(4, products.length) : 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: { slidesToShow: Math.min(3, products.length) }
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: Math.min(2, products.length) }
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    return (
        <Box sx={{ pt: 6, pb: 3, bgcolor: '#ffffff' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                    sx={{
                        fontSize: { xs: '1.5rem', md: '2.2rem' },
                        fontWeight: 300,
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: 2,
                        color: '#3c7399',
                        mb: 1.5,
                        textTransform: 'uppercase'
                    }}
                >
                    {title}
                </Typography>
                <div className="w-16 h-[2px] bg-[#3c7399] mx-auto opacity-50" />
            </Box>

            <div className="max-w-[1400px] mx-auto px-10 relative">
                <Slider {...settings}>
                    {products.map((product, idx) => (
                        <BestSellerCard key={product._id || product.id || idx} product={product} />
                    ))}
                </Slider>
            </div>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate('/best-sellers/jewellery/jewellery');
                    }}
                    sx={{
                        bgcolor: '#3c7399', // Primary Slate
                        color: 'white',
                        px: 8,
                        py: 2,
                        borderRadius: '4px', // Subtle rounding for premium feel
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: 3,
                        boxShadow: '0 4px 14px 0 rgba(30, 41, 59, 0.2)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        textTransform: 'uppercase',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            bgcolor: '#3c7399', // Loupe Blue Hover
                            boxShadow: '0 8px 25px rgba(151, 194, 213, 0.4)',
                            transform: 'translateY(-2px)'
                        },
                        '&:active': {
                            transform: 'translateY(0)'
                        }
                    }}
                >
                    Explore All Best Sellers
                </Button>
            </Box>
        </Box>
    );
};

export default BestSellerSection;
