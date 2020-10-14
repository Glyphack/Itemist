/* eslint-disable camelcase */

export interface IRawTag {
  internal_name: string;
  name: string;
  category: string;
  color: string;
  category_name: string;
}

export interface IRawDescription {
  type: string;
  value: string;
  color: string;
  app_data?: Record<string, unknown>;
}

export default interface RawItem {
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
  descriptions: IRawDescription[];
  fraudwarnings: string[];
  tags: IRawTag[];
  icon_url: string;
  icon_url_large: string;
  // eslint-disable-next-line semi
}
