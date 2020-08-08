const SellOrder = require('../../models/sellOrder.model');

async function editSellOrderPrice(id, newPrice) {
  return SellOrder.updateOne(
    { _id: id }, { price: newPrice },
  );
}

module.exports = { editSellOrderPrice };
