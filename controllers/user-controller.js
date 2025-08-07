const Blog = require("../models/blog");
const Category = require("../models/category");
const { Op } = require("sequelize");

exports.blogs_by_category = async function (req, res) {
  const id = req.params.categoryid;

  try {
    const blogs = await Blog.findAll(
      { where: 
        { 
          // categoryId: id, 
          approval:true
        },
        include:
        {
          model:Category,
          where:{id:id}
        }
      });

    const categories = await Category.findAll();

    res.json({
      title: "All Courses",
      blogs: blogs,
      categories: categories,
      selectedCategory: id,
    });
  } catch (err) {
    console.log(err);
  }
}

exports.blogs_details = async function (req, res) {
  const id = req.params.blogid;

  try {
    const blog = await Blog.findByPk(id);

    if (blog) {
      return res.json({
        title: blog.title,
        blog: blog,
      });
    } else {
      return res.status(404).json({ message: "No blog found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

exports.blog_homepage = async function (req, res) {

  const size=5;

  try 
  {
    const blogs = await Blog.findAll({
      where: {
        [Op.and]: [{ homepage: true }, { approval: true }]
      },
      limit:size
    });

    const categories = await Category.findAll();

    res.json({
      title: "All Courses",
      blogs: blogs,
      categories: categories,
      isAuth:req.session.isAuth
    });
  } catch (err) {
    console.log(err);
  }
}

exports.blog_details = async function (req, res) {

  const size=5;
  const page = parseInt(req.query.page) || 0;

  try {

    const totalBlogs = await Blog.count({
      where: { approval: true }
    });

    const blogs = await Blog.findAll({ 
      where: 
      { 
        approval:true 
      }, 
      limit:size,
      offset:page*size // 0*5 => 0 first 5
    });

    const categories = await Category.findAll();

    res.json({
      title: "All Courses",
      blogs: blogs,
      categories: categories,
      totalBlogs: totalBlogs
    });
  } catch (err) {
    console.log(err);
  }
}