const dashboardService = require("../services/admindashboard.service.js");

const getTotalSales = async (req, res) => {
    try {
        const totalSales = await dashboardService.getTotalSales();
        return res.status(200).send(totalSales);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await dashboardService.getTotalOrders();
        return res.status(200).send(totalOrders);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getTotalCustomers = async (req, res) => {
    try {
        const totalCustomers = await dashboardService.getTotalCustomers();
        return res.status(200).send(totalCustomers);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const gettotaldeliveredorders = async (req, res) => {
    try {
        const totaldeliveredorders = await dashboardService.gettotaldeliveredorders();
        return res.status(200).send(totaldeliveredorders);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getTotalCancelledOrders = async (req, res) => {
    try {
        const totalcancelledorders = await dashboardService.getTotalCancelledOrders();
        return res.status(200).send(totalcancelledorders);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getLatestOrders = async (req, res) => {
    try {
        const latestOrders = await dashboardService.getLatestOrders();
        return res.status(200).send(latestOrders);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getWeeklyStats = async (req, res) => {
    try {
        const stats = await dashboardService.getWeeklyStats();
        return res.status(200).send(stats);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await dashboardService.getAllProducts();
        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getCategoryDistribution = async (req, res) => {
    try {
        const stats = await dashboardService.getCategoryDistribution();
        return res.status(200).send(stats);
    } catch (error) {
        return res.status(500).send(error.message);
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