import Product from '../../models/product.model';
import { ISellOrder } from '../../models/sellOrder.model';
import RawItem from '../../types/steamItem';

async function createProductFromSellOrder(sellOrder: ISellOrder, item: RawItem): Promise<void> {
  const becomeTradable = new Date();
  becomeTradable.setDate(new Date().getDate() + Number(item.market_tradable_restriction));
  const product = new Product({
    seller: sellOrder.seller,
    price: sellOrder.price,
    becomeTradable,
    steamItem: {
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
      descriptions: item.descriptions.map((x) => {
        return { type: x.type, value: x.value, color: x.color };
      }),
      tags: item.tags,
    },
  });
  product.save();
}

export = createProductFromSellOrder;
