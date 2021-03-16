import { Type } from 'class-transformer';

export class ProductSerializer {
  @Type(() => SteamItemSerializer)
  steamItem: SteamItemSerializer;
  price: number;
  becomeTradable: Date;
}

class SteamItemSerializer {
  appId: string;
  classId: string;
  instanceId: string;
  assetId: string;
  contextId: string;
  iconUrl: string;
  iconUrlLarge: string;
  name: string;
  marketHashName: string;
  marketName: string;
  nameColor: string;
  backgroundColor: string;
  type: string;
  marketable: string;
  commodity: string;
  marketTradableRestriction: string;
  marketMarketableRestriction: string;
  @Type(() => DescriptionSerializer)
  descriptions: DescriptionSerializer[];
  @Type(() => TagSerializer)
  tags: TagSerializer[];
}

class TagSerializer {
  internalName: string;
  name: string;
  category: string;
  color: string;
  categoryName: string;
}

class DescriptionSerializer {
  type: string;
  value: string;
  color: string;
}
