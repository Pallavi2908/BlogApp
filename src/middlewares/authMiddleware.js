import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authToken = (req, res, next) => {
  // const authheader = req.headers["authorization"];
  // const token = authheader && authheader.split(" ")[1]; //Beaer <token>
  const token = req.cookies.token;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};
