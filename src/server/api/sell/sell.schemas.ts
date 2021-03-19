import { AuthenticatedRequest } from '../../../types/request';

export interface CreateSellOrderRequest extends AuthenticatedRequest {
  body: { price: number; appId: number; contextId: number; assetId: string };
}
