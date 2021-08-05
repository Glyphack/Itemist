import { app } from './server';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

function getAuthenticationHeader(steamId: string): object {
  const token: string = jwt.sign(
    {
      steamId: steamId,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' },
  );
  return { Authorization: `Bearer ${token}` };
}

export { getAuthenticationHeader };
