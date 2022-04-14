const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const usePassport = require("./config/passport");
const app = express();
const PORT = 3000;
const db = require("./models");
const Todo = db.Todo;
const User = db.User;

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);

usePassport(app);

app.get("/", async (req, res) => {
  const todos = await Todo.findAll({
    raw: true,
    nest: true,
  });
  res.render("index", { todos: todos });
});

app.get("/users/login", (req, res) => {
  res.render("login");
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

app.get("/users/register", (req, res) => {
  res.render("register");
});

app.post("/users/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    console.log("User already exists.");
    return res.render("register", {
      name,
      email,
      password,
      confirmPassword,
    });
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });
  res.redirect("/");
});

app.get("/users/logout", (req, res) => {
  res.redirect("login");
});

app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findByPk(id);
  res.render("detail", { todo: todo.toJSON() });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
