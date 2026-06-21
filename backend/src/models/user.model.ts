import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import { IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (str: string) => validator.isEmail(str),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving. only when the field has been modified or is new
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare a plaintext password against the stored hash
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
