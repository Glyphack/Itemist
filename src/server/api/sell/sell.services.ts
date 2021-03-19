import SellOrderModel, { ISellOrder } from './sellOrder.model';
import { UpdateQuery } from 'mongoose';

export default async function editSellOrderPrice(
  id: string,
  newPrice: number,
): Promise<UpdateQuery<ISellOrder>> {
  return await SellOrderModel.updateOne({ _id: id }, { price: newPrice });
}
