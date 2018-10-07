var mysql = require('mysql'),
  bodyParser = require('body-parser'),
  express = require('express'),
  webServ = require('ws').Server,
  ws = require('ws'),
  path = require('path'),
  app = express();
app.use('/static', [express.static('views/js'),
  express.static('views/css'),
  express.static('node_modules/bootstrap/dist/css'),
  express.static('node_modules/bootstrap/dist/js'),
  express.static('node_modules/jquery/dist')
]);
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

app.get('/start.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/connexion.html'));
}).post('/connexion.html', (req, res) => {
  var db = connector();
  db.connect((error) => {
    if (error)
      throw error;
    db.query('SELECT * FROM user WHERE LOGIN = \'' + req.body.LOGIN + '\' AND PASSWD = \'' + req.body.PSSWD + '\'', (error, result) => {
      if (error)
        throw error;
      if (result.length != 0) {
        res.sendFile(path.join(__dirname, 'views/welcome.html'));
      } else res.sendFile(path.join(__dirname, '/views/connexion.html'));
    });
  });
}).get('*', (req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, '/views/404.html'));
});

var server = app.listen(8080, 'localhost');

let wss = new webServ({
  server: server,
  path: 'ws://localhost:8080'
});
wss.on('connection', (ws) => {
  console.log('connection ' + ws.url);
  ws.on('message', (message) => {
    console.log('received : ' + message);
  });
  ws.send('bonjour');
});
wss.on('close', (e) => {
  console.log('websocket closed' + e);
});