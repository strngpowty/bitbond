const express = require('express')
const app = express()

app.use("/ds", (req, res) => {
    res.send("heldfsdlo")
})
app.use("/", (req, res) => {
    res.send("hello")
})
app.listen(3000)