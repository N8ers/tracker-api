import express, { Express, Request, Response } from "express"

import { client } from "./db"

const PORT = 5000

const app: Express = express()

app.get("/", (req: Request, res: Response): void => {
  res.send("Jello, Tracker!")
})

app.get("/ping", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await client.query("SELECT NOW();")
    res.send("RESULT! " + result)
  } catch (error: any) {
    res.send("CATCH " + error.message)
  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
