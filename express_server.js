const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const templateVars = { urls: urlDatabase };

//set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //.render('./pages/urls_index');
  res.send("This is my homepage");
});

app.get('/urls', (req, res) => {


  res.render("./pages/urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("./pages/urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
