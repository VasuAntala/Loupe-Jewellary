const mongoose = require('mongoose');
const Address = require('../models/address.model.js');
const Order = require('../models/order.model.js');
const OrderItem = require('../models/orderItems.model.js');
const cartService = require('./cart.service.js');

async function createOrder(user, shippAddress) {
    let address;

    if (shippAddress) {
        // Handle both nested and flat address objects
        const addressData = shippAddress.address || shippAddress;

        // Map fields explicitly to handle potential naming variations
        const mappedAddress = {
            firstName: addressData.firstName?.trim() || '',
            lastName: addressData.lastName?.trim() || '',
            streetAddress: addressData.streetAddress?.trim() || '',
            city: addressData.city?.trim() || '',
            state: addressData.state?.trim() || '',
            zipCode: (addressData.zipCode || addressData.zip || '').toString().trim(),
            mobile: (addressData.mobile || addressData.phoneNumber || '').toString().trim()
        };

        // Basic validation to prevent saving completely empty address documents
        const isAddressValid = mappedAddress.firstName && mappedAddress.streetAddress && mappedAddress.mobile;

        if (addressData._id) {
            let existAddress = await Address.findById(addressData._id);
            address = existAddress;
        } else if (isAddressValid) {
            // Deduplication logic: Check if an identical address already exists for this user in memory
            // ONLY reuse if the fields are actually present
            let existingAddress = user.address?.find(addr =>
                addr.firstName?.trim() === mappedAddress.firstName &&
                addr.lastName?.trim() === mappedAddress.lastName &&
                addr.streetAddress?.trim() === mappedAddress.streetAddress &&
                addr.city?.trim() === mappedAddress.city &&
                addr.state?.trim() === mappedAddress.state &&
                String(addr.zipCode || '').trim() === mappedAddress.zipCode &&
                String(addr.mobile || '').trim() === mappedAddress.mobile &&
                addr.firstName // Ensure the existing one isn't blank either
            );

            if (existingAddress) {
                console.log("Found existing address in memory:", existingAddress._id);
                address = existingAddress;
            } else {
                console.log("No existing address found in memory. Creating new one.");
                address = new Address({
                    ...mappedAddress,
                    user: user._id
                });
                await address.save();

                user.address.push(address);
                await user.save();
            }
        }
    }

    const cart = await cartService.findUserCart(user._id);
    const orderItems = [];

    for (let item of cart.cartItems) {
        const orderItem = new OrderItem({
            price: item.price,
            product: item.product,
            quantity: item.quantity,
            weight: item.weight,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.discountedPrice,
        })

        const createdOrderItem = await orderItem.save();
        orderItems.push(createdOrderItem);
    }

    const createdOrder = new Order({
        user: user._id,
        orderItems,
        totalPrice: cart.totalPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
        discount: cart.discount,
        totalItem: cart.totalItem,
        shippingAddress: address,
    })

    const savedOrder = await createdOrder.save();

    // Return the populated order to ensure frontend has all data (like address fields) immediately
    return await findOrderById(savedOrder._id);
}


// Below methods are for admin
async function placeOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "PLACED";
    order.paymentDetails.paymentStatus = "COMPLETED";

    return await order.save();
}

async function confirmedOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "CONFIRMED";

    return await order.save();
}

async function shippedOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "SHIPPED";

    return await order.save();
}

async function deliveredOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "DELIVERED";

    return await order.save();
}

async function cancelledOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "CANCELED";

    return await order.save();
}

async function findOrderById(orderId) {
    const order = Order.findById(orderId)
        .populate("user")
        .populate({ path: "orderItems", populate: { path: "product" } })
        .populate("shippingAddress")

    return order;
}

async function usersOrderHistory(userId) {
    try {
        const orders = await Order.find({ user: new mongoose.Types.ObjectId(userId) })
            .populate({ path: "orderItems", populate: { path: "product" } })
            .populate("shippingAddress")
            .sort({ createdAt: -1 })
            .lean();

        return orders;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAllOrders() {
    try {
        return await Order.find({ orderStatus: { $ne: "DELETED" } })
            .populate({ path: "orderItems", populate: { path: "product" } })
            .populate('user')
            .populate("shippingAddress")
            .sort({ createdAt: -1 })
            .lean();
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteOrder(orderId, reason) {
    const order = await findOrderById(orderId);
    order.orderStatus = "DELETED";
    order.adminMessage = reason;
    return await order.save();
}

async function cancelOrderByUser(orderId) {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    // Enforce 3-day cancellation window
    const ORDER_CANCEL_DAYS = 3;
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const diffInMs = now - orderDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays > ORDER_CANCEL_DAYS) {
        throw new Error(`Cancellation window has expired. Orders can only be cancelled within ${ORDER_CANCEL_DAYS} days of placement.`);
    }

    // To "remove" from admin side as requested, we set status to DELETED
    order.orderStatus = "DELETED";
    order.adminMessage = "Order cancelled by customer";
    return await order.save();
}

module.exports = {
    createOrder,
    placeOrder,
    confirmedOrder,
    shippedOrder,
    deliveredOrder,
    cancelledOrder,
    findOrderById,
    usersOrderHistory,
    getAllOrders,
    deleteOrder,
    cancelOrderByUser
}
