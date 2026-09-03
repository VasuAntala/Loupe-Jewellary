import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Tooltip, IconButton } from '@mui/material';
import { RefreshCw, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REFRESH_INTERVAL = 60; // seconds

const GoldPriceWidget = () => {
    const [goldData, setGoldData] = useState(null);
    const [prevPrice, setPrevPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Use a ref so we don't need goldData in the dependency array
    const goldDataRef = useRef(null);

    const fetchGoldPrice = async (manual = false) => {
        if (manual) setIsRefreshing(true);
        else setLoading(true);
        setError(false);

        try {
            // Fetch via backend proxy to avoid CORS restrictions
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5455';
            const goldRes = await fetch(`${API_BASE_URL}/api/gold-price`);
            const data = await goldRes.json();

            if (!data || data.error) throw new Error(data?.error || 'Invalid response');

            // Save previous price from ref before updating
            if (goldDataRef.current) {
                setPrevPrice(goldDataRef.current.pricePerGram24k);
            }

            goldDataRef.current = data;
            setGoldData(data);
            setLastUpdated(new Date());
            setCountdown(REFRESH_INTERVAL);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchGoldPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => fetchGoldPrice(), REFRESH_INTERVAL * 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const trend =
        goldData && prevPrice
            ? goldData.pricePerGram24k > prevPrice
                ? 'up'
                : goldData.pricePerGram24k < prevPrice
                    ? 'down'
                    : 'flat'
            : 'flat';

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#f43f5e' : '#94a3b8';

    const karatRows = goldData
        ? [
            { label: '24K Gold', value: goldData.pricePerGram24k, purity: '99.9%', highlight: true },
            { label: '22K Gold', value: goldData.pricePerGram22k, purity: '91.6%', highlight: false },
            { label: '18K Gold', value: goldData.pricePerGram18k, purity: '75.0%', highlight: false },
        ]
        : [];

    const showData = !loading && !error && goldData !== null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1a1008 0%, #2d1f0a 50%, #1a1008 100%)',
                    borderRadius: '24px',
                    p: { xs: 2.5, md: 3.5 },
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(212,175,55,0.2)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,175,55,0.15)',
                }}
            >
                {/* Decorative glows */}
                <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #f5d060 50%, #d4af37 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(212,175,55,0.4)', fontSize: '1.2rem', flexShrink: 0 }}>
                            🥇
                        </Box>
                        <Box>
                            <Typography sx={{ color: '#d4af37', fontWeight: 800, fontSize: '0.95rem', letterSpacing: 1, textTransform: 'uppercase' }}>
                                Live Gold Price
                            </Typography>
                            <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.72rem', fontWeight: 500 }}>
                                Rate per gram · India
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {showData && (
                            <Tooltip title={`Auto-refreshes in ${countdown}s`}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(212,175,55,0.08)', borderRadius: '20px', px: 1.5, py: 0.5 }}>
                                    <Clock size={11} color="rgba(212,175,55,0.5)" />
                                    <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.7rem', fontWeight: 600 }}>
                                        {countdown}s
                                    </Typography>
                                </Box>
                            </Tooltip>
                        )}
                        <Tooltip title="Refresh now">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={() => fetchGoldPrice(true)}
                                    disabled={isRefreshing || loading}
                                    sx={{ color: '#d4af37', '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' } }}
                                >
                                    <RefreshCw
                                        size={16}
                                        style={{ animation: isRefreshing ? 'gold-spin 1s linear infinite' : 'none' }}
                                    />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Body */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
                                <CircularProgress size={36} sx={{ color: '#d4af37' }} />
                                <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.8rem' }}>
                                    Fetching live rates…
                                </Typography>
                            </Box>
                        </motion.div>
                    ) : error ? (
                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography sx={{ color: '#f43f5e', fontSize: '0.85rem', mb: 1 }}>
                                    ⚠️ Could not fetch live price
                                </Typography>
                                <Typography
                                    onClick={() => fetchGoldPrice(true)}
                                    sx={{ color: '#d4af37', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Tap to retry
                                </Typography>
                            </Box>
                        </motion.div>
                    ) : showData ? (
                        <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Hero 24K price */}
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                                <Box>
                                    <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', mb: 0.3 }}>
                                        24K · per gram
                                    </Typography>
                                    <motion.div
                                        key={goldData.pricePerGram24k}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Typography sx={{ color: '#f5d060', fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                                            ₹{goldData.pricePerGram24k.toLocaleString('en-IN')}
                                        </Typography>
                                    </motion.div>
                                </Box>
                                <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TrendIcon size={18} color={trendColor} />
                                    {trend !== 'flat' && (
                                        <Typography sx={{ color: trendColor, fontSize: '0.75rem', fontWeight: 700 }}>
                                            {trend === 'up' ? 'Rising' : 'Falling'}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ height: '1px', bgcolor: 'rgba(212,175,55,0.12)', mb: 2.5 }} />

                            {/* Karat rows */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                                {karatRows.map((row) => (
                                    <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: row.highlight ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', px: 2, py: 1.2, border: row.highlight ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: row.highlight ? '#d4af37' : 'rgba(212,175,55,0.3)' }} />
                                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                {row.label}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(212,175,55,0.4)', fontSize: '0.7rem', bgcolor: 'rgba(212,175,55,0.07)', px: 0.8, py: 0.2, borderRadius: '6px' }}>
                                                {row.purity}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ color: row.highlight ? '#f5d060' : 'rgba(255,255,255,0.7)', fontWeight: row.highlight ? 800 : 600, fontSize: row.highlight ? '1rem' : '0.9rem', fontFamily: "'Outfit', sans-serif" }}>
                                            ₹{row.value.toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* Footer */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                                <Typography sx={{ color: 'rgba(212,175,55,0.4)', fontSize: '0.7rem' }}>
                                    XAU/USD ${goldData.usdPerOz} · 1 USD = ₹{goldData.usdToInr}
                                </Typography>
                                {lastUpdated && (
                                    <Typography sx={{ color: 'rgba(212,175,55,0.4)', fontSize: '0.7rem' }}>
                                        {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </Typography>
                                )}
                            </Box>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </Box>

            <style>{`@keyframes gold-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
    );
};

export default GoldPriceWidget;
