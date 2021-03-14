import { IUser } from './user.model';
import { ISteamItem, SteamItemSchema } from './steamItem.schema';
import { ISellOrder } from './sellOrder.model';
import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  seller: IUser;
  price: number;
  becomeTradable: Date;
  steamItem: ISteamItem;
  sellOrder: ISellOrder;
}

export const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    becomeTradable: {
      type: Date,
      required: true,
    },
    steamItem: SteamItemSchema,
    sellOrder: {
      type: Schema.Types.ObjectId,
      ref: 'SellOrder',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

const ProductModel: Model<IProduct> = model<IProduct>('Product', productSchema);

export default ProductModel;
