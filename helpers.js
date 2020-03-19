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

module.exports = { generateRandomString, loginValidation, registrationValid, getID, checkID, urlsForUser }