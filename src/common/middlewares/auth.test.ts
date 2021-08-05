import { connectToDatabase, closeDatabase } from '../../utils/tests/dbHandler';
import { app } from '../../utils/tests/server';
import { getAuthenticationHeader } from '../../utils/tests/request';
import UserModel from '../../server/api/profile/profile.model';
import supertest from 'supertest';
import { factory } from 'fakingoose';

beforeAll(async () => {
  await connectToDatabase();
  await UserModel.create(
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

beforeEach(async () => {});

describe('jwt middleware', () => {
  it('return error if request is not authenticated', async () => {
    const response = await supertest(app).get('/v1/profile');
    expect(JSON.parse(response.text)).toEqual({
      type: 'UnAuthenticated',
      title: 'Login Required',
      detail: 'Login to continue',
    });
    expect(response.status).toEqual(401);
  });
  it('return OK if request is authenticated', async () => {
    const response = await supertest(app).get('/v1/profile').set(getAuthenticationHeader('user1'));
    expect(response.status).toEqual(200);
  });
});
