const bcrypt = require("bcrypt");
const { users, urlDatabase } = require("./global_variables");

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

const checkOwnership = (id, shortURL, urlDatabase) => {
  if (urlDatabase[shortURL].userID === id) {
    return true;
  } else {
    return false;
  }
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
};

const updateVisitors = (shortURL, ID, urlDatabase) => {
  let _visitors = urlDatabase[shortURL].visitors;
  for (const visitor of _visitors) {
    if (ID === visitor) {
      return _visitors;
    }
  }
  _visitors.push(ID);
  return _visitors;
};

const updateVisitingInfo = (shortURL, ID, urlDatabase) => {
  let info = urlDatabase[shortURL];
  info["visits"] += 1;
  info["visitors"] = updateVisitors(shortURL, ID, urlDatabase);
  return info;
}

const makeTempVars = (ID, _shortURL, urlDatabase, users) => {
  const tempVars = {
    shortURL: _shortURL,
    info: urlDatabase[_shortURL],
    owner: checkOwnership(ID, _shortURL, urlDatabase),
    loggedIn: checkID(ID, users),
    email: users[ID].email
  };
  return tempVars;
};

const makeTempVarsIndex = (ID, urlDatabase, users) => {
  const tempVars = {
    urls: urlsForUser(ID, urlDatabase),
    email: users[ID].email,
    loggedIn: checkID(ID, users)
  };
  return tempVars;
};

const makeNewURL = (ID, longUrl) => {
  const templateURL = {
    longURL: longUrl,
    userID: ID,
    date: getDate(),
    visits: 0,
    visitors: [ID]
  }
  return templateURL;
};

const makeUserAccount = (email, password, ID) => {
  const templateUser = {
    id: ID,
    email: email,
    password: bcrypt.hashSync(password, 10)
  }
  return templateUser;
}

module.exports = { generateRandomString, loginValidation, registrationValid, getID, checkID, makeTempVars, makeNewURL, makeUserAccount, makeTempVarsIndex, updateVisitingInfo }