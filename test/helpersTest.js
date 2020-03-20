const { assert } = require('chai');
const bcrypt = require("bcrypt");

const { loginValidation, registrationValid, getID, checkID, urlsForUser } = require('../helpers.js');

const hashedPassword = bcrypt.hashSync("purple-monkey-dinosaur", 10);
const hashedPassword2 = bcrypt.hashSync("dishwasher-funk", 10);

const testUsers = {
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

describe('loginValidation', function() {
  it('should return true if encrypted password and ID are in the database and match', function() {
    const validity = loginValidation("user2RandomID", "dishwasher-funk", testUsers);
    assert.isTrue(validity);
  });

  it('should return false if encrypted password and ID are in the database and do not match', function() {
    const validity = loginValidation("userRandomID", "purple-monkey", testUsers);
    assert.isFalse(validity);
  });

  it('should return false if password entered is an empty string', function() {
    const validity = loginValidation("userRandomID","", testUsers);
    assert.isFalse(validity);
  });
});

describe('registrationValid', function() {
  it('should return true if the email being registered did not exist in the database and password + email are not empty strings', function() {
    const validity = registrationValid("example@email.com", "dishwasher-12345", testUsers);
    assert.isTrue(validity);
  });

  it('should return false if email or password entered is an empty string', function() {
    const validity = registrationValid("","12345", testUsers);
    assert.isFalse(validity);
  });

  it('should return false if email being registered already existed in the database', function() {
    const validity = registrationValid("user@example.com","12345", testUsers);
    assert.isFalse(validity);
  });
});

describe('getID', function() {
  it('should return a user ID with valid email', function() {
    const user = getID("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined if the email is not in the database', function() {
    const user = getID("lalala", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});