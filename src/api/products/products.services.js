const {Product} = require('../../models/product.model');

async function createProductFromSellOrder(sellOrder, item) {
  let becomeTradable = new Date();
  becomeTradable.setDate(new Date().getDate()+Number(item.market_tradable_restriction));
  await Product.create({
    seller: sellOrder.seller,
    price: sellOrder.price,
    becomeTradable: becomeTradable,
    productId: item.assetid,
    appId: item.appid,
    classId: item.classid,
    instanceId: item.instanceid,
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
    tags: item.tags
  });
}

module.exports = {createProductFromSellOrder};
