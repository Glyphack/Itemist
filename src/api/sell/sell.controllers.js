const { editSellOrderPrice } = require('./sell.services');
const SellOrder = require('../../models/sellOrder.model');

async function editSellOrder(req, res) {
  const result = await editSellOrderPrice(req.body.id, req.body.price);
  if (result.n !== 1) {
    res.statusCode = 400;
    res.json({ detail: 'cannot find sell order with that id' });
  } else if (result.nModified !== 1) {
    res.statusCode = 500;
    res.json({});
  }
  const editedSellOrder = await SellOrder.findById(req.body.id).exec();
  res.json(editedSellOrder);
}

module.exports = { editSellOrder };
