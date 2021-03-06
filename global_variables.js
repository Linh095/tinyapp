const bcrypt = require("bcrypt");

const PORT = 8080; //default port for vagrant environment

const numChar = 6; //number of characters in short url
const numUserID = 10; //number of characters for random user id

//encrypt password for example users
const hashedPassword = bcrypt.hashSync("dinosaur", 10);
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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID", date: "Mar 16 2020", visits: 5, visitors: ["userRandomID", "user2RandomID"] },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID", date: "Mar 16 2020", visits: 10, visitors: ["user2RandomID"]}
};

module.exports = { PORT, numChar, numUserID, users, urlDatabase };