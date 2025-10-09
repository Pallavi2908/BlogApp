import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  userHandle: { type: String, required: true, unique: true },
  emailId: { type: String, required: true, unique: true },
  birthday: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  photo: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);
//registers a model called "User" , mongoDB automatically maps this to collection "users"
export default User;
