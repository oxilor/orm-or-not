import { sql } from 'slonik';
import createPool from '../utils/createPool';
import { exec } from 'child_process'

const setup = async () => {
  // Open the connection
  const pool = await createPool({ databaseName: 'postgres' });

  if (!process.env.POSTGRES_DATABASE) {
    throw new Error('POSTGRES_DATABASE is required')
  }

  // Recreate the database
  await pool.query(sql.unsafe`DROP DATABASE IF EXISTS ${sql.identifier([process.env.POSTGRES_DATABASE])}`);
  await pool.query(sql.unsafe`CREATE DATABASE ${sql.identifier([process.env.POSTGRES_DATABASE])}`);

  // Close the connection
  await pool.end();

  // Sync the schema
  await new Promise<void>((resolve, reject) => {
    exec('yarn sync:test', (err) => err ? reject() : resolve())
  })
};

export default setup;
