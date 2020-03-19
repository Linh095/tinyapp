const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const Keygrip = require("keygrip");
const PORT = 8080; //default port for vagrant environment
const bodyParser = require("body-parser");
const numChar = 6; //number of characters in short url
const numUserID = 10; //number of characters for random user id

const hashedPassword = bcrypt.hashSync("purple-monkey-dinosaur", 10);
const hashedPassword2 = bcrypt.hashSync("dishwasher-funk", 10);

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: hashedPassword
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: hashedPassword2
  }
}

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};


const generateRandomString = (numChar) => {
  let string = '';
  const chararcters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = numChar; i > 0; --i) {
    string += chararcters[Math.floor(Math.random() * chararcters.length)];
  }
  return string;
};

const loginValidation = (ID, password) => {
  if (password === "") {
    return false;
  }
  return bcrypt.compareSync(password, users[ID].password);
};

const registrationValid = (email, password) => {
  if (email === "" || password === "") {
    return false;
  }
  for (user in users) {
    if (users[user].email === email) {
      return false;
    }
  }
  return true;
};

const getID = (email) => {
  for (user in users) {
    if (users[user].email === email) {
      return user;
    }
  }
  return undefined;
}

const checkID = (id) => {
  for (user in users) {
    if (users[user].id === id) {
      return true;
    }
  }
  return false;
}

const urlsForUser = (id) => {
  let userURLs = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};

//activate stuff (some preloaded)
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


//WORKING ON THIS ONE
app.get("/urls", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID)) {
    const userUrls = urlsForUser(ID);
    const templateVars = { urls: userUrls, user: users[ID] };
    res.render("urls_index", templateVars);
  } else {
    const templateVars = { urls: urlDatabase, user: { id: undefined } };
    res.render("logout_home", templateVars);
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
  if (checkID(ID)) {
    const templateVars = { urls: urlDatabase, user: users[ID] };
    res.render("urls_new", templateVars);

  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID)) {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//POST COMMANDS
app.post("/urls", (req, res) => {
  const _shortURL = generateRandomString(numChar);
  const ID = req.session.user_id;
  urlDatabase[_shortURL] = { longURL: req.body.longURL, userID: ID }
  res.redirect("/urls/" + _shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const ID = req.session.user_id;
  if (checkID(ID)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.editedURL;
  res.redirect("/urls/" + req.params.shortURL);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const ID = getID(email);
  if (ID !== undefined && loginValidation(ID, password)) {
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

  if (registrationValid(email, password)) {
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