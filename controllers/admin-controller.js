const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const { Op } = require("sequelize");
const fs = require("fs");
const sequelize = require("../data/db");
const User = require("../models/user");

exports.get_blog_delete = async function (req, res) {
  const blogid = req.params.blogid;

  try {
    const blog = await Blog.findByPk(blogid);

    if (blog) {
      res.json({
        blog: blog,
        csrfToken: req.csrfToken(),
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.post_blog_delete = async function (req, res) {
  const blogid = req.params.blogid;

  try {
    const blog = await Blog.findByPk(blogid);

    if (blog) {
      await blog.destroy();
      return res.status(200).json({ message: "Blog deleted successfully." });
    }
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.get_blog_create = async function (req, res) {
  try {
    const categories = await Category.findAll();

    console.log(categories);

    res.json({
      title: "Add Blog",
      categories: categories,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.post_blog_create = async function (req, res) {
  
  const title = req.body.title;
  const description = req.body.description;
  // const image = req.file.filename;
  const homepage = req.body.isHome ? 1 : 0;
  const approval = req.body.isApproved ? 1 : 0;
  const category = req.body.categoryid;
  let image = "";

  try {

    if(title==""){
      throw new Error("Title cant be null!");
    }

    if(req.file){
      image = req.file.filename;
      fs.unlink("../public/images/"+req.body.image,err=>{
        console.log(err);
      })
    }

    const blog = await Blog.create({
      title: title,
      alttitle: "",
      description: description,
      image: image,
      homepage: homepage,
      approval: approval,
    });

    await blog.setCategories(category);

    res.status(201).json({ message: "Blog created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.get_blog_byid = async function (req, res) {
  const id = req.params.blogid;

  try {
    const blog = await Blog.findByPk(id, {
      include: {
        model: Category,
      },
    });

    const categories = await Category.findAll();

    if (blog) {
      return res.json({
        blog: blog,
        categories: categories,
        csrfToken: req.csrfToken(),
      });
    } else {
      return res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.get_blogs = async function (req, res) {
  try {
    const blogs = await Blog.findAll({ attributes: ["id", "title", "image"] });
    res.json({
      title: "blog list",
      blogs: blogs,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.put_by_blogid = async (req, res) => {
  const blogid = req.params.blogid;
  const title = req.body.title;
  const description = req.body.description;
  const homepage = req.body.isHome;
  const approval = req.body.isApproved;
  const category = req.body.categoryid;
  const existingImage = req.body.existingImage;
  const finalImageName = req.file ? req.file.filename : existingImage;

  if (req.file && existingImage && existingImage !== req.file.filename) {
    fs.unlink(`./client/src/assets/images/${existingImage}`, (err) => {
      if (err) console.error("Eski dosya silinemedi:", err);
      else console.log("Eski dosya silindi:", existingImage);
    });
  }

  try {
    const blog = await Blog.findByPk(blogid);
    if (blog) {
      blog.title = title;
      (blog.description = description),
        (blog.image = finalImageName),
        (blog.homepage = homepage),
        (blog.approval = approval),
        //blog.categoryId = category

        await blog.save();

      await blog.setCategories(category);
    }

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.get_all_categories = async function (req, res) {
  try {
    const categories = await Category.findAll();

    res.json({
      title: "blog list",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.get_categories_byid = async function (req, res) {
  const id = req.params.categoryid;
  try {
    const category = await Category.findByPk(id);
    console.log("KATEGORİ"+category);
    const blogs = await category.getBlogs();

    res.json({
      categories: category,
      action: req.query.action,
      categoryid: req.query.categoryid,
      blogs: blogs,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.log(err);
  }
};

exports.update_category_byid = async function (req, res) {
  const id = req.params.categoryid;
  const name = req.body.name;

  try {
    const category = await Category.findByPk(id);

    if (category) {
      category.name = name;
      await category.save();
    }
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.get_category_create = async function (req, res) {
  try 
  {
    res.json({
      title: "Add Category",
      csrfToken: req.csrfToken()
    });
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.post_category_create = async function (req, res) {
  const name = req.body.name;

  try {
    await Category.create({ name: name });

    res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.delete_category = async function (req, res) {
  const id = req.params.categoryid;
  try {
    const category = await Category.findByPk(id);

    if (category) {
      await category.destroy();

      return res
        .status(200)
        .json({ message: "Category deleted successfully." });
    }
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.get_roles = async function (req , res) {
  try {
    const roles = await Role.findAll({
      attributes:{
        include:['role.id','role.rolename',[sequelize.fn('COUNT', sequelize.col('users.id')),'user_count']]
      },
      include:[
        {model:User,attributes:['id']}
      ],
      group:['role.id'],
      raw:true,
      includeIgnoreAttributes:false
    });

    res.json({
      title: "role list",
      roles:roles,
      csrfToken: req.csrfToken()
    });

  } 
  catch (err) 
  {
    console.log(err);
  }
}

exports.get_role_edit = async function (req , res) {

  const roleid = req.params.roleid;
  try {
    const role = await Role.findByPk(roleid);
    const users = await role.getUsers();

    if(role){
      return res.json({
      title: role.rolename,
      roles:role,
      users:users,
      csrfToken: req.csrfToken()
    });
    }
    else{
      return res.status(404).json({ message: "Role not found" });
    }

  } 
  catch (err) 
  {
    console.log(err);
  }
  
}

exports.put_role_edit = async function (req , res) {

  const roleid = req.body.roleid;
  const rolename = req.body.rolename;

  try {
    await Role.update({rolename:rolename},
      {
        where:{
          id:roleid
        }
      });
      res.status(200).json({ message: "Category updated successfully" });

  } 
  catch (err) 
  {
    console.log(err);
  }
  
}

exports.roles_remove = async function (req , res) {
  const roleid = req.body.roleid;
  const userid = req.body.userid;

  console.log("ROLE ID : " + roleid)
  console.log("ROLE ID : " + userid)

  try {
    await sequelize.query(`delete from userRoles where userId=${userid} and roleId=${roleid}`);
      res.status(200).json({ message: "role deleted successfully" });
  } 
  catch (err) 
  {
    console.log(err);
  }
}

//USERS

exports.get_users = async function (req , res) {
  try {
    
    const users = await User.findAll({
      attributes: ["id","fullname","email"],
      include:{
        model:Role,
        attributes:["rolename"]
      }
    });

    res.json({
      title: "user list",
      users:users,
      csrfToken: req.csrfToken()
    });

  } 
  catch (err) 
  {
    console.log(err);
  }
}

exports.get_user_byid = async function (req , res) {
  
  const userid=req.params.userid;

  try {
    
    const user = await User.findOne({
      where:{id:userid},
      include:{model:Role,attributes:["id"]}
    });

    const roles= await Role.findAll();

    console.log("USERSSS" + user);

    res.json({
      title: "user edit",
      user:user,
      roles:roles,
      csrfToken: req.csrfToken()
    });

  } 
  catch (err) 
  {
    console.log(err);
  }
}

exports.edit_user_byid = async function (req , res) {

  const userid=req.body.userid;
  const fullname = req.body.fullname;
  const roleIds = req.body.roles;

   console.log("BODY"+req.body);
   console.log("BODY"+roleIds);
   console.log("BODY"+userid);
   console.log("BODY"+fullname);

  try {
    const user = await User.findOne({
      where:{id:userid},
      include:{model:Role,attributes:["id"]}
    });
    
    if(user){
      user.fullname=fullname;
      
      if(roleIds==undefined){
        await user.removeRoles(user.roles);
      }else{
        await user.removeRoles(user.roles);
        const selectedRoles = await Role.findAll({
          where:{
            id:{
              [Op.in]:roleIds
            }
          }
        });
        await user.addRoles(selectedRoles);
      }

      await user.save();
      res.status(200).json({ message: "" });
    }

  } 
  catch (err) 
  {
    console.log(err);
  }
}