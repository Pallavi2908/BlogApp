import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const createToken = (user) => {
  return jwt.sign(
    { userHandle: user.userHandle, _id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
//keep this only to create and sign token, and return it.
//cookie can't be created since res object isn't here
