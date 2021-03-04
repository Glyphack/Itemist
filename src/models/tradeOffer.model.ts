import { IUser } from './user.model';
import mongoose, { model, Model } from 'mongoose';

export interface ITradeOffer extends mongoose.Document {
  user: IUser;
  offerId: string;
  tradeStatus?: 'sent' | 'successful' | 'failed';
}

const TradeOfferSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    offerId: {
      type: String,
    },
    tradeStatus: {
      type: String,
      enum: ['pending', 'sent', 'successful', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

TradeOfferSchema.index({ offerId: 1 }, { unique: true });
const TradeOfferModel: Model<ITradeOffer> = model<ITradeOffer>('TradeOffer', TradeOfferSchema);

export default TradeOfferModel;
