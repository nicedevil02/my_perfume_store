import { sign } from 'jsonwebtoken';

export async function signJwtToken(payload: { userId: string }) {
  const secret = process.env.NEXTAUTH_SECRET!;
  const token = sign(payload, secret, {
    expiresIn: '30d',
  });
  return token;
}
