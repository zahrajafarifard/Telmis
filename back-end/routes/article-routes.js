const express = require("express");
const router = express.Router();

const articleControllers = require("../controllers/article-controllers");
const checkAuth = require("../shared/checkAuth");
const upload = require("../shared/file-upload-article");

router.post(
  "/articlesWithoutConditions",
  articleControllers.articlesWithoutConditions
);

router.get("/", articleControllers.getLatestArticles);
// router.post("/", articleControllers.getArticles); //change to get for site
router.post("/", articleControllers.getArticles);
router.get("/articles", articleControllers.getAllArticles);

router.post("/sameTypeArticles", articleControllers.sameTypeArticles);

router.post("/search-article", articleControllers.searchArticle);
router.get("/articleTypes", articleControllers.getArticleTypes);
router.get("/mostVisited", articleControllers.getMostVisitedArticles);

//admin
router.delete("/delete-article", checkAuth, articleControllers.deleteArticle);
router.get("/article/:articleId", checkAuth, articleControllers.getArticle); //new admin

router.post(
  "/add-article",
  checkAuth,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "sectionTwoImage", maxCount: 1 },
  ]),
  articleControllers.addArticle
);

router.patch(
  "/edit-article",
  checkAuth,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "sectionTwoImage", maxCount: 1 },
  ]),
  articleControllers.editArticle
);

//////////
//////////
//////////
router.get("/:id", articleControllers.getArticleSite);

module.exports = router;
