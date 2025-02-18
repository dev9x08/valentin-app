CREATE TABLE graphs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  title TEXT,
  nodes JSONB,
  edges JSONB
);