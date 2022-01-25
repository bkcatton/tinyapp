const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const templateVars = { urls: urlDatabase };

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


//set the view engine to ejs app.set('view engine', 'ejs');

app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  //.render('./pages/urls_index');
  res.send("This is my homepage");
});

app.get('/urls', (req, res) => {
  res.render("./pages/urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("./pages/urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("./pages/urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("./pages/urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let randVar = generateRandomString();
  urlDatabase[randVar] = req.body['longURL'];  //add the randomly generated string, url pair to the data base
  const templateVars = { shortURL: randVar, longURL: req.body['longURL'] };
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
  res.render("./pages/urls_show", templateVars);
});

app.post("/urls/:shortURL/update", (req, res) => {
  //when the update button is pressed, longURL will change to longUpdate
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  urlDatabase[req.params.shortURL] = req.body['longURL'];
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
