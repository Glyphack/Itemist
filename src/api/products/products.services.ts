import Product from './product.model';
import { ISellOrder } from '../sell/sellOrder.model';
import RawItem from '../../types/steamItem';
import { convertRawSteamItemToSteamItem } from '../../utils/steam/steam';

async function createProductFromSellOrder(sellOrder: ISellOrder, item: RawItem): Promise<void> {
  const becomeTradable = new Date();
  becomeTradable.setDate(new Date().getDate() + Number(item.market_tradable_restriction) + 1);
  const product = new Product({
    seller: sellOrder.seller,
    price: sellOrder.price,
    becomeTradable,
    steamItem: convertRawSteamItemToSteamItem(item),
    sellOrder: sellOrder,
  });
  await product.save();
}

export = createProductFromSellOrder;
