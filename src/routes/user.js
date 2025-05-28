const express = require('express')
const userRouter = express.Router()

// get all the pending request for the loggedIn user
userRouter.get("/user/")

module.exports = userRouter;