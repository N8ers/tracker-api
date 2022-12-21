import { Client } from "pg"

export const client = new Client({
  user: "docker",
  host: "db",
  password: "1234",
  port: 5432,
})

client.connect((error) => {
  if (error) {
    console.log("DB connection error: ", error)
  } else {
    console.log("DB connected")
  }
})
