const orderService = require('../services/order.service.js');
const invoiceService = require('../services/invoice.service.js');

const getAllOrders = async(req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const confirmedOrders = async(req, res) => {
    const orderId = req.params.orderId;

    try {
        const orders = await orderService.confirmedOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const shippedOrders = async(req, res) => {
    const orderId = req.params.orderId;

    try {
        const orders = await orderService.shippedOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const deliveredOrders = async(req, res) => {
    const orderId = req.params.orderId;

    try {
        const orders = await orderService.deliveredOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const cancelledOrders = async(req, res) => {
    const orderId = req.params.orderId;

    try {
        const orders = await orderService.cancelledOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const deleteOrder = async(req, res) => {
    const orderId = req.params.orderId;
    const { reason } = req.body;

    try {
        const orders = await orderService.deleteOrder(orderId, reason);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const exportInvoice = async(req, res) => {
    try {
        let order = await orderService.findOrderById(req.params.orderId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
        
        invoiceService.buildInvoice(order, res);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    getAllOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    deleteOrder,
    cancelledOrders,
    exportInvoice
}