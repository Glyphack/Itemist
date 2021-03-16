import { IUser } from '../profile/profile.model';
import { ISellOrder } from '../sell/sellOrder.model';
import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  seller: IUser;
  price: number;
  becomeTradable: Date;
  steamItem: ISteamItem;
  sellOrder: ISellOrder;
  isAvailable: boolean;
}

export interface ISteamItem {
  appId: string;
  classId: string;
  instanceId: string;
  assetId: string;
  contextId: string;
  iconUrl: string;
  iconUrlLarge: string;
  name: string;
  marketHashName: string;
  marketName: string;
  nameColor: string;
  backgroundColor: string;
  type: string;
  marketable: string;
  commodity: string;
  marketTradableRestriction: string;
  marketMarketableRestriction: string;
  descriptions: IDescription[];
  tags: ITag[];
}

export interface ITag {
  internalName: string;
  name: string;
  category: string;
  color: string;
  categoryName: string;
}

export interface IDescription {
  type: string;
  value: string;
  color: string;
}

const tagSchema = new mongoose.Schema({
  internalName: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  categoryName: {
    type: String,
  },
});

const descriptionSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  value: {
    type: String,
  },
  color: {
    type: String,
  },
});

const SteamItemSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
  instanceId: {
    type: String,
    required: true,
  },
  assetId: {
    type: String,
    required: true,
  },
  contextId: {
    type: String,
    required: true,
  },
  iconUrl: {
    type: String,
  },
  iconUrlLarge: {
    type: String,
  },
  name: {
    type: String,
  },
  marketHashName: {
    type: String,
  },
  marketName: {
    type: String,
  },
  nameColor: {
    type: String,
  },
  backgroundColor: {
    type: String,
  },
  type: {
    type: String,
  },
  marketable: {
    type: Boolean,
  },
  commodity: {
    type: Boolean,
  },
  marketTradableRestriction: {
    type: String,
  },
  marketMarketableRestriction: {
    type: String,
  },
  descriptions: {
    type: [descriptionSchema],
  },
  tags: {
    type: [tagSchema],
  },
});

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
