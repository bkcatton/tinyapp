const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const { name } = require('ejs');
const bcrypt = require('bcryptjs');

//Defining middleware
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//helper functions
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
  let randInt = Math.floor(1+Math.random()*61)
  randString.push(lettersAndNumbers[randInt]);
}
return randString.join("");
}

const passwordMatchById = function(usersObj, userID, password) {
    if (usersObj[userID]['password'] === password) {
      return true;
    } 
};

const lookUpEmailById = function(usersObj, cookie_id) {
  let returnEmail;
  for (let user in usersObj) {
    if (user === cookie_id) {
      returnEmail = usersObj[user]['email'];
    } 
  };
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

const lookUpUrlsByUserId = function (urlsObj, userId) {
  let usersUrls = {}; 
  for (let items in urlsObj) {
    if (urlsObj[items]['userID'] === userId) {
      usersUrls[items] = urlsObj[items]['longURL'];
    }
  }
  return usersUrls;
};

const deleteUrlsByUserId = function (urlsOb, userId, urlToBeDeleted) {
  for (let urls in urlsOb) { 
    if (urlsOb[urls]['longURL'] ===  urlToBeDeleted && urlsOb[urls]['userID'] === userId) {
      console.log("deleting this url:", urls);
      delete urlsOb[urls];
    }
  }
};

const lookupUrlByShortAndUser = function(urlsObj, userId, shortUrl){
  for (let urls in urlsObj) {
    if (urls === shortUrl && urlsObj[urls]['userID'] === userId) {
      return urlsObj[urls]['longURL']; 
    }
  }
};

//set variables
const PORT = 8080;
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  }
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  i3HoGr: {
    longURL: "https://www.yahoo.ca",
    userID: "123six"
  },
  i3HRGr: {
    longURL: "https://www.yahoop.ca",
    userID: "123six"
  }
};

//const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined};

//GET Methods
app.get('/', (req, res) => {
  if (req.cookies['user_id'] === 'undefined') {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    res.render('./pages/urls_index', templateVars);
  }
  if (req.cookies['user_id'] !== undefined) {
    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.cookies['user_id']);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    let userEmail = lookUpEmailById(users, req.cookies['user_id']);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.cookies['user_id'];
    res.render('./pages/urls_index', templateVars);
  }
});

app.get('/urls', (req, res) => {
  if (req.cookies['user_id'] === 'undefined') {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    res.render('./pages/urls_index', templateVars);
  }
  if (req.cookies['user_id'] !== undefined) {
     
    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.cookies['user_id']);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    let userEmail = lookUpEmailById(users, req.cookies['user_id']);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.cookies['user_id'];
    res.render('./pages/urls_index', templateVars);
  } else return "not logged in";

});

app.get("/urls/new", (req, res) => {
  if (req.cookies['user_id'] === 'undefined') {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    res.render('./pages/urls_index', templateVars);
  }
  if (req.cookies['user_id'] !== undefined) {
    let formattedUrlDatabase = {};
    lookUpUrlsByUserId(urlDatabase, req.cookies['user_id']);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    let userEmail = lookUpEmailById(users, req.cookies['user_id']);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.cookies['user_id'];
    res.render("./pages/urls_new", templateVars);
  } else return "not logged in";

});

app.get("/urls/:shortURL", (req, res) => {
  console.log("edit button pressed");
  console.log(req.params.shortURL);
  const templateVars = { shortURL: req.params.shortURL, longURL: lookupUrlByShortAndUser(urlDatabase, req.cookies['user_id'], req.params.shortURL), };
  console.log(templateVars); 
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (req.cookies['user_id'] === 'undefined') {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], user_id: undefined, email: undefined };
    res.render("./pages/urls_show", templateVars);
  }
  if (req.cookies['user_id'] !== undefined) {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], user_id: undefined, email: undefined };
    let userEmail = lookUpEmailById(users, req.cookies['user_id']);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.cookies['user_id'];
    res.render("./pages/urls_show", templateVars);
  }
});

app.get("/register", (req, res) => {
  let formattedUrlDatabase;
  const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/register", templateVars);
});

app.get("/login", (req, res) => {
  let formattedUrlDatabase;
  const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/login_page", templateVars);
});

app.get("/urls/:shortURL/update", (req, res) => {
  //when the edit button is pressed, redirect to editing page
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_show", templateVars);
});

//APP POSTS
app.post("/urls", (req, res) => {
  if (req.cookies['user_id'] === 'undefined') {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    res.render('./pages/urls_index', templateVars);
  }
  if (req.cookies['user_id'] !== undefined) {
    console.log("button worked");

    let randVar = generateRandomString();
    urlDatabase[randVar] = {
      longURL: req.body['longURL'],
      userID: req.cookies['user_id']
    };

    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.cookies['user_id']);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    let userEmail = lookUpEmailById(users, req.cookies['user_id']);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.cookies['user_id']; 
    console.log(templateVars);
    res.redirect('/');
  } 
});

app.post("/urls/:shortURL/delete", (req, res) => { //deletes url when button is pressed
  deleteUrlsByUserId(urlDatabase, req.cookies['user_id'], req.body[req.params.shortURL]);
  const formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.cookies['user_id']);
  const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
  console.log(templateVars);
  console.log(formattedUrlDatabase);
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.redirect("/urls");
});


app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL]['longURL'] = req.body['longURL'];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let formattedUrlDatabase;
  const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
   if(lookUpEmailByEmail(users, req.body['email'])) {
    const userId = lookUpIdByEmail(users,req.body['email'])
    if (passwordMatchById(users, userId, req.body['password'])) {
      res.cookie('user_id', userId);
      templateVars['user_id'] = req.cookies['user_id'];
      lookUpUrlsByUserId(urlDatabase, req.cookies['user_id']);
      res.redirect("/urls");
    } 
   } else {
     return res.status(403);
   }
});

app.post("/logout", (req, res) => {
  //when the logout button is pressed, clear
  let formattedUrlDatabase = {};
  const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
  res.cookie('user_id', undefined);
  res.render("./pages/urls_index", templateVars);
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  if (req.body['email'] === "" || req.body['password'] === "") {
    console.log("cant do that");
    return res.status(400)
  } else if (checkIfEmailIsRegistered(users, req.body['email'])) {
    console.log("Email matches with another in system");
    return res.status(400)
  } else {
    users[userID] = {
      id: userID,
      email: req.body['email'],
      password: req.body['password']
    }
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined };
    let userEmail = lookUpEmailById(users, req.cookies['user_id']);
    templateVars['email'] = userEmail;
    res.redirect('./urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
