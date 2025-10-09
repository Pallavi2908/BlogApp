import bcrypt from "bcrypt";
import User from "../models/User.js";
import Article from "../models/Article.js";
import { createToken } from "../../utils/tokenUtils.js";
// import { encryptedPass } from "../../utils/pass.js";
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.render("users", { users });
};

export const addUser = async (req, res) => {
  const saltRounds = 10;
  try {
    const { name, password, userHandle, emailId, birthday } = req.body;
    const securedPass = await bcrypt.hash(password, saltRounds);
    console.log("securedPass:", securedPass);

    const user = new User({
      name,
      password: securedPass,
      userHandle,
      emailId,
      birthday,
    });

    console.log("Stored the password in a secure way:", user);
    await user.save(); // save returns { success, message }
    //set them token
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    res.redirect("/users/profile");
  } catch (error) {
    if (error.code === 11000) {
      //grab keys of an obj -> Object.keys(obj)
      const duplicateField = Object.keys(error.keyPattern)[0];
      let message = "Duplicate value";
      if (duplicateField === "emailId") {
        message = "This email is already registered";
      } else if (duplicateField === "userHandle") {
        message = "This username is already taken";
      }

      return res.render("add-user", { error: message });
    }
    console.log(error);
    res.render("add-user", { error: error });
  }
};

export const loginUser = async (req, res) => {
  console.log("Entered loginUser");
  try {
    const { userHandle, password } = req.body;

    const user = await User.findOne({ userHandle });

    // console.log(user);
    if (user) {
      //if found now check if password matches
      //password is hashed and stored
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log("Error in comparison:", err);
        }
        if (result) {
          console.log(result);
          const token = createToken(user);
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
          });
          res.redirect("/users/profile");
        } else {
          return res.render("login-user", { error: "Incorrect password!" });
        }
      });
    } else {
      console.log("User doesn't exitst");
      return res.render("login-user", { error: "Invalid, no user found" });
    }
  } catch (error) {
    console.log(error.body);
  }
};
export const viewUser = async (req, res) => {
  const userId = req.user._id; // ObjectId of logged in user
  const user = await User.findById(userId);
  res.render("user-profile", { user });
};

export const updateUser = async (req, res) => {
  const userId = req.user._id; // ObjectId of logged in user

  try {
    // const { emailId, birthday } = req.body;
    const { name, password, userHandle, emailId, birthday } = req.body;
    const updates = {};
    for (let key of ["name", "password", "userHandle", "emailId", "birthday"]) {
      if (req.body[key]) {
        updates[key] = req.body[key];
      }
    }
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }
    const oldUser = await User.findById(userId);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (updates.userHandle && updates.userHandle !== oldUser.userHandle) {
      await Article.updateMany(
        { authorHandle: oldUser.userHandle },
        { $set: { authorHandle: updates.userHandle } },
        { new: true }
      );
    }
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    console.log(user.userHandle, "is currently here");

    res.render("user-profile", {
      user,
      message: "Changes made successfully!",
    });
  } catch (error) {
    console.log("error in updating,", error);
    if (error.code === 11000) {
      //grab keys of an obj -> Object.keys(obj)
      const duplicateField = Object.keys(error.keyPattern)[0];
      let message = "Duplicate value";
      if (duplicateField === "emailId") {
        message = "This email is already registered";
      } else if (duplicateField === "userHandle") {
        message = "This username is already taken";
      }
      const user = await User.findById(userId);
      return res.render("user-profile", { user, message });
    }
    const user = await User.findById(userId);
    return res.render("user-profile", {
      user,
      message: "Something went wrong. Please try again.",
    });
  }
};
