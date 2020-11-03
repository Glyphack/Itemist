import { AuthenticatedRequest } from '../../types/request';
export interface GetUserInventoryRequest extends AuthenticatedRequest {
  query: { name: string };
}
