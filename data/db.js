const config = require("../config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
    define : {
      timestamps:false
    },
    storage:"./session.mysql"
  }
);

async function connect(params) {
  try {
    await sequelize.authenticate();
    console.log("bağlantı oldu");
  } catch (err) {}
}
connect();
module.exports = sequelize;

// let connection = mysql.createConnection(config.db);

// connection.connect(function(err){
//     if(err){
//        return console.log(err);
//     }

//     connection.query("select * from blog", function(err,result){

//         console.log(result);
//     })
//     console.log("connected");
// });

// module.exports = connection.promise();
