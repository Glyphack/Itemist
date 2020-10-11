import mongoose, { Schema, Document, model, Model } from 'mongoose';
import { IUser } from './user.model';

export interface ITag {
  name: string;
  category: string;
  color: string;
  categoryName: string;
}

export interface IProduct extends Document {
  seller: IUser;
  price: number;
  becomeTradable: Date;
  productId: string;
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
  description: string;
  tags: ITag;
}

const tagSchema: Schema = new Schema({
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
    productId: {
      type: String,
    },
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
      type: [String],
    },
    tags: {
      type: [tagSchema],
    },
  },
  { timestamps: true },
);

const ProductModel: Model<IProduct> = model<IProduct>('Product', productSchema);

export default ProductModel;
