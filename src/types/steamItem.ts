import { ITag } from '../models/product.model';
/* eslint-disable camelcase */
export default interface Item {
  id: string;
  assetid: string;
  contextid: string;
  appid: string;
  classid: string;
  instanceid: string;
  amount: string;
  pos: string;
  name: string;
  market_name: string;
  market_hash_name: string;
  name_color: string;
  background_color: string;
  type: string;
  tradable: string;
  marketable: string;
  commodity: string;
  market_tradable_restriction: string;
  market_marketable_restriction: string;
  descriptions: string[];
  fraudwarnings: string[];
  app_data?: Record<string, unknown>;
  tags: ITag[];
  icon_url: string;
  icon_url_large: string;
}
