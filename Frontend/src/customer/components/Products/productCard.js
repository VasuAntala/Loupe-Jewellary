import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { formatPriceRange, openWhatsApp } from "../../../utils/whatsapp";

const PLACEHOLDER_IMAGE_URL =
  "https://res.cloudinary.com/deq0hxr3t/image/upload/v1709462235/no-found_mnvvpf.svg";

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function resolveImageUrl(imageItem) {
  if (!imageItem) return undefined;
  if (typeof imageItem === "string") return imageItem;
  if (typeof imageItem === "object" && imageItem.imageUrl) return imageItem.imageUrl;
  return undefined;
}

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const [isMouseHover, setMouseHover] = useState(false);

  const listOfImageUrls = Array.isArray(product?.imageUrls)
    ? product.imageUrls.map(resolveImageUrl).filter(Boolean)
    : [];
  const primaryImageUrl = listOfImageUrls[0] || PLACEHOLDER_IMAGE_URL;
  const hoverImageUrl = listOfImageUrls[1] || primaryImageUrl;

  const priceRange = formatPriceRange(product?.minPrice, product?.maxPrice);

  const handleWhatsAppClick = (e) => {
    e.stopPropagation(); // Prevent navigating to product page
    openWhatsApp(product);
  };

  return (
    <div
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      onClick={() => navigate(`/product/${product?._id}`)}
      className="group relative flex flex-col items-center p-4 transition-all duration-700 cursor-pointer w-full max-w-[19rem] hover:bg-white hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] rounded-[32px]"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] mb-6 transition-all duration-700 group-hover:translate-y-[-8px]">
        <img
          src={!isMouseHover ? primaryImageUrl : hoverImageUrl}
          alt={product?.title}
          className={`h-full w-full object-cover transition-transform duration-1000 ease-out ${isMouseHover ? 'scale-110 rotate-1' : 'scale-100'}`}
        />

        {/* New Arrival Badge */}
        {index < 3 && (
          <div className="absolute top-5 right-5 bg-[#3c7399]/90 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-sm z-10">
            <p className="text-[0.6rem] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white" />
              New
            </p>
          </div>
        )}
      </div>

      {/* Product Information Stack */}
      <div className="w-full text-center space-y-3 px-2">
        <Typography
          sx={{
            fontSize: '0.6rem',
            fontWeight: 800,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            transition: 'color 0.3s'
          }}
          className="group-hover:text-[#3c7399]"
        >
          {product?.type || "Fine Jewellery"}
        </Typography>

        <h3 className="text-[1.05rem] font-medium text-[#3c7399] font-serif leading-tight line-clamp-2 min-h-[2.5rem]">
          {product?.title || "Untitled Masterpiece"}
        </h3>

        {/* Approx Price Display */}
        <div className="flex flex-col items-center pt-1 space-y-2">
          {priceRange ? (
            <div className="flex flex-col items-center">
              <span className="text-[0.6rem] font-bold text-[#94a3b8] uppercase tracking-widest">
                Approx. Price
              </span>
              <span className="text-[1.05rem] font-bold text-[#1e3545] font-sans tracking-tight">
                {priceRange}
              </span>
            </div>
          ) : (
            <span className="text-[0.85rem] font-semibold text-[#94a3b8] italic">
              Contact for Price
            </span>
          )}

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1.5 w-full mt-1 py-2 px-3 rounded-full text-white text-[0.7rem] font-bold uppercase tracking-wider transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #25D366, #1ebe5a)',
              boxShadow: '0 4px 12px rgba(37,211,102,0.35)',
            }}
            aria-label="Chat on WhatsApp"
          >
            {WA_ICON}
            Chat on WhatsApp
          </button>

          {/* Collection Signature on hover */}
          <div className={`transition-all duration-500 overflow-hidden ${isMouseHover ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
            <p className="text-[0.65rem] font-bold text-[#3c7399] uppercase tracking-widest border-t border-slate-100 pt-2 px-6">
              {product?.brand || "Loupe Jeweler Boutique"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
