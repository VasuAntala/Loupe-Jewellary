import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_URL, API_BASE_URL } from '../../../../config/apiConfig';
import { formatPriceRange, openWhatsApp } from '../../../../utils/whatsapp';

const WA_ICON = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const renderOldPrice = (oldPrice) => {
    if (!oldPrice) return null;
    const str = String(oldPrice).trim();
    return str.startsWith('₹') ? str : `₹${str}`;
};

const NextArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: 'absolute', right: { xs: 0, md: -20 }, top: '45%',
            transform: 'translateY(-50%)', zIndex: 10, bgcolor: 'white', color: '#3c7399',
            width: 40, height: 40, boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: '#f8fafc' }, transition: 'all 0.3s'
        }}
    >
        <ChevronRight size={20} />
    </IconButton>
);

const PrevArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: 'absolute', left: { xs: 0, md: -20 }, top: '45%',
            transform: 'translateY(-50%)', zIndex: 10, bgcolor: 'white', color: '#3c7399',
            width: 40, height: 40, boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: '#f8fafc' }, transition: 'all 0.3s'
        }}
    >
        <ChevronLeft size={20} />
    </IconButton>
);

const PerfectSparkleSection = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/sparkle-videos`)
            .then(res => res.json())
            .then(data => setVideos(Array.isArray(data) ? data : []))
            .catch(() => setVideos([]))
            .finally(() => setLoading(false));
    }, []);

    const handleWhatsAppInquiry = (video) => {
        openWhatsApp({
            title: video.title,
            minPrice: video.minPrice,
            maxPrice: video.maxPrice,
            productCode: video._id ? video._id.slice(-6).toUpperCase() : null
        });
    };

    const settings = {
        dots: false,
        infinite: videos.length >= 4,  // only loop when enough slides to fill the row
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        rows: 1,           // prevent react-slick from ever wrapping into multiple rows
        slidesPerRow: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3, rows: 1, slidesPerRow: 1, infinite: videos.length >= 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2, rows: 1, slidesPerRow: 1, infinite: videos.length >= 2 } },
            { breakpoint: 640,  settings: { slidesToShow: 1, rows: 1, slidesPerRow: 1, infinite: videos.length >= 1 } }
        ]
    };

    return (
        <Box sx={{ py: 6, bgcolor: '#ffffff' }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    sx={{
                        fontSize: { xs: '1.2rem', md: '1.8rem' }, fontWeight: 300,
                        fontFamily: "'Playfair Display', serif", letterSpacing: 2,
                        color: '#3c7399', mb: 2, textTransform: 'uppercase'
                    }}
                >
                    FIND YOUR PERFECT SPARKLE
                </Typography>
            </Box>

            <div className="max-w-[1400px] mx-auto px-10 relative">
                {loading ? (
                    /* Loading skeleton */
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        {[1, 2, 3, 4].map(i => (
                            <Box key={i} sx={{ flex: 1 }}>
                                <Skeleton variant="rectangular" sx={{ borderRadius: '12px', aspectRatio: '3/4', mb: 1.5 }} />
                                <Skeleton width="60%" height={18} sx={{ mb: 0.5 }} />
                                <Skeleton width="80%" height={14} />
                            </Box>
                        ))}
                    </Box>
                ) : videos.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>
                            No sparkle videos yet. Add some from the Admin panel.
                        </Typography>
                    </Box>
                ) : (
                    <Slider {...settings}>
                        {videos.map((video) => {
                            const priceRange = formatPriceRange(video.minPrice, video.maxPrice);
                            const displayPrice = priceRange || (video.price ? (String(video.price).startsWith('₹') ? video.price : `₹${video.price}`) : 'Price on Request');

                            return (
                                <div key={video._id} className="px-3">
                                    <div
                                        onClick={() => handleWhatsAppInquiry(video)}
                                        className="flex flex-col bg-white rounded-2xl p-2.5 transition-all duration-300 hover:shadow-lg border border-slate-100/60 cursor-pointer group"
                                    >
                                        {/* Cloudinary Video — delivered at best quality via q_auto:best,vc_auto in URL */}
                                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#e0f2fe] mb-3">
                                            <video
                                                src={video.videoUrl}
                                                autoPlay loop muted playsInline
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="flex flex-col text-left px-1">
                                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">
                                                Approx. Price
                                            </span>
                                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                                <span className="text-[#3c7399] font-bold text-sm md:text-base leading-tight">
                                                    {displayPrice}
                                                </span>
                                                {video.oldPrice && (
                                                    <span className="text-gray-400 line-through text-xs">
                                                        {renderOldPrice(video.oldPrice)}
                                                    </span>
                                                )}
                                                {video.discount && (
                                                    <span className="text-[#059669] bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                                                        {video.discount}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-gray-600 font-medium text-xs md:text-sm truncate mb-3" title={video.title}>
                                                {video.title}
                                            </span>

                                            {/* WhatsApp CTA button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWhatsAppInquiry(video);
                                                }}
                                                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-white text-[0.72rem] font-bold uppercase tracking-wider transition-all duration-300 hover:brightness-105 active:scale-95 shadow-sm"
                                                style={{
                                                    background: 'linear-gradient(135deg, #25D366, #1ebe5a)',
                                                    boxShadow: '0 4px 10px rgba(37,211,102,0.25)',
                                                }}
                                            >
                                                {WA_ICON}
                                                Inquire on WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                )}
            </div>
        </Box>
    );
};

export default PerfectSparkleSection;

