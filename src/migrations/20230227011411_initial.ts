import { Knex } from 'knex';

export const up = async (knex: Knex) =>
  knex.schema.createTable('tasks', (table) => {
    table.increments('id');
    table
      .timestamp('created_at', { useTz: true })
      .defaultTo(knex.fn.now())
      .notNullable();
    table.text('name').notNullable();
  });

export const down = async (knex: Knex) => knex.schema.dropTable('tasks');
