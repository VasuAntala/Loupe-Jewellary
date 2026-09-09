import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    avatar: 'PS',
    rating: 5,
    title: 'Absolutely Breathtaking Craftsmanship',
    review:
      'I ordered the diamond pendant for my anniversary and was truly impressed. The craftsmanship is beautiful, every detail feels carefully finished, and the packaging made the experience feel wonderfully luxurious.',
    date: 'August 2025',
    avatarBg: '#3c7399',
  },
  {
    id: 2,
    name: 'Rohit Mehta',
    location: 'Ahmedabad, Gujarat',
    avatar: 'RM',
    rating: 5,
    title: 'A Gift She Will Never Forget',
    review:
      'I purchased a gold bangle set for my wife on our anniversary, and she absolutely loved it. The finish is impeccable and the jewellery feels premium. A wonderful experience from ordering to delivery.',
    date: 'July 2025',
    avatarBg: '#1e3545',
  },
  {
    id: 3,
    name: 'Ananya Krishnan',
    location: 'Chennai, Tamil Nadu',
    avatar: 'AK',
    rating: 5,
    title: 'Unmatched Quality & Elegance',
    review:
      'Loupe truly stands apart in quality and design. The diamond earrings I purchased sparkle beautifully and look even better in person. The GIA certification and responsive customer service gave me complete confidence.',
    date: 'June 2025',
    avatarBg: '#5a9bc2',
  },
  {
    id: 4,
    name: 'Vikram Singhania',
    location: 'Delhi, NCR',
    avatar: 'VS',
    rating: 5,
    title: 'Premium Experience From Start to Finish',
    review:
      'Every part of my experience with Loupe felt premium, from browsing the website to receiving the ring. The bespoke consultation was smooth, and the final piece exceeded my expectations. My fiancee absolutely loved it.',
    date: 'May 2025',
    avatarBg: '#2d6a9f',
  },
  {
    id: 5,
    name: 'Kavitha Nair',
    location: 'Kochi, Kerala',
    avatar: 'KN',
    rating: 5,
    title: 'Stunning Bridal Collection',
    review:
      'I chose Loupe for my bridal jewellery and could not be happier. The necklace and earrings were elegant, beautifully crafted, and became one of the highlights of my wedding day. I received so many compliments.',
    date: 'April 2025',
    avatarBg: '#4a8ab5',
  },
  {
    id: 6,
    name: 'Arjun Desai',
    location: 'Pune, Maharashtra',
    avatar: 'AD',
    rating: 5,
    title: 'Worth Every Rupee & More',
    review:
      'I gifted a sapphire bracelet to my mother for her birthday, and she loved it. The stones are vivid, the setting feels secure, and the overall design is elegant. Loupe beautifully blends traditional craftsmanship with modern style.',
    date: 'March 2025',
    avatarBg: '#356b90',
  },
];

const StarRating = ({ rating }) => (
  <Box sx={{ display: 'flex', gap: 0.3 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        sx={{
          fontSize: '1.1rem',
          color: star <= rating ? '#D4AF37' : '#e0e0e0',
          filter: star <= rating ? 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' : 'none',
          transition: 'all 0.3s ease',
        }}
      />
    ))}
  </Box>
);

const ReviewCard = ({ review, index }) => (
  <Box
    sx={{
      position: 'relative',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(169, 206, 229, 0.3)',
      borderRadius: '20px',
      p: { xs: 3, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: '0 4px 24px rgba(60,115,153,0.07)',
      overflow: 'hidden',
      animation: `reviewFadeUp 0.6s ease-out ${index * 0.1}s both`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #3c7399, #a9cee5, #D4AF37)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        borderRadius: '20px 20px 0 0',
      },
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 60px rgba(60,115,153,0.16)',
        border: '1px solid rgba(169, 206, 229, 0.6)',
        '&::before': { opacity: 1 },
      },
    }}
  >
    {/* Quote Icon */}
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 20,
        color: 'rgba(169, 206, 229, 0.35)',
        lineHeight: 0,
      }}
    >
      <FormatQuoteIcon sx={{ fontSize: '4rem' }} />
    </Box>

    {/* Stars */}
    <StarRating rating={review.rating} />

    {/* Review Title */}
    <Typography
      sx={{
        fontFamily: 'Georgia, serif',
        fontSize: { xs: '1rem', md: '1.1rem' },
        fontWeight: 600,
        color: '#1e3545',
        lineHeight: 1.4,
        letterSpacing: 0.3,
      }}
    >
      "{review.title}"
    </Typography>

    {/* Review Text */}
    <Typography
      sx={{
        color: '#4a5568',
        fontSize: { xs: '0.88rem', md: '0.93rem' },
        lineHeight: 1.85,
        flexGrow: 1,
        fontFamily: 'Poppins, sans-serif',
        fontStyle: 'italic',
      }}
    >
      {review.review}
    </Typography>

    {/* Divider */}
    <Box
      sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(169,206,229,0.5), transparent)',
      }}
    />

    {/* Reviewer Info */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          bgcolor: review.avatarBg,
          width: 46,
          height: 46,
          fontSize: '0.85rem',
          fontWeight: 700,
          fontFamily: 'Poppins, sans-serif',
          boxShadow: `0 0 0 3px rgba(255,255,255,1), 0 0 0 5px ${review.avatarBg}55`,
          letterSpacing: 0.5,
        }}
      >
        {review.avatar}
      </Avatar>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#1e3545',
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: 0.3,
          }}
        >
          {review.name}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.78rem',
            color: '#3c7399',
            fontFamily: 'Poppins, sans-serif',
            opacity: 0.85,
          }}
        >
          {review.location} · {review.date}
        </Typography>
      </Box>
      {/* Verified Badge */}
      <Box
        sx={{
          ml: 'auto',
          background: 'linear-gradient(135deg, #e8f5e9, #f0fff4)',
          border: '1px solid rgba(76,175,80,0.25)',
          borderRadius: '20px',
          px: 1.5,
          py: 0.4,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: '#4caf50',
            boxShadow: '0 0 6px rgba(76,175,80,0.5)',
          }}
        />
        <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32', fontWeight: 600, letterSpacing: 0.3 }}>
          Verified
        </Typography>
      </Box>
    </Box>
  </Box>
);

const CustomerReviews = () => {
  const totalRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        px: { xs: 2, sm: 4, md: 6 },
        background: 'linear-gradient(160deg, #f0f7fc 0%, #fdfcf7 40%, #f0f7fc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(169,206,229,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          {/* Eyebrow Label */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'linear-gradient(135deg, rgba(60,115,153,0.08), rgba(212,175,55,0.08))',
              border: '1px solid rgba(60,115,153,0.15)',
              borderRadius: '40px',
              px: 3,
              py: 0.8,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} sx={{ fontSize: '0.9rem', color: '#D4AF37' }} />
              ))}
            </Box>
            <Typography
              sx={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#3c7399',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Customer Stories
            </Typography>
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.4rem' },
              fontWeight: 300,
              fontFamily: 'Georgia, serif',
              color: '#1e3545',
              letterSpacing: 1,
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Loved Across{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #3c7399, #a9cee5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              India
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.8,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Real experiences from our cherished customers who found their perfect piece with us.
          </Typography>
        </Box>

        {/* Reviews Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </Box>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 } }}>
          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#64748b',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Join thousands of happy customers across India.{' '}
            <Box
              component="span"
              sx={{
                color: '#3c7399',
                fontWeight: 600,
                borderBottom: '1px solid rgba(60,115,153,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { borderBottomColor: '#3c7399' },
              }}
            >
              Share your story →
            </Box>
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes reviewFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default CustomerReviews;
