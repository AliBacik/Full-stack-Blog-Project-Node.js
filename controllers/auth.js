const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");

exports.get_register = async function (req, res) {
  try {
    return res.json({
      title: "register",
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_register = async function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      return res.status(400).json({ message: "This E-mail is in use!" });
    }

    const newUser = await User.create({
      fullname: name,
      email: email,
      password: password,
    });

    emailService.sendMail({
      from: config.email.from,
      to: newUser.email,
      subject: "Account Created",
      text: "Account Created",
    });

    return res
      .status(200)
      .json({ message: "Account registered successfully." });
  } catch (err) {
    let msg ="";

    for(let e of err.errors){
      msg + e.message + " "
    }

    return res.status(401).json({ message: "Credentials are in use!" });
  }
};

exports.get_login = async function (req, res) {
  try {
    return res.json({
      title: "login",
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_login = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Email bulunamadı." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.isAuth = 1;

      return res.status(200).json({ message: "Login successful", user });
    } else {
      return res.status(401).json({ message: "Wrong Password." });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.get_logout = async function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Session destroy error:", err);
      return res
        .status(500)
        .json({ message: "Logout failed", csrfToken: req.csrfToken() });
    }

    // res.clearCookie("connect.sid"); // Varsayılan cookie adı
    return res.status(200).json({ message: "Logout successful" });
  });
};

exports.get_check_auth = function (req, res) {
  if (req.session.isAuth) {
    res.json({ isAuth: true });
  } else {
    res.json({ isAuth: false });
  }
};

exports.get_reset = async function (req, res) {
  try {
    return res.json({
      title: "Reset Password",
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_reset = async function (req, res) {
  const email = req.body.email;
  try {
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "Email is not in the database" });
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await user.save();

    emailService.sendMail({
      from: config.email.from,
      to: user.email,
      subject: "Reset Password",
      text: `

      <a href="http://localhost:4200/account/new-password/${token}">Reset Password<a/>
      `,
    });

    return res.status(200).json({ message: "Reset link sent!" });
  } catch (err) {
    console.log(err);
  }
};

exports.get_new_password = async function (req, res) {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });

    console.log("USER ID :" + user.id);

    return res.json({
      title: "Reset Password",
      csrfToken: req.csrfToken(),
      token: token,
      userId: user.id,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.post_new_password = async function (req, res) {
  const token = req.body.token;
  const userId = req.body.userId;
  const newPassword = req.body.password;

  console.log("USER ID POST : " + userId)

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
        id: userId,
      },
    });

    user.password = await bcrypt.hash(newPassword, 10);

    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    return res.status(200).json({ message: "Password Changes Succesfully!" });;
  } catch (err) {
    console.log(err);
  }
};
