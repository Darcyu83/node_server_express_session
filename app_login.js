const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(morgan("dev"));

// middleware to test if authenticated
function isAuthenticated(req, res, next) {
  if (!req.session.email) return next("route");

  next();
}

app.use(function (req, res, next) {
  console.log(
    "first middleware:: req.body, req.session, req.session.id",
    req.body,
    req.session,
    req.session.id
  );

  next();
});

app.get("/", isAuthenticated, function (req, res) {
  // this is only called when there is an authentication user due to isAuthenticated

  res.send(`Hello ${req.session.email} <a href="/logout">Logout</a>`);
});

app.get("/", function (req, res) {
  res.send(
    '<form action="/login" method="post">' +
      'Username: <input name="email"><br>' +
      'Password: <input name="password" type="password"><br>' +
      '<input type="submit" text="Login"></form>'
  );
});

app.post("/login", function (req, res) {
  /**
   *  login logic to validate req.body.email and req.body.pass
   *  would be implemented here. for this example any combo works
   */
  /**
   * regenerate the session, which is good practice to help
   * guard against forms of session fixation
   */
  req.session.regenerate(function (err) {
    if (err) next(err);

    // store user information in session, typically a user id

    req.session.email = req.body.email;

    req.session.save(function (err) {
      if (err) return next(err);
      res.redirect("/");
    });
  });
});

app.get("/logout", function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id does not have a logged in user

  req.session.email = null;
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/");
    });
  });
});

app.listen(3000, () => {});
