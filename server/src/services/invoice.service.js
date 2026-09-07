const PDFDocument = require('pdfkit');

const buildInvoice = (order, res) => {
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);
    
    // Add company header
    doc.fontSize(25).fillColor('#3c7399').text('LOUPE JEWELLERY', { align: 'center' });
    doc.fontSize(12).fillColor('#94a3b8').text('INVOICE', { align: 'center' });
    doc.moveDown(2);

    doc.fillColor('black');

    // Order Details
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    if (order.createdAt) {
        doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    }
    doc.text(`Status: ${order.orderStatus}`);
    doc.moveDown();

    // Customer & Shipping
    if (order.user) {
        doc.text(`Customer: ${order.user.firstName} ${order.user.lastName}`);
    }
    if (order.shippingAddress) {
        doc.text(`Shipping Address:`);
        doc.text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`);
        doc.text(`${order.shippingAddress.streetAddress}`);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`);
        doc.text(`Mobile: ${order.shippingAddress.mobile}`);
    }
    doc.moveDown();

    // Items
    doc.fontSize(14).fillColor('#3c7399').text('Order Items', { underline: true });
    doc.fillColor('black').fontSize(12);
    doc.moveDown(0.5);
    
    if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.product?.title || 'Product'}`);
            doc.fontSize(10).fillColor('gray')
               .text(`Quantity: ${item.quantity} | Size: ${item.size || 'N/A'} | Weight: ${item.weight || 'N/A'}g`);
            doc.fillColor('black').text(`Price: Rs.${item.price}`);
            doc.moveDown(0.5);
            doc.fontSize(12); // reset font size for next item
        });
    }
    doc.moveDown();

    // Totals
    const startX = doc.page.width - 250;
    
    doc.fontSize(12);
    doc.text(`Total Price: Rs.${order.totalPrice}`, startX);
    doc.text(`Discount: Rs.${order.totalPrice - order.totalDiscountedPrice}`, startX);
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#3c7399').text(`Net Amount: Rs.${order.totalDiscountedPrice}`, startX);

    // Footer
    doc.moveDown(4);
    doc.fontSize(10).fillColor('gray').text('Thank you for shopping with Loupe Jewellery!', { align: 'center' });

    doc.end();
};

module.exports = { buildInvoice };
