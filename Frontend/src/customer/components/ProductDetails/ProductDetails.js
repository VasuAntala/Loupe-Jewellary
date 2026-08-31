import React, { useContext, useEffect, useState } from "react";
import {
  Box, Button, Grid, Rating, TextField, Typography, Divider,
  MenuItem, Breadcrumbs, Link, IconButton, Chip, Collapse,
} from "@mui/material";
import { styled as selectStyle } from "@mui/material/styles";
import ProductReviewCard from "./ProductReviewCard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../../state/product/Action";
import { addItemToCart } from "../../../state/cart/Action";
import HomeSectionCarousel from "../HomeSectionCarousel/HomeSectionCarousel";
import { RRContext } from "../../../context/rrBox/rrContext";
import { toastNotify } from "../../../state/shared/toast";
import RatingReviewForm from "../MyOrders/RatingReviewForm";
import { formatPriceINR } from "../../../utils/price";
import { formatPriceRange, openWhatsApp } from "../../../utils/whatsapp";
import {
  ChevronRight, ChevronDown, ChevronUp, ShoppingCart,
  Heart, Share2, ShieldCheck, Truck, RefreshCw, Gift,
  Headset, Video, Minus, Plus, Package, Star, MessageCircle,
} from "lucide-react";

/* -------------------------------------------
   Styled Select Field
------------------------------------------- */
const CssTextField = selectStyle(TextField)({
  "& label.Mui-focused": { color: "#3c7399" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#3c7399" },
    "&.Mui-focused fieldset": { borderColor: "#3c7399" },
  },
});

/* -------------------------------------------
   Accordion helper
------------------------------------------- */
function SimpleAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
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

/* -------------------------------------------
   Static Product Data for Best Sellers
------------------------------------------- */
const STATIC_BEST_SELLERS = {
  "1": {
    _id: "1",
    title: "0.30 POINTER MARQUISE SHAPE DIAMOND RING | Loupe jeweler",
    minPrice: 28000,
    maxPrice: 35000,
    description: "A breathtaking marquise-shaped diamond centerpiece, meticulously set in a polished gold band. This elegant ring captures the essence of sophisticated charm and timeless beauty. Perfect for engagements or special celebrations.",
    color: "Yellow Gold",
    type: "Diamond Ring",
    metalType: "Gold",
    metalPurity: "18K",
    imageUrls: [
      { imageUrl: "/product/product5.jpeg" },
      { imageUrl: "/product/product4.jpeg" },
      { imageUrl: "/product/product7.jpeg" }
    ],
    sizes: [
      { weight: "2.40 G", size: "12" },
      { weight: "2.50 G", size: "14" },
      { weight: "2.60 G", size: "16" }
    ],
    reviews: [],
    ratings: []
  },
  "2": {
    _id: "2",
    title: "0.50 CARAT LABGROWN DIAMOND ROUND SHAPE RING",
    minPrice: 32000,
    maxPrice: 40000,
    description: "Modern elegance meets sustainable luxury. This round solitaire lab-grown diamond ring offers brilliance and fire that rivals the finest mined diamonds. A conscious choice for the modern connoisseur.",
    color: "White Gold",
    type: "Lab Grown Diamond",
    metalType: "White Gold",
    metalPurity: "14K",
    imageUrls: [
      { imageUrl: "/product/_.jpeg" },
      { imageUrl: "/product/Necklace.jpeg" },
      { imageUrl: "/product/product.png" }
    ],
    sizes: [
      { weight: "3.15 G", size: "11" },
      { weight: "3.25 G", size: "13" },
      { weight: "3.35 G", size: "15" }
    ],
    reviews: [],
    ratings: []
  },
  "3": {
    _id: "3",
    title: "0.50 CTW ROUND DIAMOND ENGAGEMENT RING",
    minPrice: 45000,
    maxPrice: 55000,
    description: "A classic engagement ring featuring a brilliant round center diamond accented by a delicate halo of smaller stones. Symbolizing an eternal bond of love and commitment.",
    color: "Rose Gold",
    type: "Diamond Ring",
    metalType: "Gold",
    metalPurity: "18K",
    imageUrls: [
      { imageUrl: "/product/product 2.png" },
      { imageUrl: "/product/product 3.png" },
      { imageUrl: "/product/product6.jpeg" }
    ],
    sizes: [
      { weight: "2.80 G", size: "12" },
      { weight: "2.90 G", size: "14" }
    ],
    reviews: [],
    ratings: []
  },
  "4": {
    _id: "4",
    title: "0.50 POINTER CLASSIC STYLE LAB GROWN DIAMOND RING",
    minPrice: 30000,
    maxPrice: 38000,
    description: "Simple, elegant, and timeless. This classic solitaire ring features a 0.50 pointer lab-grown diamond in a secure six-prong setting, designed to maximize sparkle.",
    color: "Yellow Gold",
    type: "Lab Grown Diamond",
    metalType: "Gold",
    metalPurity: "18K",
    imageUrls: [
      { imageUrl: "/product/product5.jpeg" },
      { imageUrl: "/product/product4.jpeg" },
      { imageUrl: "/product/product7.jpeg" }
    ],
    sizes: [
      { weight: "2.20 G", size: "10" },
      { weight: "2.30 G", size: "12" }
    ],
    reviews: [],
    ratings: []
  },
  "5": {
    _id: "5",
    title: "0.80 CARAT ROUND SOLITAIRE DIAMOND RING",
    minPrice: 48000,
    maxPrice: 58000,
    description: "A statement of pure luxury. This impressive 0.80 carat round solitaire diamond ring command attention with its exceptional clarity and breathtaking brilliance.",
    color: "White Gold",
    type: "Diamond Ring",
    metalType: "White Gold",
    metalPurity: "18K",
    imageUrls: [
      { imageUrl: "/product/_.jpeg" },
      { imageUrl: "/product/Necklace.jpeg" },
      { imageUrl: "/product/product.png" }
    ],
    sizes: [
      { weight: "3.50 G", size: "14" },
      { weight: "3.60 G", size: "16" }
    ],
    reviews: [],
    ratings: []
  }
};

