import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <Box
            onClick={() => navigate('/all-jewellery')}
            sx={{
                width: '100%',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                bgcolor: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
        >
            <Box
                component="img"
                src="/hero_banner.png"
                alt="B.Brother Loupe - Crafted to Perfection. Made to Be Yours."
                sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: { xs: 'auto', sm: '75vh', md: '85vh', lg: '90vh' },
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                        transform: 'scale(1.008)',
                    }
                }}
            />
        </Box>
    );
};

export default HeroSection;
