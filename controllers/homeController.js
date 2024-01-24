exports.getHome = (req, res, next) => {
  if (req.session.loggedin) {
    // Output username
    res.send("Welcome back, " + req.session.username + "!");
  } else {
    // Not logged in
    res.send("Please login to view this page!");
  }
  res.end();
};
