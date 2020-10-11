import { Document, model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema(
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
  },
  { timestamps: true },
);

export interface IUser extends Document {
  name: string;
  steamId: string;
  avatar: string;
  profileUrl: string;
  tradeUrl: string;
  wallet: { balance: number };
}

const UserModel: Model<IUser> = model<IUser>('User', userSchema);

export default UserModel;
