import { app } from './server';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

async function sendAuthenticatedRequest(
  path: string,
  steamId: string,
): Promise<supertest.Response> {
  const token: string = jwt.sign(
    {
      steamId: steamId,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' },
  );
  return await supertest(app).get(path).set('Authorization', `Bearer ${token}`);
}

export { sendAuthenticatedRequest };
