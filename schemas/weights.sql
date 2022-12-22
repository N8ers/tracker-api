CREATE TABLE weights(
  weight INT,
  date DATE,
  user_id INT,
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id) 
      REFERENCES users(id)
);