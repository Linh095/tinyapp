const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const { generateRandomString, loginValidation, registrationValid, getID, checkID, makeTempVars, makeNewURL, makeUserAccount, makeTempVarsIndex, updateVisitingInfo } = require("./helpers");
const { PORT, numChar, numUserID, users, urlDatabase } = require("./global_variables");

//set keys for cookie encryption - keys can be changed
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('partial', '/partial/_header');
app.set("view engine", "ejs");


//GET REQUESTS: error pages
app.get("/404", (req, res) => {
  res.render("404")
});

app.get("/_404", (req, res) => {
  res.render("_404")
});

app.get("/403", (req, res) => {
  res.render("403")
});

//home page, register, login page; redirect according to if the user is logged in or registed
app.get("/", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    const templateVars = makeTempVarsIndex(ID, urlDatabase, users);
    res.render("urls_index", templateVars);
  } else {
    req.session = null;
    const templateVars = { loggedIn: false };
    res.render("logout_home", templateVars);
  }
});

app.get("/register", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    res.redirect("/urls")
  } else {
    const templateVars = { loggedIn: false };
    res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    res.redirect("/urls")
  } else {
    const templateVars = { loggedIn: false };
    res.render("login", templateVars);
  }
});

//get page that enables logged in user to make new links
app.get("/urls/new", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    const templateVars = makeTempVarsIndex(ID, urlDatabase, users);
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//get page linked to short url; check if the url actually exists and if the user is logged in; if the user is not the owner of the short url, they can still see it but they cannot edit it (count visit and visitor), owner can edit
app.get("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  const _shortURL = req.params.shortURL;

  if (urlDatabase[_shortURL] === undefined) {
    res.redirect("/404");
  } else if (!checkID(ID, users)) {
    res.redirect("/login");
  } else if (urlDatabase[_shortURL].userID !== ID) {
    urlDatabase[_shortURL] = updateVisitingInfo(_shortURL, ID, urlDatabase);


    const templateVars = makeTempVars(ID, _shortURL, urlDatabase, users);
    res.render("urls_show", templateVars);
  } else {
    urlDatabase[_shortURL] = updateVisitingInfo(_shortURL, ID, urlDatabase);
    const templateVars = makeTempVars(ID, _shortURL, urlDatabase, users);
    res.render("urls_show", templateVars);
  }
});

//redirect short URL to sight of corresponding long URL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.redirect("/_404");
  } else {
    const longURL = urlDatabase[req.params.shortURL]["longURL"];
    res.redirect(longURL);
  }
});

//Post request to add new url to database
app.post("/urls", (req, res) => {
  const _shortURL = generateRandomString(numChar);
  const ID = req.session.user_id;
  urlDatabase[_shortURL] = makeNewURL(ID, req.body.longURL);
  res.redirect("/urls/" + _shortURL);
});

//delete shortURL and redirect to homepage
app.delete("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//edit long url for short url in database
app.put("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    urlDatabase[req.params.shortURL].longURL = req.body.editedURL;
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//login post: if user is already logged in, redirect to home; if they are not logged in and have valide password + email redirect to logged in home; if email or password not valid, redirect to error page
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const ID = getID(email, users);
  const _id = req.session.user_id;

  if (checkID(_id, users)) {
    res.redirect("/urls");
  } else if (ID !== undefined && loginValidation(ID, password, users)) {
    req.session.user_id = ID;
    res.redirect("/urls");
  } else {
    res.redirect("403");
  }
});

//register post: if user is already logged in, redirect to home; if they are not logged in and have valide email and password, make new account
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const _id = req.session.user_id;

  if (checkID(_id, users)) {
    res.redirect("/urls");
  } else if (registrationValid(email, password, users)) {
    const ID = generateRandomString(numUserID);
    users[ID] = makeUserAccount(email,hashedPassword,ID);
    req.session.user_id = ID;
    res.redirect("/urls");
  } else {
    res.redirect("/404")
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//pre loaded stuff
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
