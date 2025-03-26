import dotenv from 'dotenv';

dotenv.config();

export const PORT = 5050;
export const CLIENT_URL ='http://localhost:4200';
export const DATABASE_URL = 'mongodb://127.0.0.1:27017/ecommerce';
export const JWT_SECRET =  'supersecretjwt';
export const STRIPE_SECRET =  'sk_test_123456';
export const STRIPE_WEBHOOK_SECRET =  'whsec_123456';