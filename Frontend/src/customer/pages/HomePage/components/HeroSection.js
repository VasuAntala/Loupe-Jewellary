import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <Box
            component="section"
            onClick={() => navigate('/all-jewellery')}
            sx={{
                width: '100%',
                // Header is 108px (notice marquee + navbar).
                // calc(100vh - 108px) fills the exact visible screen height with ZERO space at the bottom
                height: { 
                    xs: '340px', 
                    sm: 'calc(100vh - 108px)', 
                    md: 'calc(100vh - 108px)' 
                },
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                bgcolor: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box
                component="img"
                src="/loupe-banner.png"
                alt="B.Brother Loupe - Crafted to Perfection. Made to Be Yours."
                sx={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                        opacity: 0.97,
                    }
                }}
            />
        </Box>
    );
};

export default HeroSection;
