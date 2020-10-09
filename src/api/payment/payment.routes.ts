import express from 'express';
import verifyPayment from './payment.controllers';

const paymentRouter = express.Router();

paymentRouter.get('/verify', verifyPayment);

export = { paymentRoutes: paymentRouter };
