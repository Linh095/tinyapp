const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080; //default port for vagrant environment
const bodyParser = require("body-parser");
const numChar = 6; //number of characters in short url
const numUserID = 10; //number of characters for random user id

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString(numChar) {
  let string = '';
  const chararcters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = numChar; i > 0; --i) {
    string += chararcters[Math.floor(Math.random() * chararcters.length)];
  }
  return string;
};

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('partial', '/partial/_header');

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send('Hello!');
});

app.get("/register", (req, res) => {
  res.render("register")
});







//GO BACK TO THIS SPOT
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  console.log(userID);
  const userInfo = users[userID];
  console.log(userInfo);
  let templateVars = { urls: urlDatabase, user: userInfo};
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//page to display sigle URL and its shorted form
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const _shortURL = generateRandomString(numChar);
  urlDatabase[_shortURL] = req.body.longURL;
  res.redirect("/urls/" + _shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.editedURL;
  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");

  res.redirect("/urls");
});



//  WORKING ON THIS
app.post("/register", (req, res) => {
  const ID = generateRandomString(numUserID);
  const { email, password } = req.body;
  let newUser = {
    'id': ID,
    'email': email,
    'password': password
  }
  users[ID] = newUser;
  res.cookie('user_id', ID);
  let templateVars = { urls: urlDatabase, user: users[ID]};

  res.render("urls_index", templateVars);

  // res.redirect("/urls/" + ID);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></b ody></html>\n");
});