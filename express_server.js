const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');

//Defining middleware
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['password123'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//helper functions
const {generateRandomString} = require('./helpers');
const {passwordMatchById} = require('./helpers');
const {lookUpEmailById} = require("./helpers");
const {lookUpIdByEmail} = require("./helpers");
const {lookUpEmailByEmail} = require("./helpers");
const {checkIfEmailIsRegistered} = require("./helpers");
const {lookUpUrlsByUserId} = require("./helpers");
const {deleteUrlsByUserId} = require("./helpers");
const {lookupUrlByShortAndUser} = require("./helpers");

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

//GET Methods
app.get('/', (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined,};
    res.render('./pages/login_page', templateVars);
  }
  if (req.session.user_id !== undefined) {
    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.session.user_id);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedin"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.render('./pages/urls_index', templateVars);
  }
});

app.get('/urls', (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/urls_index', templateVars);
  }
  if (req.session.user_id !== undefined) {
     
    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.session.user_id);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedin"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.render('./pages/urls_index', templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout" };
    res.render('./pages/login_page', templateVars);
  }
  if (req.session.user_id !== undefined) {
    let formattedUrlDatabase = {};
    lookUpUrlsByUserId(urlDatabase, req.session.user_id);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedin"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.render("./pages/urls_new", templateVars);
  } else return "not logged in";

});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/urls_index', templateVars);
  }
  if (req.session.user_id !== undefined) {
    const templateVars = { shortURL: req.params.shortURL, longURL: lookupUrlByShortAndUser(urlDatabase, req.session.user_id, req.params.shortURL), user_id: undefined, email: undefined, alertMessage: "loggedin"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.render("./pages/urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL]['longURL']);
  }
  if (urlDatabase[req.params.shortURL] === undefined && req.session.user_id !== undefined) {
    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.session.user_id);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "doesNotExist"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.render('./pages/urls_index', templateVars);
  }
  if (urlDatabase[req.params.shortURL] === undefined && req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/urls_index', templateVars);
  }

});

app.get("/register", (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/register', templateVars);
  }
  if (req.session.user_id !== undefined) {
    res.redirect('./urls');
  }
});

app.get("/login", (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: ""};
    res.render('./pages/login_page', templateVars);
  }
  if (req.session.user_id !== undefined) {
    res.redirect('./urls');
  }
});

app.get("/urls/:shortURL/update", (req, res) => {
  //when the edit button is pressed, redirect to editing page
  let userEmail = lookUpEmailById(users, req.session.user_id);
  let formattedUrlDatabase;
  const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: ""};
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.session.user_id;
  res.render("./pages/urls_show", templateVars);
});

// //APP POSTS
app.post("/urls", (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/urls_index', templateVars);
  }
  if (req.session.user_id !== undefined) {
    let randVar = generateRandomString();
    urlDatabase[randVar] = {
      longURL: req.body['longURL'],
      userID: req.session.user_id
    };

    const templateVars = { shortURL: randVar, longURL: lookupUrlByShortAndUser(urlDatabase, req.session.user_id, randVar), user_id: undefined, email: undefined, alertMessage: "loggedin"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.render("./pages/urls_show", templateVars);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => { //deletes url when button is pressed
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/urls_index', templateVars);
  }
  if (req.session.user_id !== undefined) {
    deleteUrlsByUserId(urlDatabase, req.session.user_id, req.body[req.params.shortURL]);
    let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.session.user_id);
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedin"};
    let userEmail = lookUpEmailById(users, req.session.user_id);
    templateVars['email'] = userEmail;
    templateVars['user_id'] = req.session.user_id;
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === undefined) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedout"};
    res.render('./pages/urls_index', templateVars);
  }
  if (req.session.user_id !== undefined) {
    urlDatabase[req.params.shortURL]['longURL'] = req.body['longURL'];
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  
  if (lookUpEmailByEmail(users, req.body['email'])) {
    const userId = lookUpIdByEmail(users,req.body['email']);
    if (passwordMatchById(users, userId, req.body['password'])) {
      req.session.user_id = userId;
      let formattedUrlDatabase = lookUpUrlsByUserId(urlDatabase, req.session.user_id);
      const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "loggedin"};
      console.log("session id?", req.session.user_id);
      templateVars['user_id'] = req.session.user_id;
      let userEmail = lookUpEmailById(users, req.session.user_id);
      templateVars['email'] = userEmail;
      res.render('./pages/urls_index', templateVars);
    }
  } if (lookUpEmailByEmail(users, req.body['email'])) {
    let formattedUrlDatabase;
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "noMatch"};
    res.render('./pages/login_page', templateVars);
  }
});

app.post("/logout", (req, res) => {
  //when the logout button is pressed, clear
  req.session.user_id = undefined;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  if (req.body['email'] === "" || req.body['password'] === "") {
    console.log("cant do that");
    let formattedUrlDatabase = {};
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "blank" };
    res.render("./pages/register", templateVars);
  } else if (checkIfEmailIsRegistered(users, req.body['email'])) {
    let formattedUrlDatabase = {};
    const templateVars = { urls: formattedUrlDatabase, user_id: undefined, email: undefined, alertMessage: "matched" };
    res.render("./pages/register", templateVars);
  } else {
    users[userID] = {
      id: userID,
      email: req.body['email'],
      password: bcrypt.hashSync(req.body['password'], 10)
    };
    res.redirect('./urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
