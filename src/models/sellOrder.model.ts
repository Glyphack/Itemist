import { IUser } from './user.model';
import { ITradeOffer } from './tradeOffer.model';
import mongoose, { Model, model, Document } from 'mongoose';

export interface ISellOrder extends Document {
  seller: IUser;
  price: number;
  appId: string;
  contextId: string;
  assetId: string;
  tradeOffer: ITradeOffer;
  success: boolean;
  state?: 'for-sell' | 'sold' | 'canceled';
}

const sellOrderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
    },
    appId: {
      type: String,
    },
    contextId: {
      type: String,
    },
    assetId: {
      type: String,
    },
    tradeOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TradeOffer',
    },
    success: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      enum: ['for-sell', 'sold', 'canceled'],
    },
  },
  { timestamps: true },
);

const SellOrderModel: Model<ISellOrder> = model<ISellOrder>('SellOrder', sellOrderSchema);

export default SellOrderModel;
