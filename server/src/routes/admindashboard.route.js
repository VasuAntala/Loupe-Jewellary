const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controller/admindashboard.controller.js");

router.get("/totalSales", adminDashboardController.getTotalSales);
router.get("/totalOrders", adminDashboardController.getTotalOrders);
router.get("/totalCustomers", adminDashboardController.getTotalCustomers);
router.get("/totalDeliveredOrders", adminDashboardController.gettotaldeliveredorders);
router.get("/totalCancelledOrders", adminDashboardController.getTotalCancelledOrders);
router.get("/latestOrders", adminDashboardController.getLatestOrders);
router.get("/weeklyStats", adminDashboardController.getWeeklyStats);
router.get("/allProducts", adminDashboardController.getAllProducts);
router.get("/categoryDistribution", adminDashboardController.getCategoryDistribution);

module.exports = router;
