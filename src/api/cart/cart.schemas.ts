import { AuthenticatedRequest } from '../../types/request';

export interface AddToCartRequest extends AuthenticatedRequest {
  body: {
    productId: string;
  };
}

export type RemoveFromCartRequest = AddToCartRequest;
