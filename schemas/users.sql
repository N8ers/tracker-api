CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  darkmode BOOLEAN DEFAULT false,
  password VARCHAR(50) NOT NULL
);