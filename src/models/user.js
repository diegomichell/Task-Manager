import { model, Schema } from "mongoose";
import { isEmail } from "validator";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../utils";
import Task from "./task";

const userSchema = new Schema(
  {
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
      unique: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Invalid email address");
        }
      }
    },
    tokens: [
      {
        token: {
          type: "string",
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const token = sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: "1 year"
  });

  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Hashes the plain text password before saving
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function(next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

const User = model("User", userSchema);

export default User;
