const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth")

app.use(express.json());
app.use(cors());
app.use(cookieParser())

// signup api
app.post("/signup", async (req, res) => {
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

// login api
app.post("/login", async(req, res) => {
    try {
        const {emailId, password} = req.body
        const user = await User.findOne({emailId : emailId})
        if(!user) {
          throw new Error("Invalid Email Address")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid) {
          // create a jwt token
          const token = await jwt.sign({_id : user._id}, "Admin12!@")
          // add the token to the cookie and send the response 
          res.cookie("token", token)

          res.send("Login Successfull")
        } else {
          throw new Error("Invalid Password")
        }
        
    } catch (err) {
      res.status(400).send("Error : "+ err.message);
    }
})

// profile api
app.get("/profile", userAuth, async(req, res) => {
  console.log(req.user)
  res.send("reading cookie")
})

// send connection request
app.post("/sendConnectionRequest",userAuth, async ( req, res) => {
  try{
    res.send(req.user.firstName + " sent the connection request")
  } catch (err) {

  }
})

// get single user -> by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(400).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// get all users from db
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete a user from db
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update a user in db
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("user updted successfully");
  } catch (err) {
    res.status(400).send("Update Failed" + err);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("running at 3000");
    });
  })
  .catch((err) => {
    console.log("database connection failed");
  });
