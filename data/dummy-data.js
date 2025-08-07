const Category = require("../models/category");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Role = require("../models/role");

async function populate() {
  // await Category.sync({ alter: true });
  // await Blog.sync({ alter: true });
  const count = await Category.count();

  if (count == 0) {

    const users=await User.bulkCreate([
      {fullname:"ali bacik" , email:"ali@proje.com", password: await bcrypt.hash("ali123",10)},
      {fullname:"ali bacik" , email:"alimoderator@proje.com", password: await bcrypt.hash("ali123",10)},
      {fullname:"ali bacik" , email:"aliguest@proje.com", password: await bcrypt.hash("ali123",10)}
    ]);

    const roles = await Role.bulkCreate([
      {rolename:"admin"},
      {rolename:"moderator"},
      {rolename:"guest"},
    ])

    await users[0].addRole(roles[0]); // admin => first user
    await users[1].addRole(roles[1]); // moderator => 2nd user
    await users[2].addRole(roles[2]); // guest => 3rd user

    const categories = await Category.bulkCreate([
      { name: "Web Development" },
      { name: "Mobile Development" },
      { name: "Programming" }
    ]);

    

    const blogs = await Blog.bulkCreate([
      {
        title: "Web programming Full course with project",
        alttitle: "",
        description: "HTML CSS JS SASS ANGULAR",
        image: "1.jpeg",
        homepage: true,
        approval: true
      },
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      },
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      },
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
      ,
      {
        title: "Python programming Full course with project",
        alttitle: "",
        description: "Python , Django",
        image: "2.jpeg",
        homepage: true,
        approval: true
      }
    ]);

    await categories[0].addBlog(blogs[0]);
    await categories[0].addBlog(blogs[1]);

    await categories[1].addBlog(blogs[2]);
    await categories[1].addBlog(blogs[3]);

    await categories[2].addBlog(blogs[2]);
    await categories[2].addBlog(blogs[3]);

    await blogs[0].addCategory(categories[1]);

    await categories[0].createBlog({
      title: "New blog",
      alttitle: "",
      description: "Python , Django",
      image: "2.jpeg",
      homepage: true,
      approval: true
    });
  }
}

module.exports = populate;
