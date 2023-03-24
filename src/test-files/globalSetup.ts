import { sql } from 'slonik';
import createPool from '../utils/createPool';
import { exec } from 'child_process'

const setup = async () => {
  if (!process.env.POSTGRES_DATABASE) {
    throw new Error('POSTGRES_DATABASE is required')
  }

  const db = sql.identifier([process.env.POSTGRES_DATABASE]);
  const pool = await createPool({ databaseName: 'postgres' });

  // Recreate the database
  try {
    await pool.query(sql.unsafe`DROP DATABASE IF EXISTS ${db}`);
    await pool.query(sql.unsafe`CREATE DATABASE ${db}`);
    await pool.end();
  } catch (e) {
    await pool.end();
    throw e;
  }

  // Sync the schema
  await new Promise<void>((resolve, reject) => {
    exec('yarn sync:test', (err) => err ? reject() : resolve())
  })
};

export default setup;
