export interface TradeOfferItemInfo {
  appId: number;
  assetId: string;
  contextId: number;
}

export interface SendProductJob {
  tradeUrl: string;
  items: TradeOfferItemInfo[];
}
