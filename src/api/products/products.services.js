const {logger} = require('../../utils/winston');
const {Product} = require('../../models/product.model');

async function createProductFromSellOrder(sellOrder, item) {
  if (item === undefined) {
    logger.error(`Could not create product for ${sellOrder} with id ${item.assetid}`);
    return
  }
  await Product.create({
    seller: sellOrder.seller,
    price: sellOrder.price,
    isTradable: item.tradable,
    productId: item.assetid,
    appId: item.appid,
    classId: item.classid,
    instanseId: item.instanceid,
    assetId: item.assetid,
    contextId: item.contextid,
    iconUrl: item.icon_url,
    iconUrlLarge: item.icon_url_large,
    name: item.name,
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

module.exports = {createProductFromSellOrder};
