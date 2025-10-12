import express from "express";
import { authToken } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const router = express.Router();
import {
  addUser,
  getUsers,
  loginUser,
  viewUser,
  updateUser,
} from "../controllers/userController.js";
import User from "../models/User.js";
//reading all confidenetials
dotenv.config();
console.log("ENV CHECK:", {
  CLOUD_NAME: process.env.CLOUD_NAME || "MISSING",
  CLOUD_KEY: process.env.CLOUD_KEY || "MISSING",
  CLOUD_SECRET: process.env.CLOUD_SECRET ? "EXISTS" : "MISSING",
});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

router.route("/").get(getUsers);

router
  // /users/create route
  .route("/create")
  .get((req, res) => {
    // res.render("add-user");
    res.render("add-user", { error: null }); // always send error
    // res.send("Here I would show the create user form");
  })
  .post(addUser);

router
  .route("/login")
  .get((req, res) => {
    console.log("here GET");
    res.render("login-user", { error: null });
  })
  .post(loginUser);

//user prfoile
router.route("/profile").get(authToken, viewUser);
router
  .route("/update")
  .get((req, res) => {
    res.render("user-profile");
  })
  .post(authToken, updateUser);

const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/update-photo")
  .post(authToken, upload.single("photo"), async (req, res) => {
    try {
      //multer here will parse the form-data
      //temp store the file
      //make it available as req.file
      if (!req.file) {
        const user = await User.findById(req.user._id);
        return res.render("user-profile", {
          user: user,
          message: "Select an image before uploading",
        });
      }
      //making changes  HERE
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_photos", use_filename: true },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      //we could have used Promise too, but async/await makes the code more readable and presents itself like a sync code block
      await User.findByIdAndUpdate(req.user._id, {
        photo: result.secure_url, // This is the Cloudinary URL
      });
      res.redirect("/users/profile");
    } catch (error) {
      console.log("Error in saving to DB: ", error);
      res.status(500).send("Error uploading photo");
    }
  });
//delete user feature not added yet
export default router;
