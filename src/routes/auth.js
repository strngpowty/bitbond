const express = require('express')
const authRouter  = express.Router()
const User = require("../models/user");
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt")

authRouter.post("/signup", async (req, res) => {
  try {
    // validating the user data
    validateSignUpData(req.body);
    const {firstName, lastName, emailId, password} = req.body
    // encrypt user password
    const passwordHash = await bcrypt.hash(password, 10);
    // creating a new instance of the user model
    const userObj = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHash
    });
    await userObj.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Adding User Failed" + err);
  }
});

authRouter.post("/login", async(req, res) => {
    try {
        const {emailId, password} = req.body
        const user = await User.findOne({emailId : emailId})
        if(!user) {
          throw new Error("Invalid Email Address")
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
          // token received from schema
          const token = await user.getJWT();        
          res.cookie("token", token, {expires : new Date(Date.now() + 8 * 3600000)})
          res.send(user)
        } else {
          throw new Error("Invalid Password")
        }
        
    } catch (err) {
      res.status(400).send("Error : "+ err.message);
    }
})

authRouter.post("/logout", async(req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  })
  res.send("Logged Out Successfully")
})

module.exports = authRouter