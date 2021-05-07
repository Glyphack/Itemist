import ProductModel from './product.model';
import { connectToDatabase, closeDatabase } from '../../../utils/tests/dbHandler';
import { app } from '../../../utils/tests/server';
import supertest from 'supertest';

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => await closeDatabase());

beforeEach(async () => {
  await ProductModel.create({
    seller: 'sdfsdfdsfdsf',
    price: 1,
    becomeTradable: 1,
    sellOrder: 'sdfsdfdsfdsf',
  });
});

describe('product controller', () => {
  it('retruns list of products', async () => {
    const response = await supertest(app).get('/v1/products');
    expect(response.status).toEqual(200);
  });
});
