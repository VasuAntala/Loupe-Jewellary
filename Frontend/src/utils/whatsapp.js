/**
 * whatsapp.js
 * Centralised WhatsApp inquiry helpers for Loupe Jeweller.
 * Reads VITE_WHATSAPP_NUMBER from .env so the number never needs
 * to be hardcoded in components.
 */

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || '919909109074';

/**
 * Formats a number pair into Indian rupee range notation: ₹50,000 – ₹60,000
 */
export function formatPriceRange(min, max) {
  if (!min && !max) return null;
  const fmt = (n) =>
    Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  if (min && max) return `₹${fmt(min)} – ₹${fmt(max)}`;
  if (min) return `From ₹${fmt(min)}`;
  if (max) return `Up to ₹${fmt(max)}`;
  return null;
}

/**
 * Helper to resolve primary image URL from product object
 */
export function getProductImageUrl(product) {
  if (!product) return null;
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    const first = product.imageUrls[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && first?.imageUrl) return first.imageUrl;
    if (typeof first === 'object' && first?.url) return first.url;
  }
  if (typeof product.imageUrl === 'string') return product.imageUrl;
  if (typeof product.image === 'string') return product.image;
  return null;
}

/**
 * Builds a wa.me click-to-chat URL for a product inquiry.
 * Includes product name, product code, price, metal color, webpage link,
 * and direct product image reference link (enabling WhatsApp preview).
 *
 * @param {object} product  - product object from Redux/API
 * @param {object} options  - optional extra parameters (metalColor, imageUrl, pageUrl)
 * @returns {string}        - full WhatsApp URL
 */
export function buildWhatsAppUrl(product, options = {}) {
  const name = product?.title || 'Bespoke Loupe Jewellery';
  const code = product?.productCode ? `Product Code: ${product.productCode}` : null;
  const priceRange = formatPriceRange(product?.minPrice, product?.maxPrice);
  const priceText = priceRange
    ? `Approx. Price: ${priceRange}`
    : (product?.discountedPrice || product?.price)
      ? `Price: ₹${Number(product.discountedPrice || product.price).toLocaleString('en-IN')}`
      : 'Price: Please share current price & details';

  // Extract Product Image URL for reference
  let rawImg = options?.imageUrl || getProductImageUrl(product);
  let imageUrl = null;
  if (rawImg) {
    if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
      imageUrl = rawImg;
    } else if (typeof window !== 'undefined') {
      imageUrl = `${window.location.origin}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
    }
  }

  // Extract Sparkle Video URL for reference
  let rawVid = options?.videoUrl || product?.videoUrl || product?.video || product?.sparkleVideo || product?.sparkleVideoUrl;
  let videoUrl = null;
  if (rawVid && typeof rawVid === 'string') {
    if (rawVid.startsWith('http://') || rawVid.startsWith('https://')) {
      videoUrl = rawVid;
    } else if (typeof window !== 'undefined') {
      videoUrl = `${window.location.origin}${rawVid.startsWith('/') ? '' : '/'}${rawVid}`;
    }
  }

  // Resolve Product Page URL
  let pageUrl = options?.pageUrl || null;
  const prodId = product?._id || product?.id;
  if (!pageUrl && prodId && typeof window !== 'undefined') {
    pageUrl = `${window.location.origin}/product/${prodId}`;
  } else if (!pageUrl && typeof window !== 'undefined' && window.location.pathname.includes('/product/')) {
    pageUrl = window.location.href;
  }

  const metalLine = options?.metalColor ? `Metal Preference: ${options.metalColor}` : null;
  const imageLine = imageUrl ? `📷 Product Image: ${imageUrl}` : null;
  const videoLine = videoUrl ? `🎥 Sparkle Video: ${videoUrl}` : null;
  const linkLine = pageUrl ? `🔗 Product Link: ${pageUrl}` : null;

  const lines = [
    'Hello Loupe Jewellery, I am interested in this product:',
    '',
    `Product Name: ${name}`,
    code,
    metalLine,
    priceText,
    imageLine,
    videoLine,
    linkLine,
    '',
    'Please share pricing, specs, and ordering details for this piece.',
  ].filter((line) => line !== null);

  const message = lines.join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp in a new tab (works on mobile and desktop).
 */
export function openWhatsApp(product, options = {}) {
  if (typeof window !== 'undefined') {
    window.open(buildWhatsAppUrl(product, options), '_blank', 'noopener,noreferrer');
  }
}
