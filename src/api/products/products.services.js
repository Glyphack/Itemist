const {logger} = require('../../utils/winston');
const Product = require('../../models/product.model');
const {getBotInventory} = require("../../utils/bot");

async function createProductFromSellOrder(sellOrder, newAssetId) {
  const inventory = await getBotInventory(sellOrder.appId, sellOrder.contextId, false);
  const item = inventory.find((i) => i.assetid === newAssetId);
  if (item === undefined) {
    logger.error(`Could not find Item for ${sellOrder} in with id ${newAssetId} inventory`);
  } else {
    Product.create({
      seller: sellOrder.seller,
      price: sellOrder.price,
      productId: item.assetid,
      appId: item.appid,
      classId: item.classid,
      instanseId: item.instanceid,
      assetId: item.assetid,
      contextId: item.contextid,
      iconUrl: item.icon_url,
      iconUrlLarge: item.icon_url_large,
      name: item.name,
      post: item.pos,
      marketHashName: item.market_hash_name,
      marketName: item.market_name,
      nameColor: item.name_color,
      backgroundColor: item.background_color,
      type: item.type,
      marketable: item.marketable,
      commodity: item.commodity,
      descriptions: item.descriptions.map((x) => x.value),
    });
  }
}

module.exports = {createProductFromSellOrder};
