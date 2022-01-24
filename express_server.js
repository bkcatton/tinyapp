const express = require('express');
const app = express();
const PORT = 8080;

//set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //.render('./pages/urls_index');
  res.send("This is my homepage");
});

app.get('/urls', (req, res) => {

  const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  };

  const templateVars = { urls: urlDatabase };

  res.render("./pages/urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
