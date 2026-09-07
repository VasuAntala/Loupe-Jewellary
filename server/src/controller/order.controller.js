const orderService = require('../services/order.service.js');
const invoiceService = require('../services/invoice.service.js');

const createOrder = async(req, res) => {
    const user = await req.user;

    try {
        let createdOrder = await orderService.createOrder(user, req.body);
        return res.status(201).send(createdOrder);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const findOrderById = async(req, res) => {
    const user = await req.user;

    try {
        let createdOrder = await orderService.findOrderById(req.params.id);
        return res.status(201).send(createdOrder);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const orderHistory = async(req, res) => {
    const user = await req.user;
    try {
        let createdOrder = await orderService.usersOrderHistory(user._id);
        return res.status(201).send(createdOrder);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const cancelOrder = async(req, res) => {
    try {
        await orderService.cancelOrderByUser(req.params.id);
        return res.status(200).send({ message: "Order cancelled successfully", success: true });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const exportInvoice = async(req, res) => {
    try {
        let order = await orderService.findOrderById(req.params.id);
        
        // Ensure user owns this order
        const user = await req.user;
        if (order.user._id.toString() !== user._id.toString()) {
            return res.status(403).send({ error: "Unauthorized access to this order's invoice." });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
        
        invoiceService.buildInvoice(order, res);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createOrder,
    findOrderById,
    orderHistory,
    cancelOrder,
    exportInvoice
}
