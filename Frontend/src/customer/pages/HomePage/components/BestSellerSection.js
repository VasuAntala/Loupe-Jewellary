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
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            right: { xs: 0, md: 12 },
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
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            left: { xs: 0, md: 12 },
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
        slidesToShow: products.length > 0 ? Math.min(4, products.length) : 3,
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
                settings: { slidesToShow: Math.min(3, products.length) }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: Math.min(2, products.length) }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: Math.min(2, products.length) }
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

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative">
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
                        bgcolor: '#3c7399',
                        color: '#ffffff',
                        px: { xs: 4, sm: 6 },
                        py: { xs: 1.5, sm: 1.8 },
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 15px rgba(60, 115, 153, 0.25)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            bgcolor: '#2c5775',
                            boxShadow: '0 8px 25px rgba(60, 115, 153, 0.4)',
                            transform: 'translateY(-2px)'
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
