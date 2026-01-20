const express = require('express');
const app = express();
const PORT = 8083;

app.use(express.json());

app.post('/payment/process', (req, res) => {
    const { orderId, amount, currency, paymentMethod } = req.body;

    console.log(`Processing payment for Order ${orderId}: ${currency} ${amount} via ${paymentMethod}`);

    // Simulate processing delay
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
            res.json({
                status: 'authorized',
                transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
                message: 'Payment processed successfully'
            });
        } else {
            res.status(402).json({
                status: 'declined',
                message: 'Payment declined by provider'
            });
        }
    }, 500);
});

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
