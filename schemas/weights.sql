CREATE TABLE weights(
  id SERIAL PRIMARY KEY,
  weight NUMERIC (4, 1),
  date DATE,
  user_id INT,
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id) 
      REFERENCES users(id)
);