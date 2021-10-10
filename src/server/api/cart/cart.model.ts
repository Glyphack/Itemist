import { IProduct } from '../products/product.model';
import { IUser } from '../profile/profile.model';
import mongoose, { model, Schema } from 'mongoose';

export interface ICart {
  _id: string; // TODO: use a proper primary key
  user: IUser;
  products?: IProduct[];
}

const cartSchema = new Schema<ICart>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
});
const CartModel = model('Cart', cartSchema);

export default CartModel;
