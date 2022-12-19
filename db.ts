import { Pool } from "pg"

export default new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  user: "docker",
  host: "db",
  password: "1234",
  port: 5432,
})
