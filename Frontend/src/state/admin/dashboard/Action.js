import { api } from "../../../config/apiConfig";
import {
    GET_DASHBOARD_STATS_REQUEST,
    GET_DASHBOARD_STATS_SUCCESS,
    GET_DASHBOARD_STATS_FAILURE,
    GET_LATEST_ORDERS_REQUEST,
    GET_LATEST_ORDERS_SUCCESS,
    GET_LATEST_ORDERS_FAILURE,
    GET_WEEKLY_STATS_REQUEST,
    GET_WEEKLY_STATS_SUCCESS,
    GET_WEEKLY_STATS_FAILURE,
    GET_ALL_PRODUCTS_REQUEST,
    GET_ALL_PRODUCTS_SUCCESS,
    GET_ALL_PRODUCTS_FAILURE,
    GET_CATEGORY_DISTRIBUTION_REQUEST,
    GET_CATEGORY_DISTRIBUTION_SUCCESS,
    GET_CATEGORY_DISTRIBUTION_FAILURE
} from "./ActionType";

export const getDashboardStats = () => async (dispatch) => {
    dispatch({ type: GET_DASHBOARD_STATS_REQUEST });
    try {
        const [sales, orders, customers, delivered, cancelled, productsRes] = await Promise.all([
            api.get("/api/admin/dashboard/totalSales"),
            api.get("/api/admin/dashboard/totalOrders"),
            api.get("/api/admin/dashboard/totalCustomers"),
            api.get("/api/admin/dashboard/totalDeliveredOrders"),
            api.get("/api/admin/dashboard/totalCancelledOrders"),
            api.get("/api/admin/dashboard/totalProducts").catch(() => null)
        ]);

        let totalProductsCount = productsRes?.data?.totalProducts;

        // Fallback: If totalProducts endpoint isn't deployed yet, derive from /api/products
        if (totalProductsCount === undefined || totalProductsCount === null) {
            try {
                const prodFallback = await api.get("/api/products", {
                    params: { category: "jewellery", pageSize: 1 }
                });
                totalProductsCount = prodFallback.data?.totalProducts || prodFallback.data?.totalPages || 0;
            } catch {
                totalProductsCount = null;
            }
        }

        const stats = {
            totalSales: sales.data.totalSales,
            totalOrders: orders.data.totalOrders,
            totalCustomers: customers.data.totalCustomers,
            totalDeliveredOrders: delivered.data.totalDeliveredOrders,
            totalCancelledOrders: cancelled.data.totalCancelledOrders,
            totalProducts: totalProductsCount
        };

        dispatch({ type: GET_DASHBOARD_STATS_SUCCESS, payload: stats });
    } catch (error) {
        dispatch({ type: GET_DASHBOARD_STATS_FAILURE, payload: error.message });
    }
};

export const getLatestOrders = () => async (dispatch) => {
    dispatch({ type: GET_LATEST_ORDERS_REQUEST });
    try {
        const response = await api.get("/api/admin/dashboard/latestOrders");
        dispatch({ type: GET_LATEST_ORDERS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_LATEST_ORDERS_FAILURE, payload: error.message });
    }
};

export const getWeeklyStats = () => async (dispatch) => {
    dispatch({ type: GET_WEEKLY_STATS_REQUEST });
    try {
        const response = await api.get("/api/admin/dashboard/weeklyStats");
        dispatch({ type: GET_WEEKLY_STATS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_WEEKLY_STATS_FAILURE, payload: error.message });
    }
};

export const getAllProducts = () => async (dispatch) => {
    dispatch({ type: GET_ALL_PRODUCTS_REQUEST });
    try {
        let response = await api.get("/api/admin/dashboard/allProducts");
        let products = Array.isArray(response.data) ? response.data : [];

        // If the response is limited (e.g. legacy limit of 5), fetch the complete inventory
        try {
            const fallbackRes = await api.get("/api/products", {
                params: { category: "jewellery", pageSize: 100 }
            });
            const fallbackList = fallbackRes.data?.content || (Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
            if (Array.isArray(fallbackList) && fallbackList.length > products.length) {
                products = fallbackList;
            }
        } catch {
            // Ignore fallback error and keep products from /allProducts
        }

        dispatch({ type: GET_ALL_PRODUCTS_SUCCESS, payload: products });
    } catch (error) {
        // If /api/admin/dashboard/allProducts fails, try fallback to /api/products
        try {
            const fallbackRes = await api.get("/api/products", {
                params: { category: "jewellery", pageSize: 100 }
            });
            const fallbackList = fallbackRes.data?.content || (Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
            dispatch({ type: GET_ALL_PRODUCTS_SUCCESS, payload: fallbackList });
        } catch (fallbackErr) {
            dispatch({ type: GET_ALL_PRODUCTS_FAILURE, payload: error.message });
        }
    }
};

export const getCategoryDistribution = () => async (dispatch) => {
    dispatch({ type: GET_CATEGORY_DISTRIBUTION_REQUEST });
    try {
        const response = await api.get("/api/admin/dashboard/categoryDistribution");
        dispatch({ type: GET_CATEGORY_DISTRIBUTION_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_CATEGORY_DISTRIBUTION_FAILURE, payload: error.message });
    }
};
