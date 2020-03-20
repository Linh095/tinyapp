const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const { generateRandomString, loginValidation, registrationValid, getID, checkID, urlsForUser } = require("./helpers");
const { PORT, numChar, numUserID, users, urlDatabase } = require("./global_variables");

//set keys for cookie encryption 
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('partial', '/partial/_header');
app.set("view engine", "ejs");

//GET REQUESTS
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: { id: undefined } };
  res.render("register", templateVars)
});

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user: { id: undefined } };
  res.render("login", templateVars)
});

app.get("/urls", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    const userUrls = urlsForUser(ID, urlDatabase);
    const templateVars = { urls: userUrls, user: users[ID] };
    res.render("urls_index", templateVars);
  } else {
    const templateVars = { urls: urlDatabase, user: { id: undefined } };
    res.render("logout_home", templateVars);
  }
});

app.get("/urls/myurl", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    const userUrls = urlsForUser(ID, urlDatabase);
    const templateVars = { urls: userUrls, user: users[ID] };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/404", (req, res) => {
  res.render("404")
});

app.get("/403", (req, res) => {
  res.render("403")
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
  if (!checkID(ID, users)) {
    res.redirect("/login");
  } else if (urlDatabase[req.params.shortURL] === undefined){
    res.redirect("/404");
  } else {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"] };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined){
    res.redirect("/404");
  } else {
    const longURL = urlDatabase[req.params.shortURL]["longURL"];
    res.redirect(longURL);
  }
});


//POST REQUESTS
app.post("/urls", (req, res) => {
  const _shortURL = generateRandomString(numChar);
  const ID = req.session.user_id;
  urlDatabase[_shortURL] = { longURL: req.body.longURL, userID: ID }
  console.log(urlDatabase);
  res.redirect("/urls/"+_shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID, users)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL", (req, res) => {
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
  if (ID !== undefined && loginValidation(ID, password, users)) {
    req.session.user_id = ID;
    res.redirect("/urls");
  } else {
    res.redirect("403");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {

  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (registrationValid(email, password, users)) {
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



//pre loaded stuff
app.get("/", (req, res) => {
  res.send('Hello!');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></b ody></html>\n");
});