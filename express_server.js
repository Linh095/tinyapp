const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const { generateRandomString, loginValidation, registrationValid, getID, checkID, urlsForUser, getDate, updateVisitors } = require("./helpers");
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


//GET REQUESTS
app.get("/404", (req, res) => {
  res.render("404")
});

app.get("/_404", (req, res) => {
  res.render("_404")
});

app.get("/403", (req, res) => {
  res.render("403")
});

app.get("/_403", (req, res) => {
  res.render("_403")
});

app.get("/", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    res.redirect("/urls")
  } else {
    const templateVars = { urls: urlDatabase, user: { id: undefined } };
    res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    res.redirect("/urls")
  } else {
    const templateVars = { urls: urlDatabase, user: { id: undefined } };
  res.render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    const userUrls = urlsForUser(ID, urlDatabase);
    const templateVars = { urls: userUrls, user: users[ID] };
    res.render("urls_index", templateVars);
  } else {
    req.session = null;
    const templateVars = { urls: urlDatabase, user: { id: undefined } };
    res.render("logout_home", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    const templateVars = { urls: urlDatabase, user: users[ID] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  const _shortURL = req.params.shortURL;
  if (!checkID(ID, users)) {
    res.redirect("/login");
  } else if (urlDatabase[_shortURL] === undefined) {
    res.redirect("/404");
  } else if (urlDatabase[_shortURL].userID !== ID) {
    urlDatabase[_shortURL].visits += 1;
    urlDatabase[_shortURL].visitors = updateVisitors(_shortURL, ID, urlDatabase);
    let templateVars = { shortURL: _shortURL, info: urlDatabase[_shortURL], owner: false };
    res.render("urls_show", templateVars);
  } else {

    console.log("info", urlDatabase[_shortURL]);

    urlDatabase[_shortURL].visits += 1;
    let templateVars = { shortURL: _shortURL, info: urlDatabase[_shortURL], owner: true};

    console.log(templateVars);

    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.redirect("/_404");
  } else {
    const longURL = urlDatabase[req.params.shortURL]["longURL"];
    res.redirect(longURL);
  }
});


//POST REQUESTS
app.post("/urls", (req, res) => {
  const _shortURL = generateRandomString(numChar);
  const ID = req.session.user_id;
  const _date = getDate();
  urlDatabase[_shortURL] = { longURL: req.body.longURL, userID: ID, date: _date, visits: 1, visitors: 1 }
  res.redirect("/urls/" + _shortURL);
});

app.delete("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.put("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    urlDatabase[req.params.shortURL].longURL = req.body.editedURL;
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

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

app.post("/register", (req, res) => {

  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const _id = req.session.user_id;

  if (checkID(_id, users)) {
    res.redirect("/urls");
  } else if (registrationValid(email, password, users)) {
    const ID = generateRandomString(numUserID);
    let newUser = {
      'id': ID,
      'email': email,
      'password': hashedPassword
    }
    users[ID] = newUser;
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
