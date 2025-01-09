import { Client } from 'pg';

function getNewClient(): Client {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PASSWORD),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  return client;
}

export const database = {
  getNewClient,
};
