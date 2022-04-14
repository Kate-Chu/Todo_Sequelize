const express = require("express");
const router = express.Router();
const db = require("../../models");
const Todo = db.Todo;

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", async (req, res) => {
  const UserId = req.user.id;
  const name = req.body.name;
  await Todo.create({ name, UserId });
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  const todo = await Todo.findOne({ where: { id, UserId } });
  res.render("detail", { todo: todo.toJSON() });
});

router.get("/:id/edit", async (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  const todo = await Todo.findOne({ where: { id, UserId } });
  res.render("edit", { todo: todo.get() });
});

router.put("/:id", async (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  const { name, isDone } = req.body;
  const todo = await Todo.findOne({ where: { id, UserId } });
  todo.name = name;
  todo.isDone = isDone === "on";
  await todo.save();
  res.redirect(`/`);
});

router.delete("/:id", async (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  const todo = await Todo.findOne({ where: { id, UserId } });
  await todo.destroy();
  res.redirect("/");
});

module.exports = router;
