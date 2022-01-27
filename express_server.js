const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const { name } = require('ejs');

//Defining middleware
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const templateVars = { urls: urlDatabase, user_id: undefined, email: undefined};

//GET Methods
app.get('/', (req, res) => {
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render('./pages/urls_index', templateVars);
});

app.get('/urls', (req, res) => {
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id']
  res.render("./pages/urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], };
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], };
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], };
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/register", templateVars);
});

app.get("/login", (req, res) => {
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/login_page", templateVars);
});

//APP POSTS
app.post("/urls", (req, res) => {
  let randVar = generateRandomString();
  urlDatabase[randVar] = req.body['longURL'];  //add the randomly generated string, url pair to the data base
  const templateVars = { shortURL: randVar, longURL: req.body['longURL']};
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  //templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  //when the delete button is pressed, this will happen
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//update URL post and get functions
app.get("/urls/:shortURL/update", (req, res) => {
  //when the edit button is pressed, redirect to editing page
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  templateVars['user_id'] = req.cookies['user_id'];
  res.render("./pages/urls_show", templateVars);
});

app.post("/urls/:shortURL/update", (req, res) => {
  //when the update button is pressed, longURL will change to longUpdate
  //const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  urlDatabase[req.params.shortURL] = req.body['longURL'];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {

  console.log("passing in email:", req.body['email']);
   if(lookUpEmailByEmail(users, req.body['email'])) {
    console.log("email match function return true in post method");
    const userId = lookUpIdByEmail(users,req.body['email'])
    console.log("user id looked up by email is: ", userId);
    
    if (passwordMatchById(users, userId, req.body['password'])) {
      console.log("passwords match too")
      res.cookie('user_id', userId);
      templateVars['user_id'] = req.cookies['user_id'];
    } else {
      console.log("passwords do not match");
    }

   } else {
     console.log("email match funtion returned false");
     return res.status(403);
   }
   res.redirect('./urls');
});

app.post("/logout", (req, res) => {
  //when the logout button is pressed, clear
  
  templateVars['email'] = undefined;
  res.cookie('user_id', undefined);
  templateVars['user_id'] = undefined;
  res.redirect('./urls');
});

app.post("/register", (req, res) => {
  //when a user registers with an email and password, add them to the new global users object, use id gen to get new id tag,
  //set user_id cookie containing the new id tag
  //redirect to /urls
  //
  let userID = generateRandomString()
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
 
  let userEmail = lookUpEmailById(users, req.cookies['user_id']);
  templateVars['email'] = userEmail;
  res.redirect('./urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
