import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Tooltip, IconButton, Box } from '@mui/material';

const WhatsAppContact = () => {
    const phoneNumber = "919909109074"; // Verified contact number
    const message = encodeURIComponent("Hello Loupe Jewellery! I'm interested in your collections.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 2
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            sx={{
                position: 'fixed',
                bottom: { xs: '18px', sm: '30px' },
                right: { xs: '18px', sm: '30px' },
                zIndex: 1000
            }}
        >
            <Tooltip title="Chat with Expertise" placement="left" arrow>
                <IconButton
                    component="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        width: { xs: 50, sm: 65 },
                        height: { xs: 50, sm: 65 },
                        bgcolor: '#25D366',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4)',
                        border: { xs: '3px solid white', sm: '4px solid white' },
                        '&:hover': {
                            bgcolor: '#128C7E',
                            boxShadow: '0 12px 40px rgba(37, 211, 102, 0.6)',
                        }
                    }}
                >
                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '26px' }}></i>
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default WhatsAppContact;
