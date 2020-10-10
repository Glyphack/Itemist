import mongoose, { model, Model } from 'mongoose';
import { IUser } from './user.model';

export interface ITradeOffer extends mongoose.Document {
  user: IUser;
  offerId: string;
  tradeStatus?: 'Not sent' | 'Pending' | 'Successful' | 'Failed'
}

const TradeOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  offerId: {
    type: String,
  },
  tradeStatus: {
    type: String,
    enum: ['Not sent', 'Pending', 'Successful', 'Failed'],
    default: 'Not sent',
  },

});

TradeOfferSchema.index({ offerId: 1 }, { unique: true });
const TradeOfferModel: Model<ITradeOffer> = model<ITradeOffer>('TradeOffer', TradeOfferSchema);

export default TradeOfferModel;
