import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 10,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      min: 3,
      max: 10,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateHashedPassword = async function () {
  //generateHashedPassword
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

const user = mongoose.model("User", UserSchema);
export default user;