/* -------------------------------------------
   Main Component
------------------------------------------- */
export default function ProductDetails() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);
  const modal = useContext(RRContext);

  useEffect(() => {
    dispatch(findProductById({ productId: param.productId }));
    setQuantity(1);
    setActiveIndex(0);
    setSelectedSize("");
    setSelectedWeight("");
  }, [param.productId]);

  // Auto-select first weight/size once product loads
  useEffect(() => {
    const activeProduct = STATIC_BEST_SELLERS[param.productId] || products?.product;
    if (activeProduct?.sizes?.length > 0) {
      setSelectedWeight(activeProduct.sizes[0].weight || "");
      if (activeProduct.sizes[0].size) {
        setSelectedSize(activeProduct.sizes[0].size);
      }
    }
  }, [param.productId, products?.product?._id]);

  const handleAddToCart = () => {
    dispatch(addItemToCart({ productId: param.productId, weight: selectedWeight, size: selectedSize, quantity }));
    toastNotify({ type: "success", title: "Added to Cart", description: `${products?.product?.title} added to your cart.` });
  };

  const handleWhatsApp = () => {
    openWhatsApp(product);
  };

  const staticProduct = STATIC_BEST_SELLERS[param.productId];
  const product = staticProduct || products.product;

  if (!product) return null;

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>

      {/* ================== TOP SECTION ================== */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #f1f5f9" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 5 }, py: 2 }}>
          <Breadcrumbs separator={<ChevronRight size={13} />}>
            <Link underline="hover" href="/" sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>Home</Link>
            <Link underline="hover" href="/jewellery" sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>Jewellery</Link>
            <Typography sx={{ fontSize: "0.75rem", color: "#3c7399", fontWeight: 600 }}>{product.title}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, md: 5 }, pt: 4, pb: 8 }}>

        {/* ================== MAIN PRODUCT ROW ================== */}
        <Grid container spacing={{ xs: 3, md: 6 }}>

          {/* -- LEFT: Image Gallery -- */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, position: { md: "sticky" }, top: { md: 100 } }}>
              {/* Vertical thumbnails */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: 76, flexShrink: 0 }}>
                {product.imageUrls?.map((item, i) => (
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

              {/* Main image */}
              <Box sx={{ flex: 1, position: "relative" }}>

                <Box sx={{ position: "absolute", top: 14, right: 14, zIndex: 1, display: "flex", gap: 1 }}>
                  <IconButton size="small" sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#f8fafc" } }}>
                    <Heart size={17} color="#3c7399" />
                  </IconButton>
                  <IconButton size="small" sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#f8fafc" } }}>
                    <Share2 size={17} color="#3c7399" />
                  </IconButton>
                </Box>
                <Box sx={{ borderRadius: "16px", overflow: "hidden", bgcolor: "#f5f5f5", border: "1px solid #eee" }}>
                  <img
                    src={product.imageUrls?.[activeIndex]?.imageUrl}
                    alt={product.title}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* -- RIGHT: Product Info Panel -- */}
          <Grid item xs={12} md={6}>

            {/* Brand */}
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#3c7399", textTransform: "uppercase", letterSpacing: 2, mb: 0.5 }}>
              Loupe Jeweller
            </Typography>

            {/* Product Name */}
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#3c7399", lineHeight: 1.3, mb: 1 }}>
              {product.title}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating value={4.2} readOnly size="small" sx={{ color: "#3c7399" }} />
              <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                {product.reviews?.length || 0} Reviews
              </Typography>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* Approx. Price Range */}
            <Box sx={{ mb: 2.5, p: 2.5, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em", mb: 0.5 }}>
                Approx. Price
              </Typography>
              {formatPriceRange(product.minPrice, product.maxPrice) ? (
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e3545", fontFamily: "'Outfit', sans-serif", lineHeight: 1.2 }}>
                  {formatPriceRange(product.minPrice, product.maxPrice)}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#3c7399", fontStyle: "italic" }}>
                  Contact us for price
                </Typography>
              )}
              <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 1, lineHeight: 1.6 }}>
                Final price may vary based on the current gold rate and product specifications.
                Please contact us on WhatsApp for the latest price.
              </Typography>
            </Box>

            {/* Color */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", mb: 0.8 }}>
                Color: <span style={{ color: "#3c7399", textTransform: "capitalize" }}>{product.color}</span>
              </Typography>
            </Box>

            {/* Material (type + metalPurity — no stone/gold weight shown to customers) */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", mb: 0.8 }}>
                Material:{" "}
                <span style={{ color: "#3c7399", textTransform: "capitalize" }}>
                  {product.type}
                  {product.metalPurity && (
                    <span style={{ color: "#3c7399", marginLeft: 8, fontWeight: 800 }}>
                      {product.metalPurity}
                    </span>
                  )}
                </span>
              </Typography>
            </Box>

            {/* Metal type if available */}
            {product.metalType && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", mb: 0.8 }}>
                  Metal: <span style={{ color: "#3c7399" }}>{product.metalType}</span>
                  {product.metalPurity && <span style={{ color: "#3c7399", marginLeft: 6 }}>{product.metalPurity}</span>}
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

            {/* Weight Selection */}
            {product.sizes?.length > 0 && (
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#3c7399", mb: 1 }}>Weight</Typography>
                <CssTextField
                  select size="small" fullWidth
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>Select weight</MenuItem>
                  {product.sizes.map((wt) => (
                    <MenuItem key={wt.weight} value={wt.weight}>{wt.weight}</MenuItem>
                  ))}
                </CssTextField>
              </Box>
            )}

            {/* Size Selection */}
            {product.sizes?.[0]?.size && (
              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#3c7399", mb: 1 }}>Size</Typography>
                <CssTextField
                  select size="small" fullWidth
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <MenuItem value="" disabled>Select size</MenuItem>
                  {product.sizes.map((s) => (
                    <MenuItem key={s.size} value={s.size}>{s.size}</MenuItem>
                  ))}
                </CssTextField>
              </Box>
            )}

            {/* Quantity */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#3c7399", mb: 1 }}>Quantity</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e2e8f0", borderRadius: "8px", width: "fit-content" }}>
                <IconButton
                  size="small"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  sx={{ borderRadius: "8px 0 0 8px", width: 38, height: 38, "&:hover": { bgcolor: "#f1f5f9" } }}
                >
                  <Minus size={15} />
                </IconButton>
                <Typography sx={{ px: 3, fontWeight: 700, color: "#3c7399", fontSize: "0.95rem", minWidth: 44, textAlign: "center" }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity(q => q + 1)}
                  sx={{ borderRadius: "0 8px 8px 0", width: 38, height: 38, "&:hover": { bgcolor: "#f1f5f9" } }}
                >
                  <Plus size={15} />
                </IconButton>
              </Box>
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2.5 }}>

              {/* Primary: WhatsApp CTA */}
              <Button
                fullWidth
                onClick={handleWhatsApp}
                sx={{
                  py: 1.8, bgcolor: "#25D366", color: "white", borderRadius: "12px",
                  fontWeight: 800, fontSize: "1rem", textTransform: "none",
                  display: "flex", alignItems: "center", gap: 1.5,
                  "&:hover": { bgcolor: "#1ebe5a", transform: "translateY(-1px)" },
                  boxShadow: "0 6px 20px rgba(37,211,102,0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp — Get Current Price
              </Button>

              {/* Secondary: Add to Cart */}
              <Button
                onClick={handleAddToCart}
                variant="outlined"
                startIcon={<ShoppingCart size={18} />}
                sx={{
                  py: 1.5, borderRadius: "10px",
                  borderColor: "#3c7399", color: "#3c7399",
                  fontWeight: 700, fontSize: "0.85rem", textTransform: "none",
                  "&:hover": { bgcolor: "#f0f7fb", borderColor: "#3c7399" },
                }}
              >
                Add to Cart
              </Button>

            </Box>



            {/* Certification Logos */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
              <Typography sx={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>Certification:</Typography>
              {/* BIS */}
              <Box sx={{
                px: 2, py: 1, border: "1px solid #e2e8f0", borderRadius: "8px",
                display: "flex", alignItems: "center", gap: 1, bgcolor: "#f8fafc"
              }}>
                <ShieldCheck size={16} color="#3c7399" />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#3c7399", letterSpacing: 0.5 }}>BIS</Typography>
              </Box>
              {/* SGL */}
              <Box sx={{
                px: 2, py: 1, border: "1px solid #e2e8f0", borderRadius: "8px",
                display: "flex", alignItems: "center", gap: 1, bgcolor: "#f8fafc"
              }}>
                <Star size={16} color="#3c7399" fill="#3c7399" />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#3c7399", letterSpacing: 0.5 }}>SGL</Typography>
              </Box>
            </Box>

            {/* Trust Bar */}
            <Box sx={{
              bgcolor: "#f0f7fb", borderRadius: "10px", border: "1px solid #daedf7",
              p: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2.5,
            }}>
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

            {/* Accordions */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <SimpleAccordion title="Product Description" defaultOpen>
                <Typography sx={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.9 }}>
                  {product.description || "No description available."}
                </Typography>
              </SimpleAccordion>

              <SimpleAccordion title="Shipping Policy">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    ["Free Domestic Shipping", "All orders above ₹500 qualify for free standard shipping across India."],
                    ["Delivery Time", "Standard delivery: 5-7 business days. Express delivery: 2-3 business days."],
                    ["Insured Delivery", "All jewellery is shipped in tamper-proof, insured packaging for your safety."],
                    ["Returns & Exchange", "7-day easy return or exchange policy. Item must be in original condition."],
                  ].map(([title, desc], i) => (
                    <Box key={i}>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#3c7399", mb: 0.3 }}>{title}</Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.7 }}>{desc}</Typography>
                    </Box>
                  ))}
                </Box>
              </SimpleAccordion>
            </Box>
          </Grid>
        </Grid>

        {/* ================== WHAT'S INCLUDED ================== */}
        <Box sx={{ mt: 8, p: { xs: 3, md: 5 }, bgcolor: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#3c7399", textAlign: "center", mb: 1 }}>
            What's Included With The Purchase?
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8", textAlign: "center", mb: 4 }}>
            Every Loupe Jeweller order comes with our signature promise.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <Truck size={28} color="#3c7399" />, label: "Free Domestic Shipping" },
              { icon: <ShieldCheck size={28} color="#3c7399" />, label: "Care Tips Card" },
              { icon: <Package size={28} color="#3c7399" />, label: "Jewellery Certificate" },
              { icon: <Headset size={28} color="#3c7399" />, label: "24x7 Customer Support" },
            ].map((item, i) => (
              <Grid item xs={6} sm={4} md={2.4} key={i}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box sx={{
                    width: 60, height: 60, borderRadius: "50%",
                    bgcolor: "#f0f7fb", display: "flex", alignItems: "center",
                    justifyContent: "center", mx: "auto", mb: 1.5,
                    border: "1px solid #daedf7",
                  }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#3c7399" }}>{item.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ================== WATCH & SHOP ================== */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{
            borderRadius: "16px", overflow: "hidden",
            background: "linear-gradient(135deg, #3c7399 0%, #0f172a 100%)",
            p: { xs: 3, md: 5 },
            display: "flex", flexDirection: { xs: "column", md: "row" },
            alignItems: "center", gap: 4,
          }}>
            {/* Left: illustration */}
            <Box sx={{
              width: { xs: "100%", md: 180 }, height: { xs: 160, md: 180 },
              borderRadius: "14px", overflow: "hidden", flexShrink: 0,
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Video size={52} color="#3c7399" />
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", mt: 1.5, fontWeight: 600 }}>
                  LIVE VIDEO CALL
                </Typography>
              </Box>
            </Box>

            {/* Right: text */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "white", mb: 1 }}>
                Watch &amp; Shop Live
              </Typography>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, mb: 3 }}>
                Not sure how it looks in real life? Book a free live video consultation with our jewellery experts.
                See the piece up close, ask questions, and shop with confidence - all from the comfort of your home.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  onClick={handleWhatsApp}
                  sx={{
                    bgcolor: "#3c7399", color: "white", px: 4, py: 1.4,
                    borderRadius: "10px", fontWeight: 800, fontSize: "0.82rem",
                    textTransform: "none", "&:hover": { bgcolor: "#2b526d" },
                    boxShadow: "0 4px 18px rgba(0,0,0,0.2)"
                  }}
                >
                  Book a Video Call
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open("tel:+919909109074")}
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)", color: "white",
                    px: 4, py: 1.4, borderRadius: "10px",
                    fontWeight: 700, fontSize: "0.82rem", textTransform: "none",
                    "&:hover": { borderColor: "#3c7399", bgcolor: "rgba(151,194,213,0.1)" }
                  }}
                >
                  Call Us: +91 99091 09074
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ================== YOU MAY ALSO LIKE ================== */}
        <Box sx={{ mt: 8, mx: { xs: -2, md: -5 }, px: { xs: 2, md: 5 } }}>
          <HomeSectionCarousel
            sectionName="You May Also Like"
            sectionLabel="similar"
            sectionCategory={product.category?.name}
          />
        </Box>

        {/* ================== CUSTOMER REVIEWS ================== */}
        <Box sx={{ mt: 8 }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#3c7399", mb: 3 }}>
            Customer Reviews
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={5}>
            <Grid item xs={12} lg={8}>
              {product.reviews?.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {product.reviews.map((rev, i) => (
                    <ProductReviewCard key={i} reviewData={rev} ratingData={product.ratings?.[i]} />
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 7, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px dashed #e2e8f0" }}>
                  <Typography sx={{ color: "#94a3b8", mb: 2.5, fontSize: "0.95rem" }}>
                    Be the first to share your experience!
                  </Typography>
                  <Button
                    onClick={() => { navigate(`/product/${param.productId}/ratrev`); modal.openModal(); }}
                    variant="outlined"
                    sx={{
                      borderColor: "#3c7399", color: "#3c7399", borderRadius: "8px",
                      textTransform: "none", fontWeight: 600,
                      "&:hover": { bgcolor: "#3c7399", color: "white", borderColor: "#3c7399" }
                    }}
                  >
                    Write a Review
                  </Button>
                </Box>
              )}
              {product.reviews?.length > 0 && (
                <Button
                  onClick={() => { navigate(`/product/${param.productId}/ratrev`); modal.openModal(); }}
                  variant="outlined" sx={{
                    mt: 3, borderColor: "#3c7399", color: "#3c7399",
                    borderRadius: "8px", textTransform: "none", fontWeight: 600,
                    "&:hover": { bgcolor: "#3c7399", color: "white", borderColor: "#3c7399" }
                  }}
                >
                  Write a Review
                </Button>
              )}
            </Grid>

            <Grid item xs={12} lg={4}>
              <Box sx={{ p: 3, bgcolor: "white", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <Typography sx={{ fontWeight: 700, mb: 2.5, color: "#3c7399" }}>Rating Overview</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Typography sx={{ fontSize: "3rem", fontWeight: 900, color: "#3c7399", lineHeight: 1 }}>4.6</Typography>
                  <Box>
                    <Rating value={4.6} precision={0.5} readOnly sx={{ color: "#3c7399" }} size="small" />
                    <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.5 }}>Based on reviews</Typography>
                  </Box>
                </Box>
                {[
                  { label: "Excellent", pct: 70 },
                  { label: "Very Good", pct: 50 },
                  { label: "Good", pct: 30 },
                  { label: "Average", pct: 20 },
                  { label: "Poor", pct: 10 },
                ].map((r, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Typography sx={{ fontSize: "0.72rem", color: "#64748b", width: 70, flexShrink: 0 }}>{r.label}</Typography>
                    <Box sx={{ flex: 1, height: 6, bgcolor: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <Box sx={{ width: `${r.pct}%`, height: "100%", bgcolor: "#3c7399", borderRadius: 3 }} />
                    </Box>
                    <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", width: 28, textAlign: "right" }}>{r.pct}%</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <RatingReviewForm open={modal.state} handleClose={() => modal.closeModal()} />
    </Box>
  );
}
