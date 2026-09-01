const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    occasion: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    discountedPrice: {
        type: Number,
        default: 0,
    },
    discountPercent: {
        type: Number,
    },
    minPrice: {
        type: Number,
    },
    maxPrice: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    collectionName: {
        type: String,
        // required: true,
    },
    type: {
        type: String,
    },
    color: [{
        type: String,
    }],
    metalType: { type: String },
    metalPurity: { type: String },
    metalWeight: { type: Number },
    hallmarkCertification: { type: String },
    metalColor: { type: String },
    primaryStoneType: { type: String },
    stoneShape: { type: String },
    stoneWeight: { type: Number },
    ringSize: { type: String },
    chainLength: { type: String },
    pendantSize: { type: String },
    dimensions: { type: String },
    totalWeight: { type: Number },
    sizes: [
        {
            weight: { type: String, required: true },
            size: { type: String, required: false },
            stock: { type: Number },
        }
    ],
    imageUrls: [
        {
            imageUrl: { type: String }
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ratings",
        },
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reviews",
        },
    ],
    numRatings: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;