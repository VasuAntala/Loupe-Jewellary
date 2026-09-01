import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
    { name: "RINGS", image: "/product/product4.jpeg", id: "rings" },
    { name: "EARRINGS", image: "/product/_.jpeg", id: "earrings" },
    { name: "NECKLACES", image: "/product/Necklace.jpeg", id: "necklaces" },
    { name: "PENDANTS", image: "/product/product7.jpeg", id: "pendants" },
    { name: "BRACELETS", image: "/product/product 2.png", id: "bracelets" },
    { name: "BANGLES", image: "/product/product 3.png", id: "bangles" },
    { name: "MANGALSUTRA", image: "/product/product5.jpeg", id: "mangalsutra" },
    { name: "CHARMS", image: "/product/product 3.png", id: "charms" },
    { name: "SOLITAIRES", image: "/product/product7.jpeg", id: "solitaires" },
    { name: "GOLD COINS", image: "/product/product5.jpeg", id: "gold-coins" },
];

const CollectionCircles = () => {
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 3000,
        autoplaySpeed: 0,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };

    return (
        <Box className="no-scrollbar" sx={{ py: 10, bgcolor: '#ffffff', overflow: 'hidden', overflowY: 'hidden' }}>
            <div className="max-w-[1600px] mx-auto no-scrollbar" style={{ overflowY: 'hidden' }}>
                <Slider {...settings}>
                    {categories.map((cat, i) => (
                        <Box
                            key={i}
                            sx={{
                                px: 2,
                                display: 'flex !important',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover img': { transform: 'scale(1.05)' }
                            }}
                            onClick={() => navigate(`/all-jewellery/category/${cat.id}`)}
                        >
                            <Box
                                sx={{
                                    width: { xs: 150, md: 190 },
                                    height: { xs: 150, md: 190 },
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    mb: 2,
                                    border: '1px solid #f1f5f9',
                                    bgcolor: '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 1
                                }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover rounded-full transition-transform duration-500"
                                />
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 900,
                                    letterSpacing: 2,
                                    color: '#3c7399',
                                    textAlign: 'center',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {cat.name}
                            </Typography>
                        </Box>
                    ))}
                </Slider>
            </div>
        </Box>
    );
};

export default CollectionCircles;
