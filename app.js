const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const usePassport = require("./config/passport");
const flash = require("connect-flash");
const routes = require("./routes");
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
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
