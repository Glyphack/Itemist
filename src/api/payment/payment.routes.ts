import { verifyPayment, transactionHistory } from './payment.controllers';
import jwtMiddleWare from '../../middlewares/auth';
import express from 'express';

const paymentRouter = express.Router();

paymentRouter.get('/verify', verifyPayment);
paymentRouter.get('/history', jwtMiddleWare, transactionHistory);

export default paymentRouter;
