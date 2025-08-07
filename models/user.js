const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../data/db");

const User = sequelize.define("user",{
    fullname:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg :"Type name!"
            },
            isFullName(value){
                if(value.split(" ").length<2){
                    throw new Error("Please enter a valid name!");
                }
            }
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:{
            args:true,
            msg:"Email is already taken!"
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Password can not be empty"
            },
            len:{
                args:[5,10],
                msg:"Password should be between 5-10 characters"
            }
        }
    },
    resetToken:{
        type:DataTypes.STRING,
        allowNull:true
    },
    resetTokenExpiration:{
        type:DataTypes.DATE,
        allowNull:true
    }
}, { timestamps:true});

User.afterValidate(async (user)=>{
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;