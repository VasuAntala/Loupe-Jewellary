import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const faqs = [
    {
        question: "Are your diamonds certified?",
        answer: "Yes, all our diamonds are rigorously evaluated and certified by independent, world-renowned laboratories such as GIA and IGI. Every diamond purchase includes its original certification document to guarantee authenticity and quality."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Currently, our primary focus is domestic delivery to ensure the highest standards of security and speed. However, we do accommodate bespoke international requests. Please contact our dedicated concierge team to arrange a secure international shipment."
    },
    {
        question: "Can I customize a piece of jewellery?",
        answer: "Absolutely. Bespoke creations are at the heart of what we do. You can schedule a private consultation with our master artisans and design experts to bring your unique vision to life, from initial sketch to final polish."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a complimentary 15-day return window for most items. To qualify, the piece must be unworn, in pristine condition, and accompanied by all original documentation and packaging. Please note that bespoke and personalized items are uniquely yours and non-returnable."
    },
    {
        question: "How do I care for my jewellery?",
        answer: "To maintain the brilliance of your pieces, we recommend gently cleaning them with mild soapy water and a soft-bristled brush. Avoid exposure to harsh chemicals, cosmetics, and extreme temperatures. When not being worn, store your jewellery individually in its original presentation box or a fabric-lined pouch."
    }
];

const FAQSection = () => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ py: { xs: 10, md: 16 }, px: 3, bgcolor: '#ffffff' }}>
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                <Typography 
                    variant="h2" 
                    sx={{ 
                        fontSize: { xs: '2.2rem', md: '3.5rem' }, 
                        fontWeight: 300, 
                        textAlign: 'center', 
                        color: '#3c7399', 
                        mb: 2,
                        fontFamily: 'serif',
                        letterSpacing: 1
                    }}
                >
                    Frequently Asked Questions
                </Typography>
                <Typography 
                    sx={{ 
                        textAlign: 'center', 
                        color: '#64748b', 
                        mb: 8, 
                        fontSize: '1.1rem',
                        maxWidth: 600,
                        mx: 'auto'
                    }}
                >
                    Everything you need to know about our collections, services, and policies.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {faqs.map((faq, index) => (
                        <Accordion 
                            key={index} 
                            expanded={expanded === `panel${index}`} 
                            onChange={handleChange(`panel${index}`)}
                            disableGutters
                            elevation={0}
                            sx={{ 
                                bgcolor: 'transparent', 
                                '&:before': { display: 'none' },
                                borderBottom: '1px solid rgba(60, 115, 153, 0.15)',
                                borderRadius: 0,
                                transition: 'all 0.3s ease',
                                '&.Mui-expanded': {
                                    margin: 0,
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    expanded === `panel${index}` 
                                        ? <RemoveIcon sx={{ color: '#3c7399', fontSize: '1.5rem' }} /> 
                                        : <AddIcon sx={{ color: '#3c7399', fontSize: '1.5rem' }} />
                                }
                                aria-controls={`panel${index}bh-content`}
                                id={`panel${index}bh-header`}
                                sx={{ 
                                    px: 0, 
                                    py: 2,
                                    '& .MuiAccordionSummary-content': {
                                        margin: 0,
                                        '&.Mui-expanded': { margin: 0 }
                                    }
                                }}
                            >
                                <Typography 
                                    sx={{ 
                                        fontWeight: 500, 
                                        color: expanded === `panel${index}` ? '#3c7399' : '#1e293b', 
                                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                                        transition: 'color 0.3s ease',
                                        fontFamily: 'sans-serif',
                                        letterSpacing: 0.5
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pb: 4, pt: 1 }}>
                                <Typography 
                                    sx={{ 
                                        color: '#475569', 
                                        lineHeight: 1.9, 
                                        fontSize: '1.05rem',
                                        maxWidth: '90%'
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default FAQSection;
