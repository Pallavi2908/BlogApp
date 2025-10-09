import express from "express";
import { authToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
const router = express.Router();
import {
  addUser,
  getUsers,
  loginUser,
  viewUser,
  updateUser,
} from "../controllers/userController.js";
import User from "../models/User.js";
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

router
  .route("/update-photo")
  .post(authToken, upload.single("photo"), async (req, res) => {
    try {
      // console.log("req.file: ", req.file, "req.body:", req.body);
      if (!req.file) {
        const user = await User.findById(req.user._id);
        return res.render("user-profile", {
          user: user,
          message: "Select an image before uploading",
        });
      }
      const fileName = req.file.filename;

      await User.findByIdAndUpdate(req.user._id, { photo: fileName });
      res.redirect("/users/profile");
    } catch (error) {
      console.log("Error in saving to DB: ", error);
      res.status(500).send("Error uploading photo");
    }
  });
//delete user feature not added yet
export default router;
