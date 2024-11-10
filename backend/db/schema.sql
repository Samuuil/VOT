CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  description TEXT
);
