const express = require('express')
const profileRouter  = express.Router()
const {userAuth} = require("../middlewares/auth")
const {validateEditProfileData} = require("../utils/validation")
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", userAuth, async(req, res) => {
  res.send(req.user)
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try {
    if(!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request")
    }
    const loggedInUser = req.user
    for (const field of Object.keys(req.body)) {
      if (field === "password") {
        // Hash the new password before saving
        const hashed = await bcrypt.hash(req.body.password, 10);
        loggedInUser.password = hashed;
      } else {
        loggedInUser[field] = req.body[field];
      }
    }
    await loggedInUser.save()
    res.send(`${loggedInUser.firstName} your profile was updated successfully`)
  } catch(err) {
    res.status(400).send("Error : "+ err.message);
  }
})

module.exports = profileRouter