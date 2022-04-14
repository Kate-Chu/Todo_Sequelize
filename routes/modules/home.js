const express = require("express");
const router = express.Router();

const db = require("../../models");
const Todo = db.Todo;
const User = db.User;

// 首頁路由
router.get("/", async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) throw new Error("user not found");

  const todos = await Todo.findAll({
    raw: true,
    nest: true,
    where: { UserId: req.user.id },
  });
  res.render("index", { todos });
});

module.exports = router;
