const express = require("express");

const session = require("express-session");
const url = require("url");
const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// view count middleware
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }
  // get the url pathname
  const pathname = url.parse(req.url).pathname;
  console.log("pathname ===", pathname);
  // count the views
  console.log("req.session ===", req.session);
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  next();
});

app.get("/foo", function (req, res, next) {
  res.send("you viewed this page " + req.session.views["/foo"] + " times");
});

app.get("/bar", function (req, res, next) {
  res.send("you viewed this page " + req.session.views["/bar"] + " times");
});

app.listen(3000, () => {
  console.log("Server : port :: 3000");
});
