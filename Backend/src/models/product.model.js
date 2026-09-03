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
    },
    tags: [{
        type: String,
    }],
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
    productCode: { type: String },
    status: { type: String, default: 'active' },
    priceNote: { type: String },

    // --- Repeatable Dimensions ---
    dimensionsList: [
        {
            label: { type: String },
            value: { type: String },
            unit: { type: String }
        }
    ],

    // --- Repeatable Diamond Specifications ---
    diamondDetails: [
        {
            diamondType: { type: String },
            diamondSize: { type: String },
            diamondDiameter: { type: String },
            weightPerPiece: { type: String },
            pieces: { type: Number },
            totalWeight: { type: String }
        }
    ],

    // --- Repeatable Metal Specifications ---
    metalDetails: [
        {
            metalType: { type: String },
            purity: { type: String },
            finalWeight: { type: String },
            unit: { type: String }
        }
    ],

    // --- Chain / Chaki Information ---
    includesChain: { type: String, default: 'No' },
    chainWeight: { type: String },
    chakiWeight: { type: String },

    // --- Additional Flexible Specifications ---
    additionalSpecifications: [
        {
            label: { type: String },
            value: { type: String }
        }
    ],

    // --- Customer Visibility Flags ---
    // Admin can toggle whether technical weight data appears on the customer page
    showDiamondDetails: { type: Boolean, default: false },
    showMetalDetails: { type: Boolean, default: false },
    showWeightDetails: { type: Boolean, default: false },

    // --- Legacy / other fields ---
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
            imageUrl: { type: String },
            publicId: { type: String },
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