const Order = require("../models/order.model.js");
const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");

const getTotalSales = async () => {
    try {
        const orders = await Order.find({ orderStatus: "DELIVERED" });
        const totalSales = orders.reduce((total, order) => total + order.totalPrice, 0);
        return { totalSales };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTotalOrders = async () => {
    try {
        const totalOrders = await Order.countDocuments();
        return { totalOrders };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTotalCustomers = async () => {
    try {
        const totalCustomers = await User.countDocuments({ role: "CUSTOMER" });
        return { totalCustomers };
    } catch (error) {
        throw new Error(error.message);
    }
}

const gettotaldeliveredorders = async () => {
    try {
        const totalDeliveredOrders = await Order.countDocuments({ orderStatus: "DELIVERED" });
        return { totalDeliveredOrders };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTotalCancelledOrders = async () => {
    try {
        const totalCancelledOrders = await Order.countDocuments({ orderStatus: "CANCELLED" });
        return { totalCancelledOrders };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getLatestOrders = async () => {
    try {
        const latestOrders = await Order.find()
            .populate("user")
            .populate("shippingAddress")
            .sort({ createdAt: -1 })
            .limit(5);
        return latestOrders;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getWeeklyStats = async () => {
    try {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const orders = await Order.find({
            createdAt: { $gte: lastWeek }
        });

        const stats = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize last 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            stats[dayName] = { name: dayName, Revenue: 0, Sales: 0, Cancel: 0 };
        }

        orders.forEach(order => {
            const dayName = days[new Date(order.createdAt).getDay()];
            if (stats[dayName]) {
                if (order.orderStatus === "DELIVERED") {
                    stats[dayName].Revenue += order.totalPrice;
                    stats[dayName].Sales += 1;
                } else if (order.orderStatus === "CANCELLED") {
                    stats[dayName].Cancel += 1;
                } else {
                    stats[dayName].Sales += 1;
                }
            }
        });

        // Convert to array and sort by day (current day last)
        const result = Object.values(stats).reverse();
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllProducts = async () => {
    try {
        const products = await Product.find().limit(5);
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCategoryDistribution = async () => {
    try {
        const orders = await Order.find({ orderStatus: "DELIVERED" })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: {
                        path: 'category'
                    }
                }
            });

        const categorySales = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (item.product && item.product.category) {
                    const categoryName = item.product.category.name;
                    if (!categorySales[categoryName]) {
                        categorySales[categoryName] = 0;
                    }
                    // Use discountedPrice if available, otherwise price
                    const price = item.discountedPrice || item.price || 0;
                    categorySales[categoryName] += price * item.quantity;
                }
            });
        });

        const result = Object.entries(categorySales).map(([name, sales]) => ({
            name,
            sales: Math.round(sales * 100) / 100
        }));

        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getTotalSales,
    getTotalOrders,
    getTotalCustomers,
    gettotaldeliveredorders,
    getTotalCancelledOrders,
    getLatestOrders,
    getWeeklyStats,
    getAllProducts,
    getCategoryDistribution
}
