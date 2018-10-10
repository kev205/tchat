/** importation des librairies */
var path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  server = require('http').createServer(app), //creation du serveur
  io = require('socket.io')(server),
  db = require('./db-connector');

/** definition des middlewares */
app.use('/static', [express.static('views/js'),
  express.static('views/css'),
  express.static('node_modules/bootstrap/dist/css'),
  express.static('node_modules/bootstrap/dist/js'),
  express.static('node_modules/jquery/dist'),
  express.static('node_modules/socket.io-client/dist'),
  express.static('serveur/images')
]);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/** utilisateur connecte */
var user = {};
var allUser = [];

/** traitement des routes/requete utilisateurs */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/connection.html'));
})
  .get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signIn.html'));
  })
  .get('/connected', (req, res) => {
    db.query('SELECT DISTINCT PSEUDO, TEL FROM utilisateur WHERE CONNECT = 1', (error, result) => {
      if (error)
        throw error;
      res.send(JSON.stringify(result));
    });
  })
  .get('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'views/404.html'));
  })
  .post('/logIn', (req, res) => {
    db.query('SELECT * FROM utilisateur WHERE TEL = \'' + req.body.TEL + '\' AND PSSWD = \'' + req.body.PSSWD + '\' AND CONNECT = 0 LIMIT 1', (error, result) => {
      if (error)
        throw error;
      if (result.length != 0) {
        db.query('UPDATE utilisateur SET CONNECT = 1 WHERE TEL = \'' + req.body.TEL + '\'');
        user = {
          pseudo: result[0].PSEUDO,
          tel: result[0].TEL
        };
        res.setHeader('sign-in', 'succes');
        res.sendFile(path.join(__dirname, 'views/welcome.html'));
      } else {
        res.setHeader('sign-in', 'failed');
        res.sendFile(path.join(__dirname, 'views/connection.html'));
      }
    });
  })
  .post('/signIn', (req, res) => {
    db.query('INSERT INTO utilisateur(TEL, PSEUDO, PSSWD) VALUES(\'' + req.body.TEL + '\', \'' + req.body.PSEUDO + '\', \'' + req.body.PSSWD + '\')', (error) => {
      if (error) {
        res.setHeader('sign-in-error', error.errno);
        res.sendFile(path.join(__dirname, 'views/signIn.html'));
        return;
      }
      user = {
        pseudo: req.body.PSEUDO,
        tel: req.body.TEL
      };
      res.sendFile(path.join(__dirname, 'views/welcome.html'));
    });
  });

/** socket de connexion avec le client */
var Connected = function (tel, login) {
  this.LOGIN = login;
  this.TEL = tel;
};
var iterator;
io.on('connection', (client) => {
  var inComme = new Connected(user.tel, user.pseudo);
  allUser.push({
    USER: inComme,
    SOCKET: client
  });
  io.emit('user connect');
  client.on('disconnect', () => {
    for (iterator of allUser) {
      if (iterator.SOCKET === client) {
        db.query('UPDATE utilisateur SET CONNECT = 0 WHERE TEL = \'' + iterator.USER.TEL + '\'');
        break;
      }
    }
    io.emit('user quit');
  });
});

/** ecout sur localhost:8080 */
server.listen(8080);