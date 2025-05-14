const express = require('express')
const app = express()

app.use("/user", [(req, res, next)=> {
    next()
    console.log("v")
    res.send("Route Handler 1")
},
(req, res, next)=> {
    // res.send("Route Handler 2")
    console.log("vvb")
    next()
},
(req, res, next)=> {
    // res.send("Route Handler 3")
    console.log("vvb")
    // next()
}])

app.listen(3000)