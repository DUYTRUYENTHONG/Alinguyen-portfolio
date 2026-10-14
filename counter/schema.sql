CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  country TEXT,
  ordinal INTEGER NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS visitors_role_idx ON visitors(role);
CREATE INDEX IF NOT EXISTS visitors_country_idx ON visitors(country);
