const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      // index : true ///  or create index like this
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // automatically creates index when field set to unique : true
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid Password " + value);
        }
      },
    },
    age: {
      type: String,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
      validate(value) {
        if (!["male", "female", "others"].includes[value]) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoURL: {
      type: String,
      default: function () {
        const seed = Math.random().toString(36).substring(2, 15);
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
      },
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Image Address " + value);
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      default: ["Googling"],
    },
  },
  {
    timestamps: true,
  }
);

/// jwt token created here - attached to user schema
UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Admin12!@", {
    expiresIn: "1d",
  });
  return token;
};

/// offloading bcrypt in schema
UserSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", UserSchema);
