import { productSchema, IProduct } from '../products/product.model';
import { IUser } from '../profile/profile.model';
import { Document, Model, model, Schema } from 'mongoose';
import { customAlphabet } from 'nanoid';

const orderIdGenerator = customAlphabet('1234567890', 10);

const transactionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [productSchema],
    authority: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
    },
    amount: {
      type: Number,
    },
    refId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
      default: orderIdGenerator,
    },
  },
  { timestamps: true },
);

export interface ITransaction extends Document {
  user: IUser;
  products: IProduct[];
  authority: string;
  status: string;
  amount: number;
  refId: string;
  orderId: string;
}

const TransactionModel: Model<ITransaction> = model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;
