const { model, Schema } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
    validate(value) {
      if (value.includes("password")) {
        throw new Error("The password can't contain the word 'password'");
      }
    }
  },
  age: Number,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    }
  }
});

const User = model("User", userSchema);

module.exports = User;
