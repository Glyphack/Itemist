import { UpdateQuery } from 'mongoose';
import SellOrderModel, { ISellOrder } from '../../models/sellOrder.model';

export default async function editSellOrderPrice(id, newPrice): Promise<UpdateQuery<ISellOrder>> {
  return SellOrderModel.updateOne(
    { _id: id }, { price: newPrice },
  );
}
