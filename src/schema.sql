CREATE OR REPLACE FUNCTION truncate_tables() RETURNS void AS $$
  DECLARE
    tables CURSOR FOR
      SELECT schemaname, tablename FROM pg_tables
      WHERE NOT schemaname = ANY(ARRAY['pg_catalog', 'information_schema']);
  BEGIN
    FOR tbl IN tables LOOP
      EXECUTE 'TRUNCATE TABLE ' || quote_ident(tbl.schemaname) || '.' || quote_ident(tbl.tablename) || ' RESTART IDENTITY CASCADE';
    END LOOP;
  END;
$$ LANGUAGE plpgsql;

CREATE TABLE tasks (
  id serial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  name text NOT NULL
)
