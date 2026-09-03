import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Popover,
    CircularProgress,
    Tooltip,
    IconButton,
} from '@mui/material';
import { RefreshCw, TrendingUp, TrendingDown, Minus, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REFRESH_INTERVAL = 60; // seconds

const GoldPriceBadge = () => {
    const [goldData, setGoldData] = useState(null);
    const [prevPrice, setPrevPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const goldDataRef = useRef(null);

    const fetchGoldPrice = async (manual = false) => {
        if (manual) setIsRefreshing(true);
        else setLoading(true);
        setError(false);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5455';
            const res = await fetch(`${API_BASE_URL}/api/gold-price`);
            const data = await res.json();
            if (!data || data.error) throw new Error(data?.error || 'Invalid response');
            if (goldDataRef.current) setPrevPrice(goldDataRef.current.pricePerGram24k);
            goldDataRef.current = data;
            setGoldData(data);
            setLastUpdated(new Date());
            setCountdown(REFRESH_INTERVAL);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchGoldPrice(); /* eslint-disable-next-line */ }, []);
    useEffect(() => {
        const interval = setInterval(() => fetchGoldPrice(), REFRESH_INTERVAL * 1000);
        return () => clearInterval(interval);
        /* eslint-disable-next-line */
    }, []);
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const trend =
        goldData && prevPrice
            ? goldData.pricePerGram24k > prevPrice ? 'up'
                : goldData.pricePerGram24k < prevPrice ? 'down' : 'flat'
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

    const open = Boolean(anchorEl);

    return (
        <>
            {/* ─── Compact Pill Badge ─── */}
            <Tooltip title="Live Gold Rates — click to expand" placement="bottom">
                <Box
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        px: 1.6,
                        py: 0.7,
                        borderRadius: '50px',
                        background: 'linear-gradient(135deg, #1a1008 0%, #2d1f0a 100%)',
                        border: '1px solid rgba(212,175,55,0.35)',
                        boxShadow: '0 2px 12px rgba(212,175,55,0.18), inset 0 1px 0 rgba(212,175,55,0.12)',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                            border: '1px solid rgba(212,175,55,0.65)',
                            boxShadow: '0 4px 20px rgba(212,175,55,0.30)',
                            transform: 'translateY(-1px)',
                        },
                        userSelect: 'none',
                    }}
                >
                    {/* Gold coin emoji */}
                    <Typography sx={{ fontSize: '0.82rem', lineHeight: 1 }}>🥇</Typography>

                    {loading ? (
                        <CircularProgress size={12} sx={{ color: '#d4af37' }} />
                    ) : error ? (
                        <Typography sx={{ color: '#f43f5e', fontSize: '0.72rem', fontWeight: 700 }}>
                            —
                        </Typography>
                    ) : goldData ? (
                        <>
                            <Typography
                                sx={{
                                    color: '#f5d060',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    fontFamily: "'Outfit', sans-serif",
                                    letterSpacing: 0.3,
                                    lineHeight: 1,
                                }}
                            >
                                ₹{goldData.pricePerGram24k.toLocaleString('en-IN')}
                            </Typography>
                            <Typography sx={{ color: 'rgba(212,175,55,0.55)', fontSize: '0.65rem', fontWeight: 600 }}>
                                /g
                            </Typography>
                            <TrendIcon size={12} color={trendColor} />
                        </>
                    ) : null}
                </Box>
            </Tooltip>

            {/* ─── Full-Detail Popover ─── */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1a1008 0%, #2d1f0a 50%, #1a1008 100%)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(212,175,55,0.15)',
                        width: 300,
                        position: 'relative',
                    }
                }}
            >
                {/* Decorative glow */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Box sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
                    {/* Popover Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #f5d060 50%, #d4af37 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(212,175,55,0.4)', fontSize: '1rem', flexShrink: 0 }}>
                                🥇
                            </Box>
                            <Box>
                                <Typography sx={{ color: '#d4af37', fontWeight: 800, fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase' }}>
                                    Live Gold Price
                                </Typography>
                                <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.68rem', fontWeight: 500 }}>
                                    Rate per gram · India
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {!loading && !error && goldData && (
                                <Tooltip title={`Auto-refreshes in ${countdown}s`}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, bgcolor: 'rgba(212,175,55,0.08)', borderRadius: '20px', px: 1.2, py: 0.4 }}>
                                        <Clock size={10} color="rgba(212,175,55,0.5)" />
                                        <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.65rem', fontWeight: 600 }}>
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
                                        sx={{ color: '#d4af37', p: 0.5, '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' } }}
                                    >
                                        <RefreshCw size={14} style={{ animation: isRefreshing ? 'gold-spin 1s linear infinite' : 'none' }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <IconButton
                                size="small"
                                onClick={() => setAnchorEl(null)}
                                sx={{ color: 'rgba(212,175,55,0.4)', p: 0.5, '&:hover': { bgcolor: 'rgba(212,175,55,0.1)', color: '#d4af37' } }}
                            >
                                <X size={14} />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Body */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1.5 }}>
                                    <CircularProgress size={28} sx={{ color: '#d4af37' }} />
                                    <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.78rem' }}>
                                        Fetching live rates…
                                    </Typography>
                                </Box>
                            </motion.div>
                        ) : error ? (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <Typography sx={{ color: '#f43f5e', fontSize: '0.82rem', mb: 0.8 }}>
                                        ⚠️ Could not fetch live price
                                    </Typography>
                                    <Typography
                                        onClick={() => fetchGoldPrice(true)}
                                        sx={{ color: '#d4af37', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Tap to retry
                                    </Typography>
                                </Box>
                            </motion.div>
                        ) : goldData ? (
                            <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Hero 24K price */}
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-end', gap: 1.2 }}>
                                    <Box>
                                        <Typography sx={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.67rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', mb: 0.3 }}>
                                            24K · per gram
                                        </Typography>
                                        <motion.div
                                            key={goldData.pricePerGram24k}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.35 }}
                                        >
                                            <Typography sx={{ color: '#f5d060', fontWeight: 800, fontSize: '2rem', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                                                ₹{goldData.pricePerGram24k.toLocaleString('en-IN')}
                                            </Typography>
                                        </motion.div>
                                    </Box>
                                    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                        <TrendIcon size={16} color={trendColor} />
                                        {trend !== 'flat' && (
                                            <Typography sx={{ color: trendColor, fontSize: '0.7rem', fontWeight: 700 }}>
                                                {trend === 'up' ? 'Rising' : 'Falling'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ height: '1px', bgcolor: 'rgba(212,175,55,0.12)', mb: 2 }} />

                                {/* Karat Rows */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2 }}>
                                    {karatRows.map((row) => (
                                        <Box
                                            key={row.label}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                bgcolor: row.highlight ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                                                borderRadius: '10px',
                                                px: 1.8,
                                                py: 1,
                                                border: row.highlight ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: row.highlight ? '#d4af37' : 'rgba(212,175,55,0.3)' }} />
                                                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.82rem' }}>
                                                    {row.label}
                                                </Typography>
                                                <Typography sx={{ color: 'rgba(212,175,55,0.4)', fontSize: '0.65rem', bgcolor: 'rgba(212,175,55,0.07)', px: 0.7, py: 0.2, borderRadius: '5px' }}>
                                                    {row.purity}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ color: row.highlight ? '#f5d060' : 'rgba(255,255,255,0.7)', fontWeight: row.highlight ? 800 : 600, fontSize: row.highlight ? '0.95rem' : '0.85rem', fontFamily: "'Outfit', sans-serif" }}>
                                                ₹{row.value.toLocaleString('en-IN')}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Footer */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                                    <Typography sx={{ color: 'rgba(212,175,55,0.35)', fontSize: '0.62rem' }}>
                                        XAU/USD ${goldData.usdPerOz} · 1 USD = ₹{goldData.usdToInr}
                                    </Typography>
                                    {lastUpdated && (
                                        <Typography sx={{ color: 'rgba(212,175,55,0.35)', fontSize: '0.62rem' }}>
                                            {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </Typography>
                                    )}
                                </Box>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </Box>

                <style>{`@keyframes gold-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </Popover>
        </>
    );
};

export default GoldPriceBadge;
