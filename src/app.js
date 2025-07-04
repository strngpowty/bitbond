const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cors({
  //  whitelisting my domain
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter =  require("./routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, "0.0.0.0", () => {
      console.log("running at 3000");
    });
  })
  .catch((err) => {
    console.log("database connection failed" + err);
  });
