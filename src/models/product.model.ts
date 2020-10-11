import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { IUser } from './user.model';
import { ISteamItem } from './steamItem.schema';

export interface IProduct extends Document {
  seller: IUser;
  price: number;
  becomeTradable: Date;
  steamItem: ISteamItem;
}

const productSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

const ProductModel: Model<IProduct> = model<IProduct>('Product', productSchema);

export default ProductModel;
