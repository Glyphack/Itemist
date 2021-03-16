import editSellOrderPrice from './sell.services';
import SellOrderModel from './sellOrder.model';
import { AuthenticatedRequest } from '../../types/request';
import { Response } from 'express';

async function editSellOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await editSellOrderPrice(req.body.id, req.body.price);
  if (result.n !== 1) {
    res.statusCode = 400;
    res.json({ detail: 'cannot find sell order with that id' });
    return;
  }
  const editedSellOrder = await SellOrderModel.findById(req.body.id)
    .populate('seller', 'name')
    .exec();
  res.json(editedSellOrder);
}

export default editSellOrder;
