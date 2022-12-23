import express, { Express, Request, Response } from "express"
import bodyParser from "body-parser"
import pg from "pg"

const pool = new pg.Pool()
const app: Express = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }))
app.use(bodyParser.text({ type: "text/html" }))

app.get("/", (req: Request, res: Response): void => {
  res.send("Jello, Tracker!")
})

app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT * FROM users;")
    res.send(rows)
  } catch (error: any) {
    res.send("ERROR " + error.message)
  }
})

app.get("/weights", async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT * FROM weights;")
    res.send(rows)
  } catch (error: any) {
    res.send("ERROR " + error.message)
  }
})

// Eventually we want to extract the userId from a cookie or something
app.get(
  "/weights/:userId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId
      const query = `
      SELECT * FROM weights
      WHERE user_id = $1
    `
      const { rows } = await pool.query(query, [userId])
      res.send(rows)
    } catch (error: any) {
      res.send("ERROR " + error.message)
    }
  }
)

app.get("/ping", async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT NOW();")
    res.send("Pong! DB is connected! " + rows[0].now)
  } catch (error: any) {
    res.send("CATCH " + error.message)
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
