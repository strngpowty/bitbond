const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const { token } = req.cookies;
    if(!token) {
      return res.status(401).send("User Not Logged In")
    }
    const decodedObj = await jwt.verify(token, "Admin12!@")
    const { _id } = decodedObj;
    // validate the token // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    } else {
        req.user = user
      next();
    }
  } catch (err) {
    res.status(404).send("Bad Request " + err)
  }
};

module.exports = {
  userAuth,
};
