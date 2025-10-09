import express from "express";
import { authToken } from "../middlewares/authMiddleware.js";
import {
  getArticles,
  viewArticles,
  getArticleById,
  addArticle,
  editArticleGet,
  editArticlePost,
  deleteArticle,
} from "../controllers/articleController.js";
const router = express.Router();

router.route("/all").get(authToken, getArticles);
router.route("/view").get(authToken, viewArticles);
router
  .route("/create")
  .get(authToken, (req, res) => {
    res.render("add-article", {
      userHandle: req.user.userHandle,
      error: null,
    });
  })
  .post(authToken, addArticle);

router
  .route("/:id/edit")
  .get(authToken, editArticleGet)
  .post(authToken, editArticlePost);

router.route("/:id/delete").post(authToken, deleteArticle);

router.route("/:id").get(getArticleById);

export default router;
