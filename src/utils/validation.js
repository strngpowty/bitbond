const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstname",
    "lastName",
    "photoURL",
    "gender",
    "age",
    "about",
    "password",
    "skills",
  ];
  const isAllowedEditFields = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isAllowedEditFields;
};


module.exports = { validateSignUpData, validateEditProfileData};
