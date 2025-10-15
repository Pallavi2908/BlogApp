import Article from "../models/Article.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
});

await client.connect();
console.log("✅ Connected to Redis Cloud!");

export const getArticles = async (req, res) => {
  try {
    const cacheKey = "articlesList";
    const user = req.user;
    const cached = await client.get(cacheKey);
    if (cached) {
      console.log("Cache hit🟢");
      const articles = JSON.parse(cached);

      return res.render("articles", { articles, user });
    }

    const articles = await Article.find().sort({ createdAt: -1 });

    const articleswithAuthors = await Promise.all(
      articles.map(async (article) => {
        const author = await User.findOne({ userHandle: article.authorHandle });
        return {
          ...article.toObject(),
          authorPhoto: author?.photo,
        };
      })
    );
    console.log("Cache miss🟡");
    await client.setEx(cacheKey, 300, JSON.stringify(articleswithAuthors));
    res.render("articles", { articles: articleswithAuthors, user });
  } catch (error) {
    console.error(error);
    res.render("articles", { articles: [], user: req.user });
  }
};
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send("Not found");
    const author = await User.findOne({ userHandle: article.authorHandle });
    res.render("article", { article, authorPhoto: author?.photo });
  } catch (err) {
    res.status(500).send("Error fetching article");
  }
};
export const viewArticles = async (req, res) => {
  try {
    const userHandle = req.user.userHandle;

    const userArticles = await Article.find({ authorHandle: userHandle }).sort({
      createdAt: -1,
    });
    //no reading JSON files, we are able to save memory!
    res.render("user-articles", {
      articles: userArticles,
      userHandle,
    });
  } catch (error) {}
};

// const addArticle
export const addArticle = async (req, res) => {
  const { title, body } = req.body;
  const authorHandle = req.user.userHandle;
  try {
    const article = new Article({ title, body, authorHandle });
    //Mongoose models are different — the constructor only accepts one object argument
    await article.save();
    res.redirect("/articles/all");
  } catch (error) {
    // console.error(error);
    res.status(500).send("Error adding article");
  }
};
// const updateArticle
export const editArticleGet = async (req, res) => {
  const articleId = req.params.id;
  const userHandle = req.user.userHandle;

  try {
    const article = await Article.findById(articleId);
    if (article.authorHandle != userHandle) {
      return res.render("articles", {
        articles,
        message: "You can't edit other people's posts!",
      });
    }
    res.render("edit-article", { article });
  } catch (error) {
    res.send("Error in deleting", error);
  }
};
export const editArticlePost = async (req, res) => {
  // res.send("PUT article/:id/edit  updating article");
  const articleId = req.params.id;

  const { title, body } = req.body;
  try {
    const article = await Article.findById(articleId);
    article.title = title.trim();
    article.body = body.trim();
    article.updatedAt = new Date();

    await article.save();
    res.redirect("/articles/all");
  } catch (error) {
    // console.log("error in updates", error);
  }
};
// const deleteArticle
export const deleteArticle = async (req, res) => {
  const articleId = req.params.id;
  const userHandle = req.user.userHandle;
  try {
    const article = await Article.findById(articleId);

    if (!article) return res.status(404).send("Article not found");

    if (article.authorHandle !== userHandle) {
      return res.status(403).send("You are not the author");
    }

    await Article.deleteOne({ _id: articleId });
    res.redirect("/articles/all");
  } catch (error) {
    console.log("error incurred", error);
  }
};
