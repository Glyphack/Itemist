import SellOrderModel, { ISellOrder } from '../../models/sellOrder.model';

async function editSellOrderPrice(id, newPrice): Promise<ISellOrder> {
  return SellOrderModel.updateOne(
    { _id: id }, { price: newPrice },
  );
}

export = { editSellOrderPrice };
