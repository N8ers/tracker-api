import express, { Express, Request, Response } from "express"

const PORT = 8000

const app: Express = express()

app.get("/", (req: Request, res: Response) => {
  res.send("Jello, Tracker!")
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
