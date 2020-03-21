const bcrypt = require("bcrypt");

const generateRandomString = (numChar) => {
  let string = '';
  const chararcters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = numChar; i > 0; --i) {
    string += chararcters[Math.floor(Math.random() * chararcters.length)];
  }
  return string;
};

const loginValidation = (ID, password, usersDatabase) => {
  if (password === "") {
    return false;
  }
  return bcrypt.compareSync(password, usersDatabase[ID].password);
};

const registrationValid = (email, password, usersDatabase) => {
  if (email === "" || password === "") {
    return false;
  }
  for (user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return false;
    }
  }
  return true;
};

const getID = (email, usersDatabase) => {
  for (user in usersDatabase) {
    if (usersDatabase[user].email === email) {
      return user;
    }
  }
  return undefined;
}

const checkID = (id, usersDatabase) => {
  for (user in usersDatabase) {
    if (usersDatabase[user].id === id) {
      return true;
    }
  }
  return false;
}
//************************ */
const checkOwnership = (id, shortURL, urlDatabase) => {

}

const urlsForUser = (id, urlDatabase) => {
  let userURLs = {};
  for (shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};

const getDate = () => {
  const date = new Date().toString().split(" ");
  return `${date[1]} ${date[2]} ${date[3]}`;
}

const updateVisitors = (shortURL, ID, urlDatabase) => {
  let _visitors = urlDatabase[shortURL].visitors;
  for (const visitor of _visitors) {
    if (ID === visitor) {
      return _visitors;
    }
  }
  return _visitors.push(ID)
}

const makeTempVars = (ID, _shortURL, urlDatabase, users) => {
  
  let tempVars = {shortURL: _shortURL,
                  info: urlDatabase[_shortURL],
                  owner: ,
                  loggedIn: };

  return tempVars;
}
module.exports = { generateRandomString, loginValidation, registrationValid, getID, checkID, urlsForUser, getDate, updateVisitors }