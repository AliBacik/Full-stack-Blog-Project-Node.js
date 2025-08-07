const express = require("express");
const router = express.Router();
const userController= require("../controllers/user-controller");

router.get("/blogs/category/:categoryid", userController.blogs_by_category);

router.get("/blogs/:blogid", userController.blogs_details );

router.get("/", userController.blog_homepage);

router.get("/blogs", userController.blog_details);

module.exports = router;
