import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
//encodeURI() will convert unfriendly char into URL safe format
const url = `mongodb+srv://${process.env.MONGO_USER}:${encodedPassword}@${process.env.MONGO_CLUSTER}.slfucon.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP}`;
export const connDB = async () => {
  try {
    mongoose
      .connect(url)
      .then(() => console.log("success"))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
