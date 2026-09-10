const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(rootDir, '.env') });
const nodeEnv = process.env.NODE_ENV || 'development';
const envSpecificFile = path.resolve(rootDir, `.env.${nodeEnv}`);
if (fs.existsSync(envSpecificFile)) {
    dotenv.config({ path: envSpecificFile, override: true });
}

const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});


app.get('/check-api/', (req, res) => {
    return res.status(200).send({ message: 'welcome to backend', status: true })
})

const authRouters = require('./routes/auth.route.js');
app.use('/auth', authRouters);

const userRouters = require('./routes/user.route.js');
app.use('/api/users', userRouters);

const productRouter = require('./routes/product.route.js');
app.use('/api/products', productRouter);

const adminProductRouter = require('./routes/adminProduct.route.js');
app.use('/api/admin/products', adminProductRouter);

const cartRouter = require('./routes/cart.route.js');
app.use('/api/cart', cartRouter);

const cartItemRouter = require('./routes/cartItem.route.js');
app.use('/api/cart_item', cartItemRouter);

const wishRouter = require('./routes/wish.route.js');
app.use('/api/wish', wishRouter);

const orderRouter = require('./routes/order.route.js');
app.use('/api/orders', orderRouter);

const adminOrderRouter = require('./routes/adminOrder.route.js');
app.use('/api/admin/orders', adminOrderRouter);

const reviewRouter = require('./routes/review.route.js');
app.use('/api/reviews', reviewRouter);

const ratingRouter = require('./routes/rating.route.js');
app.use("/api/ratings", ratingRouter);

const paymentRouter = require('./routes/payment.routes.js');
app.use("/api/payment", paymentRouter);

const adminDashboardRouter = require('./routes/admindashboard.route.js');
app.use("/api/admin/dashboard", adminDashboardRouter);

// Cloudinary upload (images + videos via backend, authenticated)
const uploadRouter = require('./routes/upload.route.js');
app.use('/api/upload', uploadRouter);

// Sparkle Videos (Find Your Perfect Sparkle section)
const sparkleVideoRouter = require('./routes/sparkleVideo.route.js');
app.use('/api/sparkle-videos', sparkleVideoRouter);

// Gold Price Proxy (avoids CORS from browser)
const goldPriceRouter = require('./routes/goldPrice.route.js');
app.use('/api/gold-price', goldPriceRouter);

// Serve frontend static build if present (production / Hostinger unified deployment)
const possibleDistPaths = [
    path.join(__dirname, "../dist"),             // server/dist
    path.join(process.cwd(), "dist"),            // dist in current working directory
    path.join(__dirname, "dist"),                // server/src/dist
    path.join(__dirname, "../../Frontend/dist")  // Frontend/dist in local monorepo
];
const frontendDistPath = possibleDistPaths.find(p => fs.existsSync(p) && fs.existsSync(path.join(p, "index.html")));

if (frontendDistPath) {
    console.log(`[Static] Serving frontend build from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    // Handle SPA client routing: send index.html for non-API GET requests
    app.get("*", (req, res) => {
        // If an API or Auth route wasn't matched, return 404 JSON instead of HTML
        if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/check-api')) {
            return res.status(404).json({ message: `API route ${req.method} ${req.originalUrl} not found` });
        }
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
} else {
    // If frontend build not found, provide informative message on root
    app.get("/", (req, res) => {
        res.status(200).json({
            status: true,
            message: "Loupe Backend API is running.",
            hint: "To serve the frontend from this server, build the Frontend and paste the dist folder into server/dist"
        });
    });
}

// Central error handler
app.use((err, req, res, next) => {
    console.error(err.stack || err);
    const isProd = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).json({
        message: isProd ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
        ...(isProd ? {} : { stack: err.stack })
    });
});

module.exports = app;