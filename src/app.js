const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cors());
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

// get all users from db
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
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
