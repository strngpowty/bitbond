const express = require('express')
const requestRouter  = express.Router()
const {userAuth} = require("../middlewares/auth")

// send connection request
requestRouter.post("/sendConnectionRequest",userAuth, async ( req, res) => {
  try{
    res.send(req.user.firstName + " sent the connection request")
  } catch (err) {

  }
})

module.exports = requestRouter