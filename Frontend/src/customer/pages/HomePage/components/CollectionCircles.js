import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const categories = [
    {
        name: 'RINGS',
        image: '/product/collectioncircle_ringmain.jpg',
        hoverImage: '/product/collectioncircle_ring.png',
        id: 'rings',
    },
    {
        name: 'EARRINGS',
        image: '/product/earring-1.jpg',
        hoverImage: '/product/collectioncircle_earring.png',
        id: 'earrings',
    },
    {
        name: 'NECKLACES',
        image: '/product/necklace-1.jpg',
        hoverImage: '/product/model-necklace.jpg',
        id: 'necklaces',
    },
    {
        name: 'PENDANTS',
        image: '/product/collectioncircle_pendent1.jpg',
        hoverImage: '/product/collectioncircle_pendent.png',
        id: 'pendants',
    },
    {
        name: 'BRACELETS',
        image: '/product/bracelet-1.jpg',
        hoverImage: '/product/collectioncircle_bracalet.png',
        id: 'bracelets',
    },
    {
        name: 'CHAINS',
        image: '/product/necklace-1.jpg',
        hoverImage: '/product/model-chain.jpg',
        id: 'chains',
    },
];

const CollectionCircles = () => {
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 3500,
        autoplaySpeed: 0,
        cssEase: 'linear',
        arrows: false,
        pauseOnHover: true,
        swipeToSlide: true,

        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3.5,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3.2,
                },
            },
        ],
    };

    return (
        <Box
            sx={{
                pt: { xs: 2, md: 3 },
                pb: { xs: 4, md: 8 },
                bgcolor: '#ffffff',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    maxWidth: '1600px',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 4, lg: 6 },
                }}
            >
                <Slider {...settings}>
                    {categories.map((cat, i) => (
                        <Box
                            key={i}
                            onClick={() =>
                                navigate(`/all-jewellery/category/${cat.id}`)
                            }
                            sx={{
                                px: { xs: 0.5, sm: 1, md: 2 },
                                display: 'flex !important',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',

                                '&:hover .main-img': {
                                    opacity: 0,
                                    transform: 'scale(0.95)',
                                },

                                '&:hover .hover-img': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                },

                                '&:hover .circle-wrapper': {
                                    borderColor: '#3c7399',
                                    boxShadow:
                                        '0 8px 25px rgba(60,115,153,0.25)',
                                },
                            }}
                        >
                            {/* Circle */}
                            <Box
                                className="circle-wrapper"
                                sx={{
                                    width: {
                                        xs: 85,
                                        sm: 115,
                                        md: 160,
                                    },
                                    height: {
                                        xs: 85,
                                        sm: 115,
                                        md: 160,
                                    },

                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    mb: { xs: 1, md: 2 },

                                    border: '2px solid #edf2f7',
                                    bgcolor: '#ffffff',

                                    boxShadow:
                                        '0 4px 15px rgba(0,0,0,0.04)',

                                    position: 'relative',

                                    transition:
                                        'border-color 0.4s ease, box-shadow 0.4s ease',
                                }}
                            >
                                {/* Normal Product Image */}
                                <Box
                                    component="img"
                                    src={cat.image}
                                    alt={cat.name}
                                    className="main-img"
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,

                                        width: '100%',
                                        height: '100%',

                                        objectFit: 'contain',

                                        p: { xs: 1, sm: 1.5, md: 2 },

                                        opacity: 1,

                                        transform: 'scale(1)',

                                        transition:
                                            'opacity 0.45s ease, transform 0.45s ease',

                                        zIndex: 1,
                                    }}
                                />

                                {/* Hover Model Image */}
                                <Box
                                    component="img"
                                    src={cat.hoverImage}
                                    alt={`${cat.name} Model`}
                                    className="hover-img"
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,

                                        width: '100%',
                                        height: '100%',

                                        objectFit: 'cover',

                                        opacity: 0,

                                        transform: 'scale(1.05)',

                                        transition:
                                            'opacity 0.45s ease, transform 0.45s ease',

                                        zIndex: 2,
                                    }}
                                    onError={(e) => {
                                        console.error(
                                            `Hover image not found: ${cat.hoverImage}`
                                        );
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </Box>

                            {/* Category Name */}
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: '0.62rem',
                                        sm: '0.7rem',
                                    },
                                    fontWeight: 800,
                                    letterSpacing: {
                                        xs: 1,
                                        sm: 2,
                                    },
                                    color: '#3c7399',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {cat.name}
                            </Typography>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Box>
    );
};

export default CollectionCircles;