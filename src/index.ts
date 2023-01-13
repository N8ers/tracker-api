require("dotenv").config()

import express, { Express, Request, Response, NextFunction } from "express"
import bodyParser from "body-parser"
import pg from "pg"
import jwt from "jsonwebtoken"

const pool = new pg.Pool()
const app: Express = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }))
app.use(bodyParser.text({ type: "text/html" }))

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader?.split(" ")[1]
  if (!token) {
    return res.sendStatus(401)
  }

  try {
    const jwtVerificationResult = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || ""
    )
    req.user = jwtVerificationResult
    next()
  } catch (error) {
    console.log("error ", error)
    return res.sendStatus(403) // need to handle expired token
  }
}

app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query("SELECT * FROM users;")
    res.send(rows)
  } catch (error: any) {
    res.send("ERROR " + error.message)
  }
})

app.post(
  "/auth-token",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    res.send(req.user)
  }
)

app.post("/auth", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT * FROM users
      WHERE username = $1
    `

    const { rows } = await pool.query(query, [req.body.username])

    if (rows[0].password === req.body.password) {
      const user = rows[0]
      delete user.password

      const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET as string
      )
      res.json({ user, accessToken })
    } else {
      res.status(403).send("NOT AUTHED BRO")
    }
  } catch (error: any) {
    res.send("ERROR " + error.message)
  }
})

app.get(
  "/weights",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id
      const query = `
        SELECT * FROM weights
        WHERE user_id = $1
        ORDER BY date DESC
        LIMIT 30
      `
      const { rows } = await pool.query(query, [userId])
      res.send(rows)
    } catch (error: any) {
      res.send("ERROR " + error.message)
    }
  }
)

app.post(
  "/todays-weight",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { weight } = req.body
      const userId = req.user.id
      const date = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
      const insertQuery = `
        INSERT INTO weights (weight, date, user_id)
        VALUES ($1, $2, $3)
      `
      await pool.query(insertQuery, [weight, date, userId])

      const selectQuery = `
        SELECT * FROM weights
        WHERE user_id = $1
        AND
        date = ( SELECT current_date )
      `
      const { rows } = await pool.query(selectQuery, [userId])

      res.send(rows[0])
    } catch (error: any) {
      res.send("ERROR " + error.message)
    }
  }
)

app.get(
  "/todays-weight",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id

    try {
      const query = `
        SELECT * FROM weights
        WHERE user_id = $1
        AND
        date = ( SELECT current_date )
      `
      const { rows } = await pool.query(query, [userId])
      res.send(rows)
    } catch (error: any) {
      res.send("trouble getting todays-weight: " + error.message)
    }
  }
)

app.patch(
  "/todays-weight",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // TODO
  }
)

// app.get(
//   "/weight-seed",
//   authenticateToken,
//   async (req: Request, res: Response): Promise<void> => {
//     const { data } = require("../scripts/result.json")
//     try {
//       const query = `
//     INSERT INTO weights (weight, date, user_id)
//     VALUES ($1, $2, $3)
//     `
//       for (const item of data) {
//         const { weight, date } = item
//         const userId = req.user.id
//         console.log(weight, date, userId)
//         await pool.query(query, [weight, date, userId])
//       }
//       res.send("SUCCESS!")
//     } catch (error: any) {
//       res.send("ERROR " + error.message)
//     }
//   }
// )

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
