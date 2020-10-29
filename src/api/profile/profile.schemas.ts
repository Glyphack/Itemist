import { AuthenticatedRequest } from '../../types/request';
export interface GetUserInventoryRequest extends AuthenticatedRequest {
  params: { query: string };
}
