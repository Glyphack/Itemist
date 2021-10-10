import { Document, model, Model, Schema } from 'mongoose';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    steamId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    tradeUrl: {
      type: String,
      default: '',
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

interface IWallet {
  balance: number;
}
export interface IUser extends Document {
  name: string;
  steamId: string;
  avatar: string;
  profileUrl: string;
  tradeUrl: string;
  balance: number;
  wallet: IWallet;
}

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
export { userSchema };
