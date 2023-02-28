CREATE TABLE tasks (
  id serial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  name text NOT NULL
)
