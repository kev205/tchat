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
    db.query('SELECT * FROM utilisateur WHERE TEL = \'' + req.body.TEL + '\' AND PSSWD = \'' + req.body.PSSWD + '\' LIMIT 1', (error, result) => {
      if (error)
        throw error;
      if (result.length != 0) {
        user = {
          pseudo: result[0].PSEUDO
        };
        res.setHeader('sign-in', 'succes');
        res.sendFile(path.join(__dirname, 'views/welcome.html'));
      } else {
        res.setHeader('sign-in', 'failed');
        res.sendFile(path.join(__dirname, 'views/connection.html'));
      }
    });
  })
  .get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signIn.html'));
  })
  .get('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'views/404.html'));
  })
  .post('/signIn', (req, res) => {
    db.query('INSERT INTO utilisateur(TEL, PSEUDO, PSSWD) VALUES(\'' + req.body.TEL + '\', \'' + req.body.PSEUDO + '\', \'' + req.body.PSSWD + '\')', (error) => {
      if (error) {
        res.setHeader('sign-in-error', error.errno);
        res.sendFile(path.join(__dirname, 'views/signIn.html'));
        return;
      }
      user = {
        pseudo: req.body.PSEUDO
      };
      res.sendFile(path.join(__dirname, 'views/welcome.html'));
    });
  });

/** socket de connexion avec le client */
io.on('connection', (client) => {
  client.emit('chat', {
    person: user.pseudo,
    msg: 'bienvenue'
  });
  client.on('disconnect', () => {
    io.emit('user quit');
  });
});

/** ecout sur localhost:8080 */
server.listen(8080);