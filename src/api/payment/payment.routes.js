const express = require("express");
const {verifyPayment} = require("./payment.controllers");
const paymentRouter = express.Router();

paymentRouter.get('/verify', verifyPayment);

module.exports = {paymentRoutes: paymentRouter};
