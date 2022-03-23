import express from "express"

const PORT = process.env.PORT || 5002
const app = express()

app.get("/", (req, res) => {
  res.send("HI")
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
