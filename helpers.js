const bcrypt = require('bcryptjs');

function generateRandomString() {
  let lettersAndNumbers = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a',
    'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1',
    '2', '3', '4', '5', '6', '7', '8', '9'
  ];
  let randString = [];
  for (let i = 0; i < 6; i++) {
    let randInt = Math.floor(1 + Math.random() * 61);
    randString.push(lettersAndNumbers[randInt]);
  }
  return randString.join("");
}

const passwordMatchById = function(usersObj, userID, password) {
  if (bcrypt.compareSync(password , usersObj[userID]['password'])) {
    return true;
  }
};

const lookUpEmailById = function(usersObj, cookie_id) {
  let returnEmail;
  for (let user in usersObj) {
    if (user === cookie_id) {
      returnEmail = usersObj[user]['email'];
    }
  }
  return returnEmail;
};

const lookUpIdByEmail = function(usersObj, email) {
  let userId = "";
  for (let user in usersObj) {
    console.log("This is the current users email:", usersObj[user]['email']);
    console.log("this is the current users id", usersObj[user]['id']);
    if (usersObj[user]['email'] === email) {
      userId = usersObj[user]['id'];
    }
  }
  return userId;
};

const lookUpEmailByEmail = function(usersObj, email) {
  for (let user in usersObj) {
    if (usersObj[user]['email'] === email) {
      console.log(usersObj[user]['email']);
      console.log("Email is a match");
      return true;
    }
  }
};

const checkIfEmailIsRegistered = function(usersObj, email) {
  for (let user in usersObj) {
    if (usersObj[user]['email'] === email)
      return true;
  }
};

const lookUpUrlsByUserId = function(urlsObj, userId) {
  let usersUrls = {};
  for (let items in urlsObj) {
    if (urlsObj[items]['userID'] === userId) {
      usersUrls[items] = urlsObj[items]['longURL'];
    }
  }
  return usersUrls;
};

const deleteUrlsByUserId = function(urlsOb, userId, urlToBeDeleted) {
  for (let urls in urlsOb) {
    if (urlsOb[urls]['longURL'] ===  urlToBeDeleted && urlsOb[urls]['userID'] === userId) {
      console.log("deleting this url:", urls);
      delete urlsOb[urls];
    }
  }
};

const lookupUrlByShortAndUser = function(urlsObj, userId, shortUrl) {
  for (let urls in urlsObj) {
    if (urls === shortUrl && urlsObj[urls]['userID'] === userId) {
      return urlsObj[urls]['longURL'];
    }
  }
};

module.exports = {
  generateRandomString,
  passwordMatchById,
  lookUpEmailById,
  lookUpIdByEmail,
  lookUpEmailByEmail,
  checkIfEmailIsRegistered,
  lookUpUrlsByUserId,
  deleteUrlsByUserId,
  lookupUrlByShortAndUser
};