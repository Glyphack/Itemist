import { connectToDatabase, closeDatabase, clearDatabase } from '../../utils/tests/dbHandler';
import { app } from '../../utils/tests/server';
import UserModel from '../../server/api/profile/profile.model';
import supertest from 'supertest';
const { factory } = require('fakingoose');

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

beforeEach(async () => {
  await UserModel.create(factory(UserModel).generate());
});

describe('jwt middleware', () => {
  it('return error if request is not authenticated', async () => {
    const response = await supertest(app).get('/v1/profile');
    expect(JSON.parse(response.text)).toEqual({
      type: 'UnAthenticated',
      title: 'Login Required',
      detail: 'Login to continue',
    });
  });
});
