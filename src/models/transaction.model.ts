import { Document, model, Schema } from 'mongoose';
import { IUser } from './user.model';
import { IProduct } from './product.model';

const transactionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      required: true,
    },
    authority: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed', 'Error Occured'],
    },
    amount: {
      type: Number,
    },
    refId: {
      type: String,
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
}

export default model<ITransaction>('Transaction', transactionSchema);
