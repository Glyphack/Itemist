const { manager } = require('../../utils/trade_offer_manager');
const winston = require('../../config/winston');
const Product = require('../../models/product.model');

async function createProductFromSellOrder(sellOrder) {
  manager.getInventoryContents(
    sellOrder.appId,
    sellOrder.contextId,
    true,
    async (error, inventory) => {
      if (error) {
        winston.log(error);
        throw Error(error);
      } else {
        const item = inventory.find((i) => i.assetid === sellOrder.assetId);
        if (item === undefined) {
          winston.error(`Could not find Item from sellOrder ${sellOrder} in inventory`);
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
    },
  );
}

module.exports = { createProductFromSellOrder };
