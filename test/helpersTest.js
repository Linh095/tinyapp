const { assert } = require('chai');
const bcrypt = require("bcrypt");

const { loginValidation, registrationValid, getID, checkID, urlsForUser, updateVisitors } = require('../helpers.js');

const { users, urlDatabase } = require("../global_variables.js");

const hashedPassword = bcrypt.hashSync("purple-monkey-dinosaur", 10);
const hashedPassword2 = bcrypt.hashSync("dishwasher-funk", 10);

describe('loginValidation', function() {
  it('should return true if encrypted password and ID are in the database and match', function() {
    const validity = loginValidation("user2RandomID", "dishwasher-funk", users);
    assert.isTrue(validity);
  });

  it('should return false if encrypted password and ID are in the database and do not match', function() {
    const validity = loginValidation("userRandomID", "purple-monkey", users);
    assert.isFalse(validity);
  });

  it('should return false if password entered is an empty string', function() {
    const validity = loginValidation("userRandomID","", users);
    assert.isFalse(validity);
  });
});

describe('registrationValid', function() {
  it('should return true if the email being registered did not exist in the database and password + email are not empty strings', function() {
    const validity = registrationValid("example@email.com", "dishwasher-12345", users);
    assert.isTrue(validity);
  });

  it('should return false if email or password entered is an empty string', function() {
    const validity = registrationValid("","12345", users);
    assert.isFalse(validity);
  });

  it('should return false if email being registered already existed in the database', function() {
    const validity = registrationValid("user@example.com","12345", users);
    assert.isFalse(validity);
  });
});

describe('getID', function() {
  it('should return a user ID with valid email', function() {
    const user = getID("user@example.com", users)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined if the email is not in the database', function() {
    const user = getID("lalala", users)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('checkID', function() {
  it('should return true if a user ID exist in the database', function() {
    assert.isTrue(checkID("userRandomID", users));
  });

  it('should return false if a user ID does not exist in the database', function() {
    assert.isFalse(checkID("randomID", users));
  });

  it('should return false if a user ID is an empty string', function() {
    assert.isFalse(checkID("", users));
  });
});

describe('urlsForUser', function() {
  it('should return an object with all the links created by a user', function() {
    const userLinks = urlsForUser("userRandomID", urlDatabase);
    const expectedOutput = { b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID", date: "3/16/2020", visits: 5, visitors: ["userRandomID", "user2RandomID"] } };
    assert.deepEqual(userLinks, expectedOutput);
  });
});

describe('updateVisitors', function() {
  it('should return the same array of visitorIDs if the current visitor has visted the shortURL before', function() {
    const expectedOutput = ["userRandomID", "user2RandomID"];
    assert.deepEqual(expectedOutput, updateVisitors("b6UTxQ", "userRandomID", urlDatabase));
  });
  it('should return a new array of visitorIDs if the current visitor has never visted the shortURL before', function() {
    const expectedOutput = ["userRandomID", "user2RandomID"];
    assert.notDeepEqual(expectedOutput, updateVisitors("b6UTxQ", "userRandom", urlDatabase));
  });
});