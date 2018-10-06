/* eslint-disable */

var mysql = require('mysql');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use('/static', express.static('views/js'));
app.use('/static', express.static('views/css'));
app.use('/static', express.static('node_modules/bootstrap/dist/css'));
app.use('/static', express.static('node_modules/bootstrap/dist/js'));
app.use('/static', express.static('node_modules/jquery/dist'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

function connector() {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agenda'
  });
  return connection;
}

app.get('/start', (req, res) => {
  res.render('connexion')
}).post('/connexion', (req, res) => {
  var db = connector();
  db.connect((error) => {
    if (error)
      throw error;
    db.query('SELECT * FROM user WHERE LOGIN = \'' + req.body.LOGIN + '\' AND PASSWD = \'' + req.body.PSSWD + '\'', (error, result, length) => {
      if (error)
        throw error;
      if (result.length != 0) {
        res.render('welcome', {
          title: result[0].LOGIN
        });
      } else res.render('connexion');
    });
  });
}).get('*', (req, res) => {
  res.status(404);
  res.render('404');
});

app.listen(8080, '192.168.173.1');