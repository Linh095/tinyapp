const express = require("express");
const app = express();
const PORT = 8080; //default port for vagrant environment
const bodyParser = require("body-parser");
const numChar = 6; //number of characters in short url

function generateRandomString(numChar) {
  let string = '';
  const chararcters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = numChar; i > 0; --i) {
      string += chararcters[Math.floor(Math.random() * chararcters.length)];
    }
    return string;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(bodyParser.urlencoded({extended: true}));

app.set('partial', '/partial/_header');
app.set("view engine", "ejs");



app.get("/", (req, res) => {
  res.send('Hello!');
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  
  //saves this to database object
  const _shortURL = generateRandomString(numChar);
  urlDatabase[_shortURL]= req.body.longURL;
  console.log(_shortURL);
  console.log(urlDatabase[_shortURL]);

  res.redirect("/urls/" + _shortURL);         // Respond with 'Ok' (we will replace this)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//page to display sigle URL and its shorted form
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></b ody></html>\n");
});