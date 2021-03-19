import ProductModel from './product.model';
import { connectToDatabase, closeDatabase, clearDatabase } from '../../../utils/tests/dbHandler';
import { app } from '../../../utils/tests/server';
import supertest from 'supertest';

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => await clearDatabase());

beforeEach(async () => {
  await ProductModel.create({
    seller: 'sdfsdfdsfdsf',
    price: 1,
    becomeTradable: 1,
    sellOrder: 'sdfsdfdsfdsf',
  });
});
afterEach(async () => await closeDatabase());

describe('product controller', () => {
  it('retruns list of products', async () => {
    const response = await supertest(app).get('/v1/products');
    expect(response.status).toEqual(200);
  });
});
