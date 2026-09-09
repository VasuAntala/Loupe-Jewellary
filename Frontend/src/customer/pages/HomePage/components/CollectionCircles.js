import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
    { name: "RINGS", image: "/product/product4.jpeg", hoverImage: "/product/product4.jpeg", id: "rings" },
    { name: "EARRINGS", image: "/product/_.jpeg", hoverImage: "/product/_.jpeg", id: "earrings" },
    { name: "NECKLACES", image: "/product/Necklace.jpeg", hoverImage: "/product/Necklace.jpeg", id: "necklaces" },
    { name: "PENDANTS", image: "/product/product7.jpeg", hoverImage: "/product/product7.jpeg", id: "pendants" },
    { name: "BRACELETS", image: "/product/product 2.png", hoverImage: "/product/product 2.png", id: "bracelets" },
    { name: "BANGLES", image: "/product/product 3.png", hoverImage: "/product/product 3.png", id: "bangles" },
    { name: "MANGALSUTRA", image: "/product/product5.jpeg", hoverImage: "/product/product5.jpeg", id: "mangalsutra" },
    { name: "CHAINS", image: "/product/product 3.png", hoverImage: "/product/product 3.png", id: "chains" },
    { name: "LOCKETS", image: "/product/product7.jpeg", hoverImage: "/product/product7.jpeg", id: "lockets" },
    { name: "ANKLETS", image: "/product/product5.jpeg", hoverImage: "/product/product5.jpeg", id: "anklets" },
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
        <Box className="no-scrollbar" sx={{ pt: 3, pb: 8, bgcolor: '#ffffff', overflow: 'hidden', overflowY: 'hidden' }}>
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
                                '&:hover .main-img': { opacity: 0 },
                                '&:hover .hover-img': { opacity: 1, transform: 'scale(1.05)' }
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
                                    p: 1,
                                    position: 'relative'
                                }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="main-img w-full h-full object-cover rounded-full transition-all duration-500 absolute top-0 left-0"
                                    style={{ padding: '8px' }}
                                />
                                <img
                                    src={cat.hoverImage}
                                    alt={`${cat.name} Model`}
                                    className="hover-img w-full h-full object-cover rounded-full transition-all duration-500 absolute top-0 left-0 opacity-0"
                                    style={{ padding: '8px' }}
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
