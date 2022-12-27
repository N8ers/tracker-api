const fs = require("fs")
const { parse } = require("csv-parse")

const data = []

fs.createReadStream("./data.csv")
  .pipe(parse({ delimiter: ",", from_line: 3 }))
  .on("data", (row) => {
    if (row[1] && row[2]) {
      data.push({ date: row[1] + "/2022", weight: row[2] })
    }
  })
  .on("error", (error) => {
    console.log("error ", error)
  })
  .on("end", () => {
    console.log("all done!")
    console.log(data)
  })
