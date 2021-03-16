export interface TradeOfferItemInfo {
  appId: string;
  assetId: string;
  contextId: string;
}

export interface SendProductJob {
  tradeUrl: string;
  items: TradeOfferItemInfo[];
}
