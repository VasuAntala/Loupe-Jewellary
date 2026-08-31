/**
 * whatsapp.js
 * Centralised WhatsApp inquiry helpers for Loupe Jeweller.
 * Reads REACT_APP_WHATSAPP_NUMBER from .env so the number never needs
 * to be hardcoded in components.
 */

export const WHATSAPP_NUMBER =
  process.env.REACT_APP_WHATSAPP_NUMBER || '919909109074';

/**
 * Formats a number into Indian rupee notation: 1,00,000
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
 * Builds a wa.me click-to-chat URL for a product inquiry.
 *
 * @param {object} product  - product object from Redux/API
 * @returns {string}        - full WhatsApp URL
 */
export function buildWhatsAppUrl(product) {
  const name = product?.title || 'this product';
  const id = product?._id || 'N/A';
  const priceRange = formatPriceRange(product?.minPrice, product?.maxPrice);
  const priceText = priceRange
    ? `Approx. Price: ${priceRange}`
    : 'Price: Please share the current price';

  const message = [
    'Hello, I am interested in this jewellery product:',
    `Product Name: ${name}`,
    `Product ID: ${id}`,
    priceText,
    '',
    'Please share the current / final price and details.',
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp in a new tab (works on mobile and desktop).
 */
export function openWhatsApp(product) {
  window.open(buildWhatsAppUrl(product), '_blank', 'noopener,noreferrer');
}
