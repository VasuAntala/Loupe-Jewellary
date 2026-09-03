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
 * Builds a wa.me click-to-chat URL for a product inquiry.
 * Includes product name, code, and approx price range.
 *
 * @param {object} product  - product object from Redux/API
 * @returns {string}        - full WhatsApp URL
 */
export function buildWhatsAppUrl(product) {
  const name = product?.title || 'this product';
  const code = product?.productCode ? `Product Code: ${product.productCode}` : null;
  const priceRange = formatPriceRange(product?.minPrice, product?.maxPrice);
  const priceText = priceRange
    ? `Approx. Price: ${priceRange}`
    : 'Price: Please share the current price';

  const lines = [
    'Hello, I am interested in this jewellery product.',
    '',
    `Product Name: ${name}`,
    code,
    priceText,
    '',
    'Please share the current / final price and product details.',
  ].filter((line) => line !== null);

  const message = lines.join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp in a new tab (works on mobile and desktop).
 */
export function openWhatsApp(product) {
  window.open(buildWhatsAppUrl(product), '_blank', 'noopener,noreferrer');
}
