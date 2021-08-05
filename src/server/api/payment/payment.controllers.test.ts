import TransactionModel from './payment.model';
import UserModel from '../../../server/api/profile/profile.model';
import { closeDatabase, connectToDatabase } from '../../../utils/tests/dbHandler';
import { getAuthenticationHeader } from '../../../utils/tests/request';
import { factory } from 'fakingoose';
import supertest from 'supertest';
import { app } from '../../../utils/tests/server';

beforeAll(async () => {
  await connectToDatabase();
  const user = await UserModel.create(
    factory(UserModel, {
      steamId: {
        value: (object) => 'user1',
      },
    }).generate(),
  );
  await TransactionModel.create({ user: user, status: 'pending', orderId: 'TEST' });
});

afterAll(async () => {
  await closeDatabase();
});

describe('transactionHistory Controller', () => {
  it('returns list of transactions', async () => {
    const response = await supertest(app)
      .get('/v1/payment/history')
      .set(getAuthenticationHeader('user1'));
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([{ products: [], status: 'در حال انجام', orderId: 'TEST' }]);
  });
});
