const express = require('express')
const app = express()

app.get("/user", (req, res) => {
    res.send({"firstName":"djc"})
})

app.post("/user", (req, res) => {
    res.send("added to db")
})

app.listen(3000)