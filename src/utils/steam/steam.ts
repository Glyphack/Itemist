import { ISteamItem } from '../../models/steamItem.schema';
import RawItem from '../../types/steamItem';

export function convertRawSteamItemToSteamItem(item: RawItem): ISteamItem {
  return {
    appId: parseInt(item.appId),
    classId: item.classid,
    instanceId: item.instanceid,
    assetId: item.assetid,
    contextId: parseInt(item.contextid),
    iconUrl: item.icon_url,
    iconUrlLarge: item.icon_url_large,
    name: item.name,
    marketHashName: item.market_hash_name,
    marketName: item.market_name,
    marketTradableRestriction: item.market_tradable_restriction,
    marketMarketableRestriction: item.market_marketable_restriction,
    nameColor: item.name_color,
    backgroundColor: item.background_color,
    type: item.type,
    marketable: item.marketable,
    commodity: item.commodity,
    descriptions: item.descriptions.map((description) => {
      return { type: description.type, value: description.value, color: description.color };
    }),
    tags: item.tags.map((tag) => {
      return {
        internalName: tag.internal_name,
        name: tag.name,
        category: tag.category,
        color: tag.color,
        categoryName: tag.category_name,
      };
    }),
  };
}
