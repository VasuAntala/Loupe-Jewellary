const express = require('express');
const https = require('https');
const router = express.Router();

// In-memory cache & fallback market rates
let cachedGoldData = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

// Default fallback market rates (Gold 24K ~ ₹7,450/g in India)
const FALLBACK_GOLD = {
    usdPerOz: 2500.00,
    usdToInr: 83.90,
    pricePerGram24k: 7450,
    pricePerGram22k: 6829,
    pricePerGram18k: 5588,
    isFallback: true,
    fetchedAt: new Date().toISOString()
};

// Helper: HTTPS GET with timeout & redirect support
function fetchJson(url, timeoutMs = 3000, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) return reject(new Error('Too many redirects'));

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
                'Accept': 'application/json, */*',
            }
        };

        const req = https.get(url, options, (res) => {
            if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
                return fetchJson(res.headers.location, timeoutMs, redirectCount + 1).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            let raw = '';
            res.on('data', chunk => (raw += chunk));
            res.on('end', () => {
                try { resolve(JSON.parse(raw)); }
                catch (e) { reject(new Error('JSON parse error')); }
            });
        });

        req.on('error', (e) => reject(new Error(`Network: ${e.message}`)));
        req.setTimeout(timeoutMs, () => {
            req.destroy();
            reject(new Error('Network timeout'));
        });
    });
}

// GET /api/gold-price
router.get('/', async (req, res) => {
    const now = Date.now();

    // 1. Return valid cache if within TTL
    if (cachedGoldData && (now - lastCacheTime) < CACHE_TTL_MS) {
        return res.status(200).json(cachedGoldData);
    }

    try {
        const [yahooData, fxData] = await Promise.all([
            fetchJson('https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1d', 3000),
            fetchJson('https://open.er-api.com/v6/latest/USD', 3000),
        ]);

        const usdPerOz = yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice;
        const usdToInr = fxData?.rates?.INR || 83.90;

        if (usdPerOz && typeof usdPerOz === 'number') {
            const TROY_OZ_TO_GRAMS = 31.1035;
            const pricePerGram24k = (usdPerOz * usdToInr) / TROY_OZ_TO_GRAMS;

            cachedGoldData = {
                usdPerOz: parseFloat(usdPerOz.toFixed(2)),
                usdToInr: parseFloat(usdToInr.toFixed(2)),
                pricePerGram24k: Math.round(pricePerGram24k),
                pricePerGram22k: Math.round(pricePerGram24k * 0.9167),
                pricePerGram18k: Math.round(pricePerGram24k * 0.75),
                isFallback: false,
                fetchedAt: new Date().toISOString(),
            };
            lastCacheTime = Date.now();
            return res.status(200).json(cachedGoldData);
        }
    } catch (err) {
        // Network timeout / TLS error / DNS error — caught silently without terminal log spam
    }

    // 2. Return previous cached data if available, else standard gold fallback rate
    if (cachedGoldData) {
        return res.status(200).json(cachedGoldData);
    }

    return res.status(200).json({
        ...FALLBACK_GOLD,
        fetchedAt: new Date().toISOString()
    });
});

module.exports = router;
