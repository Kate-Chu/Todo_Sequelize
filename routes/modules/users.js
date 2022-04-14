const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const db = require("../../models");
const User = db.User;

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "您已成功登出");
  res.redirect("login");
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  const user = await User.findOne({ where: { email } });
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "每個欄位都需要填寫" });
  }
  if (user) {
    console.log("User already exists.");
    errors.push({ message: "此使用者已經存在" });
    return res.render("register", {
      name,
      email,
      password,
      confirmPassword,
    });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "確認密碼不一致" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
    });
  }

  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });
  res.redirect("/");
});

module.exports = router;
