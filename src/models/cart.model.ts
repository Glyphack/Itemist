import mongoose, { model, Model } from 'mongoose';
import { IUser } from './user.model';
import { IProduct } from './product.model';

export interface ICart extends mongoose.Document {
  user: IUser;
  products: IProduct[];
}

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
});
const CartModel: Model<ICart> = model('Cart', cartSchema);

export default CartModel;
