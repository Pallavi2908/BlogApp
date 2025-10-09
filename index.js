// const express = require("express");
import express from "express";
import bodyParser from "body-parser";
import { connDB } from "./utils/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import articleRoutes from "./src/routes/articleRoutes.js";
import errorRoutes from "./src/routes/404.js";
import { logger } from "./src/middlewares/logger.js";
import cookieParser from "cookie-parser";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connDB();
app.set("view engine", "ejs");
app.set("views", "./src/views"); // folder where your .ejs files live

app.use(logger);
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);
app.get("/home", (req, res) => {
  res.send("At home page");
});
app.use(errorRoutes);
app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
