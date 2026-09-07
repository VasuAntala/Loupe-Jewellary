require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
    next()
});

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});


app.get('/', (req, res) => {
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


module.exports = app;