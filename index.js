// express
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");


// routes
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const cors = require("cors");


// Db
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");

// Parsing from angular
app.use(cors({origin: 'http://localhost:4200', credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:"e7d5dd65-314a-4a0e-8b03-e8ca15d444af",
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge:1000*60*60 // 1 saat
  },
  store: new SequelizeStore({
    db:sequelize
  })
}));

// MW

app.use(csurf());
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/api", userRoutes);
app.use("/api/account", authRoutes);
app.use("/api/admin", adminRoutes);


// Models
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
const Role = require("./models/role");

Blog.belongsTo(User,{
  foreignKey:{
    allowNull:true
  }
});
User.hasMany(Blog);

Blog.belongsToMany(Category, {through: "blogCategories"});
Category.belongsToMany(Blog, {through: "blogCategories"});

Role.belongsToMany(User,{through:"userRoles"});
User.belongsToMany(Role,{through:"userRoles"});

//sync

async function syncData() {
  // await sequelize.sync({ force: true });
  // await dummyData();
}

syncData();

app.listen(3000, function () {
  console.log("listening on port 3000");
});
