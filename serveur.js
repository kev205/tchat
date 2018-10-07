var mysql = require('mysql'),
  bodyParser = require('body-parser'),
  express = require('express'),
  path = require('path'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server);
app.use('/static', [express.static('views/js'),
  express.static('views/css'),
  express.static('node_modules/bootstrap/dist/css'),
  express.static('node_modules/bootstrap/dist/js'),
  express.static('node_modules/jquery/dist'),
  express.static('node_modules/socket.io-client/dist')
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/connexion.html'));
}).post('/connexion', (req, res) => {
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

io.on('connection', (client) => {
  client.broadcast.emit('this', {msg: 'new connection'});
  client.on('chat message', (data) => {
    console.log('sended : ' + data.msg);
  });
});
server.listen(8080);