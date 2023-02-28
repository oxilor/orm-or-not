import dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';
import Postgrator from 'postgrator';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const migrate = async () => {
  const client = new pg.Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  });

  await client.connect();

  const postgrator = new Postgrator({
    driver: 'pg',
    database: process.env.POSTGRES_DATABASE,
    schemaTable: 'schema_version',
    migrationPattern: path.join(__dirname, '../migrations/*'),
    execQuery: (query) => client.query(query),
  });

  try {
    await postgrator.migrate();
  } finally {
    await client.end();
  }
};

export default migrate;
