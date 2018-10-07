/** importation des librairies */
var mysql = require('mysql'),
  bodyParser = require('body-parser'),
  express = require('express'),
  path = require('path'),
  app = express(),
  server = require('http').createServer(app), //creation du serveur
  io = require('socket.io')(server),
  db = require('./db');

/** definition des middlewares */
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

/** utilisateur connecte */
var user = {};

/** traitement des routes/requete utilisateurs */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/connection.html'));
})
  .post('/connection', (req, res) => {
    db.query('SELECT * FROM user WHERE LOGIN = \'' + req.body.LOGIN + '\' AND PASSWD = \'' + req.body.PSSWD + '\' LIMIT 1', (error, result) => {
      if (error)
        throw error;
      if (result.length != 0) {
        user = {
          pseudo: result[0].LOGIN
        };
        res.sendFile(path.join(__dirname, 'views/welcome.html'));
      } else res.sendFile(path.join(__dirname, '/views/connection.html'));
    });
  })
  .post('/sign', (req, res) => {
    db.query('INSERT INTO user(LOGIN, PASSWD) VALUES(\'' + req.body.LOGIN + '\', \'' + req.body.PSSWD + '\')', (error, result) => {
      if (error) {
        res.sendFile(path.join(__dirname, '/views/connection.html'));
        return;
      }
      user = {
        pseudo: req.body.LOGIN
      };
      res.sendFile(path.join(__dirname, 'views/welcome.html'));
    });
  })
  .get('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, '/views/404.html'));
  });

/** socket de connexion avec le client */
io.on('connection', (client) => {
  client.emit('chat', {
    person: user.pseudo,
    msg: 'bienvenue'
  });
});

/** ecout sur localhost:8080 */
server.listen(8080);