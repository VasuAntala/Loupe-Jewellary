import React, { useContext, useEffect, useState } from "react";
import {
  Box, Button, Grid, Typography, Divider,
  Breadcrumbs, Link, IconButton, Collapse, Dialog, Modal,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../../state/product/Action";
import HomeSectionCarousel from "../HomeSectionCarousel/HomeSectionCarousel";
import { RRContext } from "../../../context/rrBox/rrContext";
import RatingReviewForm from "../MyOrders/RatingReviewForm";
import { formatPriceRange, openWhatsApp, buildWhatsAppUrl } from "../../../utils/whatsapp";
import {
  ChevronRight, ChevronDown, ChevronUp,
  ShieldCheck, Truck, RefreshCw, Gift,
  Headset, Video, Package, Star, MessageCircle,
  Share2, Heart, Maximize2, ZoomIn, X, Check,
  Sparkles, Award, Lock, HelpCircle
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function fmtINR(n) {
  if (!n && n !== 0) return null;
  return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function cleanTitle(str) {
  if (!str) return "";
  const half = Math.floor(str.length / 2);
  if (str.length > 10 && str.slice(0, half) === str.slice(half)) {
    return str.slice(0, half);
  }
  return str;
}

const WHATSAPP_SVG = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─────────────────────────────────────────────
   Accordion Component
───────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false, icon }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{
      border: "1px solid #e9eff4",
      borderRadius: "14px",
      overflow: "hidden",
      bgcolor: "white",
      boxShadow: open ? "0 4px 16px rgba(60, 115, 153, 0.06)" : "none",
      transition: "all 0.3s ease"
    }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: 2.8, py: 2, cursor: "pointer", userSelect: "none",
          bgcolor: open ? "#f8fafc" : "white",
          "&:hover": { bgcolor: "#f1f6fa" },
          transition: "background-color 0.2s ease"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {icon}
          <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: "#1e293b", fontFamily: "'Outfit', sans-serif" }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{
          width: 28, height: 28, borderRadius: "50%",
          bgcolor: open ? "#e0eff7" : "#f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.3s ease, background-color 0.2s"
        }}>
          {open ? <ChevronUp size={16} color="#3c7399" /> : <ChevronDown size={16} color="#64748b" />}
        </Box>
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2.8, pb: 2.8, pt: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   Spec Table Row
───────────────────────────────────────────── */
function SpecRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{
      display: "flex", justifyContent: "space-between",
      py: 1.4, borderBottom: "1px dashed #e9eff4",
      "&:last-child": { borderBottom: "none" },
      alignItems: 'center'
    }}>
      <Typography sx={{ fontSize: "0.86rem", color: "#64748b", fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.9rem", color: "#0f172a", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{value}</Typography>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   Metal colour options
───────────────────────────────────────────── */
const METAL_OPTIONS = [
  {
    id: "yellow-gold",
    label: "Yellow Gold",
    short: "Yellow Gold",
    gradient: "radial-gradient(circle at 35% 35%, #fff3b0 0%, #e5b024 45%, #946900 100%)",
    border: "#d49e13",
    glow: "rgba(212,158,19,0.35)",
    tagBg: "#fef8e7",
    textColor: "#926800"
  },
  {
    id: "rose-gold",
    label: "Rose Gold",
    short: "Rose Gold",
    gradient: "radial-gradient(circle at 35% 35%, #ffded6 0%, #d88972 45%, #8c3b28 100%)",
    border: "#c9755f",
    glow: "rgba(201,117,95,0.35)",
    tagBg: "#fdf2ef",
    textColor: "#96432f"
  },
  {
    id: "silver",
    label: "Silver / White Gold",
    short: "Silver / White",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #c0c0c0 45%, #606060 100%)",
    border: "#9ca3af",
    glow: "rgba(156,163,175,0.35)",
    tagBg: "#f8fafc",
    textColor: "#475569"
  },
];

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ProductDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState(METAL_OPTIONS[0]); // default: Yellow Gold
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, showing: false });

  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);
  const modal = useContext(RRContext);

  useEffect(() => {
    dispatch(findProductById({ productId: param.productId }));
    setActiveIndex(0);
  }, [param.productId]);

  const product = products?.product;
  const priceRange = product ? formatPriceRange(product.minPrice, product.maxPrice) : null;
  const images = Array.isArray(product?.imageUrls) ? product.imageUrls : [];

  // When product loads, if yellow-gold has no images but another color does, auto-select it
  useEffect(() => {
    if (images.length > 0) {
      const availableColors = new Set(images.map((img) => img.color || 'yellow-gold'));
      if (!availableColors.has('yellow-gold') && !availableColors.has('gold')) {
        const firstMatch = METAL_OPTIONS.find((m) => {
          if (m.id === 'silver') return availableColors.has('silver') || availableColors.has('white-gold');
          return availableColors.has(m.id);
        });
        if (firstMatch) {
          setSelectedMetal(firstMatch);
        }
      }
    }
  }, [product?._id]);

  const handleSelectMetal = (metal) => {
    setSelectedMetal(metal);
    setActiveIndex(0);
  };

  // ── Visibility flags ──
  const showDiamonds = product?.showDiamondDetails === true;
  const showMetals = product?.showMetalDetails === true;
  const showWeights = product?.showWeightDetails === true;

  // ── Dynamic sections ──
  const hasCategorySpecs = Boolean(
    product?.ringSize || product?.topWidth || product?.shankWidth || product?.topThickness || product?.shankThickness ||
    product?.earringHeight || product?.earringWidth || product?.earringThickness || product?.backFinding ||
    product?.braceletLength || product?.braceletWidth || product?.braceletThickness || product?.claspType ||
    product?.necklaceLength || product?.linkWidth || product?.linkThickness ||
    product?.pendantHeight || product?.pendantWidth ||
    product?.bangleSize || product?.innerDiameter || product?.bangleWidth || product?.isOpenable ||
    product?.mangalsutraLength || product?.blackBeadsRows
  );
  const hasDimensions = (Array.isArray(product?.dimensionsList) && product.dimensionsList.some(d => d.label || d.value)) || hasCategorySpecs;
  const hasDiamonds = showDiamonds && Array.isArray(product?.diamondDetails) && product.diamondDetails.some(d => d.diamondType);
  const hasMetals = showMetals && Array.isArray(product?.metalDetails) && product.metalDetails.some(m => m.metalType);
  const hasAdditionalSpecs = Array.isArray(product?.additionalSpecifications) && product.additionalSpecifications.some(s => s.label);
  const hasChain = product?.includesChain === "Yes" || product?.includesChain === "Optional";

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y, showing: true });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, showing: false }));
  };

  // Build WhatsApp URL injecting chosen metal colour
  const whatsAppHrefWithMetal = (() => {
    try {
      const base = buildWhatsAppUrl(product);
      const url = new URL(base);
      const existing = url.searchParams.get("text") || "";
      const colorLine = `\nMetal Colour Preference: ${selectedMetal.label}`;
      url.searchParams.set("text", existing + colorLine);
      return url.toString();
    } catch {
      return buildWhatsAppUrl(product);
    }
  })();

  if (!product) return null;

  // ── Color-filtered image gallery ──
  const activeColorId = selectedMetal?.id || 'yellow-gold';
  const matchingImages = images.filter((img) => {
    const c = img.color || 'yellow-gold';
    if (activeColorId === 'silver' || activeColorId === 'white-gold') {
      return c === 'silver' || c === 'white-gold';
    }
    if (activeColorId === 'yellow-gold' || activeColorId === 'gold') {
      return c === 'yellow-gold' || c === 'gold';
    }
    return c === activeColorId;
  });

  // If matching images exist for the selected metal color, use them; otherwise fallback gracefully to all images
  const displayImages = matchingImages.length > 0 ? matchingImages : images;
  const currentImg = displayImages[activeIndex] || displayImages[0];
  const currentImgUrl = currentImg?.imageUrl;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", color: "#1e293b" }}>

      {/* ── Breadcrumb Bar ── */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #edf2f7", py: 1.5 }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 5 } }}>
          <Breadcrumbs separator={<ChevronRight size={13} color="#94a3b8" />}>
            <Link underline="hover" href="/" sx={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500, "&:hover": { color: "#3c7399" } }}>Home</Link>
            <Link underline="hover" href="/jewellery" sx={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500, "&:hover": { color: "#3c7399" } }}>Jewellery</Link>
            <Typography sx={{ fontSize: "0.78rem", color: "#3c7399", fontWeight: 700 }}>
              {cleanTitle(product.title)}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* ── Main Workspace ── */}
      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 5 }, pt: 4, pb: 8 }}>

        <Grid container spacing={{ xs: 3, md: 5 }}>

          {/* ═════════════════════════════════════════
              LEFT COLUMN: High-End Image Showcase
             ═════════════════════════════════════════ */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 100 } }}>
              
              <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 2 }}>

                {/* Vertical Thumbnails */}
                {displayImages.length > 1 && (
                  <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: 1.5,
                    width: { xs: "100%", sm: 84 },
                    overflowX: { xs: "auto", sm: "visible" },
                    pb: { xs: 1, sm: 0 },
                    flexShrink: 0
                  }}>
                    {displayImages.map((item, i) => {
                      const isSelected = activeIndex === i;
                      return (
                        <Box
                          key={item.imageUrl || i}
                          onClick={() => setActiveIndex(i)}
                          sx={{
                            width: { xs: 72, sm: 84 },
                            height: { xs: 72, sm: 84 },
                            borderRadius: "14px",
                            overflow: "hidden",
                            cursor: "pointer",
                            position: "relative",
                            bgcolor: "white",
                            border: isSelected ? "2.5px solid #3c7399" : "1px solid #e2e8f0",
                            boxShadow: isSelected ? "0 4px 14px rgba(60, 115, 153, 0.25)" : "0 2px 6px rgba(0,0,0,0.03)",
                            transform: isSelected ? "scale(1.03)" : "scale(1)",
                            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              borderColor: "#3c7399",
                              opacity: 1,
                            },
                          }}
                        >
                          <img
                            src={item.imageUrl}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block"
                            }}
                          />
                          {isSelected && (
                            <Box sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              bgcolor: "#3c7399"
                            }} />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Main Interactive Stage */}
                <Box sx={{ flex: 1, position: "relative" }}>

                  {/* Top Floating Badges & Action Buttons */}
                  <Box sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    right: 16,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pointerEvents: "none"
                  }}>
                    {/* Quality Assurance Tag */}
                    <Box sx={{
                      px: 1.5, py: 0.6,
                      borderRadius: "20px",
                      bgcolor: "rgba(255, 255, 255, 0.92)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      border: "1px solid rgba(255,255,255,0.6)"
                    }}>
                      <Sparkles size={14} color="#3c7399" />
                      <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: "#1e293b", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        100% Certified
                      </Typography>
                    </Box>

                    {/* Quick Tools */}
                    <Box sx={{ display: "flex", gap: 1, pointerEvents: "auto" }}>
                      <IconButton
                        size="small"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        sx={{
                          bgcolor: "white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          color: isWishlisted ? "#e11d48" : "#64748b",
                          transition: "all 0.2s ease",
                          "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" }
                        }}
                      >
                        <Heart size={18} fill={isWishlisted ? "#e11d48" : "none"} />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: product.title, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                        sx={{
                          bgcolor: "white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          color: "#3c7399",
                          transition: "all 0.2s ease",
                          "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" }
                        }}
                      >
                        <Share2 size={18} />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => setZoomOpen(true)}
                        sx={{
                          bgcolor: "white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          color: "#3c7399",
                          transition: "all 0.2s ease",
                          "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" }
                        }}
                      >
                        <Maximize2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Main Image Container with Lens Zoom */}
                  <Box
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setZoomOpen(true)}
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      bgcolor: "#ffffff",
                      border: "1px solid #e9eff4",
                      boxShadow: "0 10px 30px -10px rgba(60, 115, 153, 0.12)",
                      position: "relative",
                      cursor: "zoom-in",
                      aspectRatio: "1/1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <img
                      src={currentImgUrl}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transform: mousePos.showing ? "scale(1.4)" : "scale(1)",
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        transition: mousePos.showing ? "transform 0.1s ease-out" : "transform 0.3s ease-in-out"
                      }}
                    />

                    {/* Active Metal Color Pill */}
                    <Box sx={{
                      position: "absolute",
                      bottom: 14,
                      left: 14,
                      px: 1.4, py: 0.5,
                      borderRadius: "8px",
                      bgcolor: "rgba(255, 255, 255, 0.94)",
                      backdropFilter: "blur(6px)",
                      border: `1.5px solid ${selectedMetal.border}`,
                      color: selectedMetal.textColor,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: selectedMetal.gradient, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: "0.72rem", fontWeight: 800 }}>
                        {selectedMetal.label}
                      </Typography>
                    </Box>

                    {/* Hover Hint */}
                    {!mousePos.showing && (
                      <Box sx={{
                        position: "absolute",
                        bottom: 14,
                        right: 14,
                        px: 1.5, py: 0.6,
                        borderRadius: "8px",
                        bgcolor: "rgba(15, 23, 42, 0.65)",
                        backdropFilter: "blur(4px)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        pointerEvents: "none"
                      }}>
                        <ZoomIn size={14} />
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 500 }}>Hover to zoom</Typography>
                      </Box>
                    )}
                  </Box>

                </Box>
              </Box>

              {/* Trust Features Bar */}
              <Box sx={{
                mt: 3,
                p: { xs: 2, sm: 2.5 },
                bgcolor: "white",
                borderRadius: "16px",
                border: "1px solid #e9eff4",
                boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
                gap: { xs: 2, sm: 1.5 },
                textAlign: "center"
              }}>
                {[
                  { icon: <ShieldCheck size={20} color="#3c7399" />, title: "BIS Hallmarked", desc: "100% Guaranteed" },
                  { icon: <Truck size={20} color="#3c7399" />, title: "Insured Express", desc: "Free Shipping" },
                  { icon: <RefreshCw size={20} color="#3c7399" />, title: "Easy Exchange", desc: "Lifetime Support" },
                  { icon: <Award size={20} color="#3c7399" />, title: "SGL Certified", desc: "Natural Diamonds" },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: "50%", bgcolor: "#f0f7fb",
                      display: "flex", alignItems: "center", justifyContent: "center", mb: 1,
                      border: "1px solid #daedf7"
                    }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b" }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: "#64748b", mt: 0.2 }}>{item.desc}</Typography>
                  </Box>
                ))}
              </Box>

            </Box>
          </Grid>


          {/* ═════════════════════════════════════════
              RIGHT COLUMN: Product Details & Buying
             ═════════════════════════════════════════ */}
          <Grid item xs={12} md={6}>

            {/* Brand Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3c7399" }} />
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#3c7399", textTransform: "uppercase", letterSpacing: 2 }}>
                Loupe Jeweller Original
              </Typography>
            </Box>

            {/* Product Title */}
            <Typography variant="h1" sx={{
              fontSize: { xs: '1.8rem', md: '2.3rem' },
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: 1.25,
              mb: 1,
              fontFamily: "'Outfit', 'Playfair Display', serif"
            }}>
              {cleanTitle(product.title)}
            </Typography>

            {/* Product Code */}
            {product.productCode && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                  SKU Code: <span style={{ color: "#0f172a", fontWeight: 700 }}>{product.productCode}</span>
                </Typography>
                <Box sx={{ height: 14, width: "1px", bgcolor: "#cbd5e1" }} />
                <Typography sx={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Check size={14} /> Available to Order
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 3, borderColor: "#e9eff4" }} />

            {/* ── Luxury Price Showcase Card ── */}
            <Box sx={{
              mb: 3,
              p: 3,
              borderRadius: "18px",
              background: "linear-gradient(135deg, #ffffff 0%, #f4f8fb 100%)",
              border: "1px solid #daedf7",
              boxShadow: "0 6px 20px rgba(60, 115, 153, 0.06)",
              position: "relative",
              overflow: "hidden"
            }}>
              <Box sx={{
                position: "absolute",
                top: 0, right: 0,
                width: 100, height: 100,
                background: "radial-gradient(circle, rgba(60,115,153,0.08) 0%, rgba(255,255,255,0) 70%)",
                pointerEvents: "none"
              }} />

              <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: "#3c7399", textTransform: "uppercase", letterSpacing: "0.15em", mb: 0.5 }}>
                Estimated Price Range
              </Typography>

              {priceRange ? (
                <Typography sx={{ fontSize: { xs: "1.9rem", sm: "2.3rem" }, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 }}>
                  {priceRange}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#3c7399", fontStyle: "italic" }}>
                  Price Available Upon Inquiry
                </Typography>
              )}

              <Typography sx={{ fontSize: "0.74rem", color: "#64748b", mt: 1.2, lineHeight: 1.6 }}>
                {product.priceNote || "Prices are dynamic based on live gold market rates and customized diamond specifications. Contact us on WhatsApp for exact pricing & order guidance."}
              </Typography>
            </Box>

            {/* ── Sleek Metal Colour Selector ── */}
            <Box sx={{ mb: 3.5, p: 2.5, bgcolor: "white", borderRadius: "16px", border: "1px solid #e9eff4", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.8 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Select Metal Finish
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#3c7399", fontWeight: 700 }}>
                  Selected: <span style={{ color: selectedMetal.border }}>{selectedMetal.label}</span>
                </Typography>
              </Box>

              {/* Swatch Button Row */}
              <Grid container spacing={1.5}>
                {METAL_OPTIONS.map((metal) => {
                  const isSelected = selectedMetal.id === metal.id;
                  const matchingCount = images.filter((img) => {
                    const c = img.color || 'yellow-gold';
                    if (metal.id === 'silver') return c === 'silver' || c === 'white-gold';
                    if (metal.id === 'yellow-gold') return c === 'yellow-gold' || c === 'gold';
                    return c === metal.id;
                  }).length;

                  return (
                    <Grid item xs={12} sm={4} key={metal.id}>
                      <Box
                        onClick={() => handleSelectMetal(metal)}
                        sx={{
                          p: 1.4,
                          borderRadius: "12px",
                          border: isSelected ? `2px solid ${metal.border}` : "1px solid #e2e8f0",
                          bgcolor: isSelected ? metal.tagBg : "#ffffff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? `0 4px 12px ${metal.glow}` : "none",
                          "&:hover": {
                            borderColor: metal.border,
                            transform: "translateY(-1px)"
                          }
                        }}
                      >
                        <Box sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: metal.gradient,
                          border: `1.5px solid ${metal.border}`,
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {isSelected && <Check size={15} color="#ffffff" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.5))" }} />}
                        </Box>
                        
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography sx={{
                            fontSize: "0.78rem",
                            fontWeight: isSelected ? 800 : 600,
                            color: isSelected ? metal.textColor : "#475569",
                            whiteSpace: "nowrap"
                          }}>
                            {metal.short}
                          </Typography>
                          {matchingCount > 0 && (
                            <Typography sx={{
                              fontSize: "0.65rem",
                              color: isSelected ? metal.textColor : "#94a3b8",
                              fontWeight: 600,
                              opacity: 0.85
                            }}>
                              {matchingCount} {matchingCount === 1 ? 'photo' : 'photos'}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Status Pill */}
              <Box sx={{
                mt: 2,
                px: 2, py: 1.2,
                borderRadius: "10px",
                bgcolor: selectedMetal.tagBg,
                border: `1px solid ${selectedMetal.border}40`,
                display: "flex",
                alignItems: "center",
                gap: 1.2
              }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: selectedMetal.gradient, flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.75rem", color: selectedMetal.textColor, fontWeight: 500 }}>
                  Preference: <strong style={{ fontWeight: 800 }}>{selectedMetal.label}</strong> will automatically be attached to your WhatsApp price inquiry.
                </Typography>
              </Box>

            </Box>

            {/* ── WhatsApp CTA Button ── */}
            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                component="a"
                href={whatsAppHrefWithMetal}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  py: { xs: 1.6, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  color: "white",
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: { xs: "0.88rem", sm: "1.02rem" },
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #22bf5b 0%, #0e7569 100%)",
                    boxShadow: "0 10px 28px rgba(37,211,102,0.45)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {WHATSAPP_SVG}
                Inquire & Get Current Price on WhatsApp
              </Button>

              <Typography sx={{ fontSize: "0.72rem", color: "#64748b", textAlign: "center", mt: 1.2, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.6 }}>
                <Lock size={12} color="#16a34a" /> Direct & Instant response from our expert team
              </Typography>
            </Box>

            {/* ── Key Highlights Grid ── */}
            <Box sx={{
              mb: 3, p: 2.5,
              bgcolor: "white",
              borderRadius: "16px",
              border: "1px solid #e9eff4",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)"
            }}>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", mb: 2, fontFamily: "'Outfit', sans-serif" }}>
                Product Highlights
              </Typography>

              <Grid container spacing={1.5}>
                {hasMetals && product.metalDetails[0]?.purity && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.8, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #edf2f7" }}>
                      <Typography sx={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, mb: 0.4 }}>Metal Purity</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#3c7399", fontWeight: 800 }}>{product.metalDetails[0].purity}</Typography>
                    </Box>
                  </Grid>
                )}

                {hasDiamonds && product.diamondDetails[0]?.totalWeight && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.8, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #edf2f7" }}>
                      <Typography sx={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, mb: 0.4 }}>Diamond Carat</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#3c7399", fontWeight: 800 }}>{product.diamondDetails[0].totalWeight} Ct</Typography>
                    </Box>
                  </Grid>
                )}

                {product.braceletLength && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.8, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #edf2f7" }}>
                      <Typography sx={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, mb: 0.4 }}>Length</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#3c7399", fontWeight: 800 }}>{product.braceletLength}</Typography>
                    </Box>
                  </Grid>
                )}

                {hasChain && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.8, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #edf2f7" }}>
                      <Typography sx={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, mb: 0.4 }}>Chain</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#3c7399", fontWeight: 800 }}>{product.includesChain} ({product.chainLength || 'Std'})</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* ── Specifications Accordions ── */}
            <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", mb: 2, fontFamily: "'Outfit', sans-serif" }}>
              Detailed Specifications
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

              {/* Description */}
              {product.description && (
                <Accordion title="Product Description" defaultOpen icon={<Package size={18} color="#3c7399" />}>
                  <Typography sx={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.8 }}>
                    {product.description}
                  </Typography>
                </Accordion>
              )}

              {/* Dimensions */}
              {hasDimensions && (
                <Accordion title="Product Dimensions & Specifications" defaultOpen icon={<Sparkles size={18} color="#3c7399" />}>
                  <Box>
                    {/* Ring Specifics */}
                    {product.ringSize && <SpecRow label="Default Ring Size" value={product.ringSize} />}
                    {product.topWidth && <SpecRow label="Top Crown Width" value={`${product.topWidth} mm`} />}
                    {product.topThickness && <SpecRow label="Top Crown Thickness" value={`${product.topThickness} mm`} />}
                    {product.shankWidth && <SpecRow label="Bottom Shank Width" value={`${product.shankWidth} mm`} />}
                    {product.shankThickness && <SpecRow label="Bottom Shank Thickness" value={`${product.shankThickness} mm`} />}

                    {/* Earring Specifics */}
                    {product.earringHeight && <SpecRow label="Earring Height" value={`${product.earringHeight} mm`} />}
                    {product.earringWidth && <SpecRow label="Earring Width" value={`${product.earringWidth} mm`} />}
                    {product.earringThickness && <SpecRow label="Post Length / Depth" value={`${product.earringThickness} mm`} />}
                    {product.backFinding && <SpecRow label="Backing Mechanism" value={product.backFinding} />}

                    {/* Bracelet Specifics */}
                    {product.braceletLength && <SpecRow label="Bracelet Length" value={product.braceletLength} />}
                    {product.braceletWidth && <SpecRow label="Link / Setting Width" value={`${product.braceletWidth} mm`} />}
                    {product.braceletThickness && <SpecRow label="Setting Thickness" value={`${product.braceletThickness} mm`} />}
                    {product.claspType && <SpecRow label="Clasp Type" value={product.claspType} />}

                    {/* Necklace Specifics */}
                    {product.necklaceLength && <SpecRow label="Necklace Length" value={product.necklaceLength} />}
                    {product.linkWidth && <SpecRow label="Motif / Link Width" value={`${product.linkWidth} mm`} />}
                    {product.linkThickness && <SpecRow label="Motif / Link Thickness" value={`${product.linkThickness} mm`} />}

                    {/* Pendant Specifics */}
                    {product.pendantHeight && <SpecRow label="Pendant Height" value={`${product.pendantHeight} mm`} />}
                    {product.pendantWidth && <SpecRow label="Pendant Width" value={`${product.pendantWidth} mm`} />}
                    {product.includesChain && product.includesChain !== "No" && <SpecRow label="Chain Included" value={product.includesChain} />}

                    {/* Bangle Specifics */}
                    {product.bangleSize && <SpecRow label="Bangle Size" value={product.bangleSize} />}
                    {product.innerDiameter && <SpecRow label="Inner Diameter" value={`${product.innerDiameter} mm`} />}
                    {product.bangleWidth && <SpecRow label="Bangle Width" value={`${product.bangleWidth} mm`} />}
                    {product.isOpenable && <SpecRow label="Closure Style" value={product.isOpenable} />}

                    {/* Mangalsutra Specifics */}
                    {product.mangalsutraLength && <SpecRow label="Mangalsutra Length" value={product.mangalsutraLength} />}
                    {product.blackBeadsRows && <SpecRow label="Black Beads Style" value={product.blackBeadsRows} />}

                    {/* Custom / Dynamic Dimensions List */}
                    {Array.isArray(product?.dimensionsList) && product.dimensionsList.filter(d => d.label || d.value).map((dim, i) => (
                      <SpecRow key={i} label={dim.label} value={dim.value ? `${dim.value} ${(dim.unit || '').toUpperCase()}` : dim.value} />
                    ))}
                  </Box>
                </Accordion>
              )}

              {/* Diamond Details */}
              {hasDiamonds && (
                <Accordion title="Diamond Details" icon={<Star size={18} color="#3c7399" />}>
                  {product.diamondDetails.filter(d => d.diamondType).map((dia, i) => (
                    <Box key={i} sx={{ mb: i < product.diamondDetails.length - 1 ? 2 : 0 }}>
                      {product.diamondDetails.length > 1 && (
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#3c7399", mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          Diamond {i + 1}
                        </Typography>
                      )}
                      <SpecRow label="Type" value={dia.diamondType} />
                      <SpecRow label="Size" value={dia.diamondSize} />
                      <SpecRow label="Diameter" value={dia.diamondDiameter} />
                      <SpecRow label="No. of Pieces" value={dia.pieces} />
                      {showWeights && (
                        <>
                          <SpecRow label="Weight / Piece" value={dia.weightPerPiece ? `${dia.weightPerPiece} Ct` : null} />
                          <SpecRow label="Total Weight" value={dia.totalWeight ? `${dia.totalWeight} Ct` : null} />
                        </>
                      )}
                    </Box>
                  ))}
                </Accordion>
              )}

              {/* Metal Details */}
              {hasMetals && (
                <Accordion title="Metal Specifications" icon={<ShieldCheck size={18} color="#3c7399" />}>
                  {product.metalDetails.filter(m => m.metalType).map((met, i) => (
                    <Box key={i} sx={{ mb: i < product.metalDetails.length - 1 ? 2 : 0 }}>
                      {product.metalDetails.length > 1 && (
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#3c7399", mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          Metal {i + 1}
                        </Typography>
                      )}
                      <SpecRow label="Metal Type" value={met.metalType} />
                      <SpecRow label="Gold Purity" value={met.purity} />
                      {showWeights && (
                        <SpecRow label="Gross Weight" value={met.finalWeight ? `${met.finalWeight} ${(met.unit || 'g').toUpperCase()}` : null} />
                      )}
                    </Box>
                  ))}
                </Accordion>
              )}

              {/* Shipping Policy Accordion */}
              <Accordion title="Shipping & Returns" icon={<Truck size={18} color="#3c7399" />}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    ["100% Insured Delivery", "All shipments are fully insured against transit loss or damage."],
                    ["Free Express Shipping", "Delivered within 5-7 business days across India with full tracking."],
                    ["Tamper-Proof Box", "Arrives in sealed luxury boxes with official BIS & Diamond certificates."],
                  ].map(([title, desc], i) => (
                    <Box key={i}>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", mb: 0.3 }}>{title}</Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6 }}>{desc}</Typography>
                    </Box>
                  ))}
                </Box>
              </Accordion>

            </Box>

          </Grid>
        </Grid>


        {/* ═════════════════════════════════════════
            LOWER SECTION: Experience & Live Shopping
           ═════════════════════════════════════════ */}

        {/* ── What's Included Card ── */}
        <Box sx={{
          mt: 8,
          p: { xs: 3, md: 5 },
          bgcolor: "white",
          borderRadius: "20px",
          border: "1px solid #e9eff4",
          boxShadow: "0 6px 24px rgba(0,0,0,0.02)"
        }}>
          <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", textAlign: "center", mb: 0.8, fontFamily: "'Outfit', sans-serif" }}>
            Included With Your Order
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", textAlign: "center", mb: 4 }}>
            Every authentic piece comes wrapped in our signature presentation.
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <Truck size={28} color="#3c7399" />, label: "Free Insured Express Shipping" },
              { icon: <ShieldCheck size={28} color="#3c7399" />, label: "BIS Hallmark Certification" },
              { icon: <Package size={28} color="#3c7399" />, label: "Authenticity Guarantee Card" },
              { icon: <Headset size={28} color="#3c7399" />, label: "Dedicated Concierge Support" },
            ].map((item, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box sx={{
                    width: 64, height: 64, borderRadius: "50%",
                    bgcolor: "#f0f7fb", display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: 1.5, border: "1px solid #daedf7"
                  }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{item.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Watch & Shop Live Banner ── */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #1e3a52 0%, #0f172a 100%)",
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.15)"
          }}>
            <Box sx={{
              width: { xs: "100%", md: 180 },
              height: { xs: 140, md: 160 },
              borderRadius: "16px",
              bgcolor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Box sx={{ textAlign: "center" }}>
                <Video size={48} color="#3c7399" />
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem", mt: 1, fontWeight: 700, letterSpacing: "0.08em" }}>
                  LIVE VIDEO CALL
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "white", mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                Book a Live Video Consultation
              </Typography>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, mb: 3 }}>
                Experience the brilliance of this piece in high definition before you buy. Schedule a 1-on-1 virtual appointment with our master jeweler.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component="a"
                  href={buildWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: "#3c7399", color: "white", px: 4, py: 1.5, borderRadius: "12px",
                    fontWeight: 800, fontSize: "0.85rem", textTransform: "none",
                    "&:hover": { bgcolor: "#2b526d" }, boxShadow: "0 4px 18px rgba(0,0,0,0.2)"
                  }}
                >
                  Book Video Appointment
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href="tel:+919909109074"
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)", color: "white", px: 4, py: 1.5, borderRadius: "12px",
                    fontWeight: 700, fontSize: "0.85rem", textTransform: "none",
                    "&:hover": { borderColor: "#3c7399", bgcolor: "rgba(151,194,213,0.1)" }
                  }}
                >
                  Call Us: +91 99091 09074
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Carousel: You May Also Like ── */}
        <Box sx={{ mt: 8, mx: { xs: -2, md: -5 }, px: { xs: 2, md: 5 } }}>
          <HomeSectionCarousel
            sectionName="You May Also Like"
            sectionLabel="similar"
            sectionCategory={product.category?.name}
          />
        </Box>

        {/* ── Customer Reviews ── */}
        <Box sx={{ mt: 8 }}>
          <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", mb: 2, fontFamily: "'Outfit', sans-serif" }}>
            Customer Reviews & Ratings
          </Typography>
          <Divider sx={{ mb: 4, borderColor: "#e9eff4" }} />

          <Box sx={{ textAlign: "center", py: 7, bgcolor: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
            <MessageCircle size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
            <Typography sx={{ color: "#64748b", mb: 2.5, fontSize: "0.95rem" }}>
              Be the first to leave a review for this jewelry piece!
            </Typography>
            <Button
              onClick={() => { navigate(`/product/${param.productId}/ratrev`); modal.openModal(); }}
              variant="outlined"
              sx={{
                borderColor: "#3c7399", color: "#3c7399", borderRadius: "10px",
                px: 3, py: 1, textTransform: "none", fontWeight: 700,
                "&:hover": { bgcolor: "#3c7399", color: "white", borderColor: "#3c7399" }
              }}
            >
              Write a Review
            </Button>
          </Box>
        </Box>

      </Box>

      {/* ── Lightbox Zoom Modal ── */}
      <Modal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
      >
        <Box sx={{
          position: "relative",
          bgcolor: "white",
          borderRadius: "20px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          p: 2,
          outline: "none",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)"
        }}>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(0,0,0,0.05)", "&:hover": { bgcolor: "rgba(0,0,0,0.1)" } }}
          >
            <X size={20} />
          </IconButton>
          <img
            src={currentImgUrl}
            alt={product.title}
            style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: "12px", display: "block" }}
          />
        </Box>
      </Modal>

      <RatingReviewForm open={modal.state} handleClose={() => modal.closeModal()} />
    </Box>
  );
}
