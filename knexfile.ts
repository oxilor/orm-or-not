import dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertToCamelCase = (row: any) => {
  // eslint-disable-next-line no-underscore-dangle
  if (!row || row._types) return row;

  return Object.entries(row).reduce((acc, [key, value]) => {
    const camelCaseKey = key.replace(/(_[a-zA-Z])/g, (c) =>
      c.slice(1).toUpperCase()
    );
    acc[camelCaseKey] = value;
    return acc;
  }, {});
};

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  migrations: {
    directory: 'src/migrations',
    extension: 'ts',
  },
  postProcessResponse: (result) => {
    if (Array.isArray(result)) {
      return result.map((row) => convertToCamelCase(row));
    }
    return convertToCamelCase(result);
  },
};

export default knexConfig;
