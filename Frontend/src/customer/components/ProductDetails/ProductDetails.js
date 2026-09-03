import React, { useContext, useEffect, useState } from "react";
import {
  Box, Button, Grid, Typography, Divider,
  Breadcrumbs, Link, IconButton, Collapse,
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
  Share2, Heart,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function fmtINR(n) {
  if (!n && n !== 0) return null;
  return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const WHATSAPP_SVG = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─────────────────────────────────────────────
   Accordion
───────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: 2.5, py: 1.8, cursor: "pointer", userSelect: "none",
          bgcolor: open ? "#f8fafc" : "white",
          "&:hover": { bgcolor: "#f1f5f9" },
        }}
      >
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#3c7399" }}>{title}</Typography>
        {open ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2.5, pb: 2.5, pt: 1 }}>{children}</Box>
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
      display: "grid", gridTemplateColumns: "1fr 1fr",
      py: 1, borderBottom: "1px solid #f1f5f9",
      "&:last-child": { borderBottom: "none" },
    }}>
      <Typography sx={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: "0.82rem", color: "#1e3545", fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function ProductDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  // ── Derived values ──
  const priceRange = product ? formatPriceRange(product.minPrice, product.maxPrice) : null;
  const images = Array.isArray(product?.imageUrls) ? product.imageUrls : [];

  // ── Visibility flags ──
  const showDiamonds = product?.showDiamondDetails === true;
  const showMetals = product?.showMetalDetails === true;
  const showWeights = product?.showWeightDetails === true;

  // ── Dynamic sections — only show if data exists ──
  const hasDimensions = Array.isArray(product?.dimensionsList) && product.dimensionsList.some(d => d.label || d.value);
  const hasDiamonds = showDiamonds && Array.isArray(product?.diamondDetails) && product.diamondDetails.some(d => d.diamondType);
  const hasMetals = showMetals && Array.isArray(product?.metalDetails) && product.metalDetails.some(m => m.metalType);
  const hasAdditionalSpecs = Array.isArray(product?.additionalSpecifications) && product.additionalSpecifications.some(s => s.label);
  const hasChain = product?.includesChain === "Yes" || product?.includesChain === "Optional";

  const handleWhatsApp = () => openWhatsApp(product);

  if (!product) return null;

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>

      {/* ── Breadcrumb ── */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #f1f5f9" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 5 }, py: 2 }}>
          <Breadcrumbs separator={<ChevronRight size={13} />}>
            <Link underline="hover" href="/" sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>Home</Link>
            <Link underline="hover" href="/jewellery" sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>Jewellery</Link>
            <Typography sx={{ fontSize: "0.75rem", color: "#3c7399", fontWeight: 600 }}>
              {product.title}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 5 }, pt: 4, pb: 8 }}>

        {/* ── MAIN ROW ── */}
        <Grid container spacing={{ xs: 3, md: 6 }}>

          {/* ══ LEFT: Image Gallery ══ */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, position: { md: "sticky" }, top: { md: 100 } }}>

              {/* Vertical thumbnails */}
              {images.length > 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: 76, flexShrink: 0 }}>
                  {images.map((item, i) => (
                    <Box
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      sx={{
                        width: 76, height: 76, borderRadius: "10px", overflow: "hidden",
                        cursor: "pointer",
                        border: activeIndex === i ? "2px solid #3c7399" : "2px solid #e2e8f0",
                        opacity: activeIndex === i ? 1 : 0.6,
                        transition: "all 0.2s",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <img src={item.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Main image */}
              <Box sx={{ flex: 1, position: "relative" }}>
                <Box sx={{ position: "absolute", top: 14, right: 14, zIndex: 1, display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: product.title, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#f8fafc" } }}
                  >
                    <Share2 size={17} color="#3c7399" />
                  </IconButton>
                </Box>
                <Box sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: "#f5f5f5", border: "1px solid #eee" }}>
                  <img
                    src={images[activeIndex]?.imageUrl}
                    alt={product.title}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* ══ RIGHT: Info Panel ══ */}
          <Grid item xs={12} md={6}>

            {/* Brand */}
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: "#3c7399", textTransform: "uppercase", letterSpacing: 2, mb: 0.5 }}>
              Loupe Jeweller
            </Typography>

            {/* Product Name */}
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e3545", lineHeight: 1.3, mb: 0.8 }}>
              {product.title}
            </Typography>

            {/* Product Code */}
            {product.productCode && (
              <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, mb: 1.5, letterSpacing: "0.08em" }}>
                Product Code: <span style={{ color: "#3c7399" }}>{product.productCode}</span>
              </Typography>
            )}

            <Divider sx={{ mb: 2.5 }} />

            {/* ── Approximate Price ── */}
            <Box sx={{ mb: 2.5, p: 2.5, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em", mb: 0.5 }}>
                Approx. Price
              </Typography>
              {priceRange ? (
                <Typography sx={{ fontSize: "1.9rem", fontWeight: 900, color: "#1e3545", fontFamily: "'Outfit', sans-serif", lineHeight: 1.2 }}>
                  {priceRange}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#3c7399", fontStyle: "italic" }}>
                  Contact us for price
                </Typography>
              )}
              <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 1, lineHeight: 1.6 }}>
                {product.priceNote || "Final price may vary based on the current gold rate and product specifications. Please contact us on WhatsApp for the latest price."}
              </Typography>
            </Box>

            {/* ── Primary CTA: WhatsApp ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2.5 }}>
              <Button
                fullWidth
                component="a"
                href={buildWhatsAppUrl(product)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  py: 1.9, bgcolor: "#25D366", color: "white", borderRadius: "12px",
                  fontWeight: 800, fontSize: "1rem", textTransform: "none",
                  display: "flex", alignItems: "center", gap: 1.5,
                  "&:hover": { bgcolor: "#1ebe5a", transform: "translateY(-1px)" },
                  boxShadow: "0 6px 20px rgba(37,211,102,0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                {WHATSAPP_SVG}
                Chat on WhatsApp — Get Current Price
              </Button>
            </Box>

            {/* ── Certification Logos ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
              <Typography sx={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>Certification:</Typography>
              {[
                { icon: <ShieldCheck size={16} color="#3c7399" />, label: "BIS" },
                { icon: <Star size={16} color="#3c7399" fill="#3c7399" />, label: "SGL" },
              ].map((c) => (
                <Box key={c.label} sx={{ px: 2, py: 1, border: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1, bgcolor: "#f8fafc" }}>
                  {c.icon}
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#3c7399", letterSpacing: 0.5 }}>{c.label}</Typography>
                </Box>
              ))}
            </Box>

            {/* ── Trust Bar ── */}
            <Box sx={{ bgcolor: "#f0f7fb", borderRadius: "10px", border: "1px solid #daedf7", p: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2.5 }}>
              {[
                { icon: <RefreshCw size={18} color="#3c7399" />, text: "Buyback & Exchange" },
                { icon: <ShieldCheck size={18} color="#3c7399" />, text: "BIS Hallmark" },
                { icon: <Truck size={18} color="#3c7399" />, text: "Free Shipping" },
                { icon: <Gift size={18} color="#3c7399" />, text: "Certified Diamond" },
              ].map((b, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {b.icon}
                  <Typography sx={{ fontSize: "0.75rem", color: "#3c7399", fontWeight: 600 }}>{b.text}</Typography>
                </Box>
              ))}
            </Box>

            {/* ── Accordions ── */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

              {/* Description */}
              {product.description && (
                <Accordion title="Product Description" defaultOpen>
                  <Typography sx={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.9 }}>
                    {product.description}
                  </Typography>
                </Accordion>
              )}

              {/* ── Dimensions ── */}
              {hasDimensions && (
                <Accordion title="Product Dimensions" defaultOpen>
                  <Box>
                    {product.dimensionsList.filter(d => d.label || d.value).map((dim, i) => (
                      <SpecRow key={i} label={dim.label} value={dim.value ? `${dim.value} ${(dim.unit || '').toUpperCase()}` : dim.value} />
                    ))}
                  </Box>
                </Accordion>
              )}

              {/* ── Diamond Details (only if showDiamondDetails = true) ── */}
              {hasDiamonds && (
                <Accordion title="Diamond Details">
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
                      {i < product.diamondDetails.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
                </Accordion>
              )}

              {/* ── Metal Details (only if showMetalDetails = true) ── */}
              {hasMetals && (
                <Accordion title="Metal Details">
                  {product.metalDetails.filter(m => m.metalType).map((met, i) => (
                    <Box key={i} sx={{ mb: i < product.metalDetails.length - 1 ? 2 : 0 }}>
                      {product.metalDetails.length > 1 && (
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#3c7399", mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          Metal {i + 1}
                        </Typography>
                      )}
                      <SpecRow label="Metal" value={met.metalType} />
                      <SpecRow label="Purity" value={met.purity} />
                      {showWeights && (
                        <SpecRow label="Weight" value={met.finalWeight ? `${met.finalWeight} ${(met.unit || 'g').toUpperCase()}` : null} />
                      )}
                      {i < product.metalDetails.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
                </Accordion>
              )}

              {/* ── Chain Info ── */}
              {hasChain && (
                <Accordion title="Chain Information">
                  <SpecRow label="Includes Chain" value={product.includesChain} />
                  <SpecRow label="Chain Length" value={product.chainLength} />
                </Accordion>
              )}

              {/* ── Additional Specifications ── */}
              {hasAdditionalSpecs && (
                <Accordion title="Additional Specifications">
                  {product.additionalSpecifications.filter(s => s.label).map((spec, i) => (
                    <SpecRow key={i} label={spec.label} value={spec.value} />
                  ))}
                </Accordion>
              )}

              {/* ── Shipping Policy ── */}
              <Accordion title="Shipping Policy">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    ["Free Domestic Shipping", "All jewellery orders include free insured shipping across India."],
                    ["Delivery Time", "Standard delivery: 5–7 business days. Express: 2–3 business days."],
                    ["Insured Packaging", "All jewellery is shipped in tamper-proof, insured packaging."],
                    ["Returns & Exchange", "7-day easy return or exchange. Item must be in original condition."],
                  ].map(([title, desc], i) => (
                    <Box key={i}>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#3c7399", mb: 0.3 }}>{title}</Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.7 }}>{desc}</Typography>
                    </Box>
                  ))}
                </Box>
              </Accordion>
            </Box>
          </Grid>
        </Grid>

        {/* ── WHAT'S INCLUDED ── */}
        <Box sx={{ mt: 8, p: { xs: 3, md: 5 }, bgcolor: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#3c7399", textAlign: "center", mb: 1 }}>
            What's Included With Your Purchase?
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8", textAlign: "center", mb: 4 }}>
            Every Loupe Jeweller order comes with our signature promise.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <Truck size={28} color="#3c7399" />, label: "Free Domestic Shipping" },
              { icon: <ShieldCheck size={28} color="#3c7399" />, label: "Jewellery Care Card" },
              { icon: <Package size={28} color="#3c7399" />, label: "Jewellery Certificate" },
              { icon: <Headset size={28} color="#3c7399" />, label: "24×7 Customer Support" },
            ].map((item, i) => (
              <Grid item xs={6} sm={4} md={2.4} key={i}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box sx={{ width: 60, height: 60, borderRadius: "50%", bgcolor: "#f0f7fb", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5, border: "1px solid #daedf7" }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#3c7399" }}>{item.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── WATCH & SHOP LIVE ── */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{
            borderRadius: "16px", overflow: "hidden",
            background: "linear-gradient(135deg, #3c7399 0%, #0f172a 100%)",
            p: { xs: 3, md: 5 },
            display: "flex", flexDirection: { xs: "column", md: "row" },
            alignItems: "center", gap: 4,
          }}>
            <Box sx={{ width: { xs: "100%", md: 180 }, height: { xs: 160, md: 180 }, borderRadius: "14px", overflow: "hidden", flexShrink: 0, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Video size={52} color="#3c7399" />
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", mt: 1.5, fontWeight: 600 }}>LIVE VIDEO CALL</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "white", mb: 1 }}>
                Watch &amp; Shop Live
              </Typography>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, mb: 3 }}>
                Not sure how it looks in real life? Book a free live video consultation with our jewellery experts. See the piece up close, ask questions, and shop with confidence — from the comfort of your home.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component="a"
                  href={buildWhatsAppUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ bgcolor: "#3c7399", color: "white", px: 4, py: 1.4, borderRadius: "10px", fontWeight: 800, fontSize: "0.82rem", textTransform: "none", "&:hover": { bgcolor: "#2b526d" }, boxShadow: "0 4px 18px rgba(0,0,0,0.2)" }}
                >
                  Book a Video Call
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href="tel:+919909109074"
                  sx={{ borderColor: "rgba(255,255,255,0.3)", color: "white", px: 4, py: 1.4, borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", textTransform: "none", "&:hover": { borderColor: "#3c7399", bgcolor: "rgba(151,194,213,0.1)" } }}
                >
                  Call Us: +91 99091 09074
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── YOU MAY ALSO LIKE ── */}
        <Box sx={{ mt: 8, mx: { xs: -2, md: -5 }, px: { xs: 2, md: 5 } }}>
          <HomeSectionCarousel
            sectionName="You May Also Like"
            sectionLabel="similar"
            sectionCategory={product.category?.name}
          />
        </Box>

        {/* ── CUSTOMER REVIEWS ── */}
        <Box sx={{ mt: 8 }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#3c7399", mb: 3 }}>
            Customer Reviews
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ textAlign: "center", py: 7, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px dashed #e2e8f0" }}>
            <MessageCircle size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
            <Typography sx={{ color: "#94a3b8", mb: 2.5, fontSize: "0.95rem" }}>
              Be the first to share your experience!
            </Typography>
            <Button
              onClick={() => { navigate(`/product/${param.productId}/ratrev`); modal.openModal(); }}
              variant="outlined"
              sx={{ borderColor: "#3c7399", color: "#3c7399", borderRadius: "8px", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#3c7399", color: "white", borderColor: "#3c7399" } }}
            >
              Write a Review
            </Button>
          </Box>
        </Box>

      </Box>

      <RatingReviewForm open={modal.state} handleClose={() => modal.closeModal()} />
    </Box>
  );
}
