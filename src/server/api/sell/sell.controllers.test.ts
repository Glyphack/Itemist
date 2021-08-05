import SellOrderModel from './sellOrder.model';
import UserModel from '../../../server/api/profile/profile.model';
import { closeDatabase, connectToDatabase } from '../../../utils/tests/dbHandler';
import { getAuthenticationHeader } from '../../../utils/tests/request';
import { app } from '../../../utils/tests/server';
import { factory } from 'fakingoose';
import supertest from 'supertest';

beforeAll(async () => {
  await connectToDatabase();
  const user = await UserModel.create(
    factory(UserModel, {
      steamId: {
        value: (object) => 'user1',
      },
    }).generate(),
  );
});

afterAll(async () => {
  await closeDatabase();
});

describe('editSellOrder Controller', () => {
  it('returns 400 for not found sell order', async () => {
    const response = await supertest(app).put('/v1/sell/').set(getAuthenticationHeader('user1'));
    expect(response.status).toEqual(400);
  });
  it('edits a valid sell order', async () => {
    const sellOrder = await SellOrderModel.create(factory(SellOrderModel, {}).generate());
    const response = await supertest(app)
      .put('/v1/sell/')
      .send({ price: 10, id: sellOrder._id })
      .set(getAuthenticationHeader('user1'));
    expect(response.status).toEqual(200);
    expect((await SellOrderModel.findById(sellOrder._id)).price).toEqual(10);
  });
});
