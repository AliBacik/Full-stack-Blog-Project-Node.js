const express = require("express");
const router = express.Router();
const imageUpload = require("../helpers/image-upload");
const adminController=require("../controllers/admin-controller");
const isAuth = require("../middlewares/auth");

//BLOGS

router.get("/blog/create",isAuth,adminController.get_blog_create);

router.post("/blog/create",isAuth,imageUpload.upload.single("image"), adminController.post_blog_create);

router.get("/blogs/delete/:blogid",isAuth, adminController.get_blog_delete);

router.delete("/blogs/delete/:blogid",isAuth,adminController.post_blog_delete);

router.get("/blogs/:blogid",isAuth, adminController.get_blog_byid);

router.put("/blogs/:blogid",isAuth,imageUpload.upload.single("image"), adminController.put_by_blogid);

router.get("/blogs",isAuth, adminController.get_blogs);



//CATEGORIES

router.get("/categories/create",isAuth, adminController.get_category_create);

router.post("/categories/create",isAuth, adminController.post_category_create);

router.delete("/categories/delete/:categoryid",isAuth, adminController.delete_category);

router.get("/categories/:categoryid",isAuth, adminController.get_categories_byid);

router.put("/categories/:categoryid",isAuth, adminController.update_category_byid);

router.get("/categories",isAuth, adminController.get_all_categories);

// ROLES

router.get("/roles", isAuth , adminController.get_roles);

router.get("/roles/:roleid", isAuth , adminController.get_role_edit);

router.post("/roles/remove", isAuth , adminController.roles_remove);

router.put("/roles/:roleid", isAuth , adminController.put_role_edit);


// USERS

router.get("/users", isAuth , adminController.get_users);

router.get("/users/:userid", isAuth , adminController.get_user_byid);

router.post("/users/:userid", isAuth , adminController.edit_user_byid);


module.exports = router;
