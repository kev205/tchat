/** importation des librairies */
var path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  app = express(),
  server = require('http').createServer(app), //creation du serveur
  io = require('socket.io')(server),
  db = require('./db-connector');

/** definition des middlewares */
app.use('/static', [express.static('views'),
  express.static('views/js'),
  express.static('views/css'),
  express.static('node_modules/bootstrap/dist/css'),
  express.static('node_modules/bootstrap/dist/js'),
  express.static('node_modules/jquery/dist'),
  express.static('node_modules/socket.io-client/dist'),
  express.static('images')
]);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  key: 'session_id',
  secret: 'abcxyz',
  cookie: {
    expires: 60*60*24*7
  },
  resave: true,
  saveUninitialized: true
}));


/** utilisateur connecte */
var user = {};
var allUser = [];

/** verifier la connexion d'un utilisateur */

var isConnected = (req, res, next) => {
  if (req.session.user && req.cookies.session_id) {
    return next();
  } else res.sendFile(path.join(__dirname, 'views/connection.html'));
};

/** traitement des routes/requete utilisateurs */

app.route('/')
  .get(isConnected, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/welcome.html'));
  })
  .post((req, res) => {
    db.query('SELECT * FROM utilisateur WHERE TEL = \'' + req.body.TEL + '\' AND PSSWD = \'' + req.body.PSSWD + '\' AND CONNECT = 0 LIMIT 1', (error, result) => {
      if (error)
        throw error;
      if (result.length != 0) {
        db.query('UPDATE utilisateur SET CONNECT = 1 WHERE TEL = \'' + req.body.TEL + '\'');
        user = {
          pseudo: result[0].PSEUDO,
          tel: result[0].TEL
        };
        req.session.user = user;
        res.cookie('pseudo', user.pseudo);
        res.cookie('tel', user.tel);
        res.setHeader('sign-in', 'succes');
        res.sendFile(path.join(__dirname, 'views/welcome.html'));
      } else {
        res.setHeader('sign-in', 'failed');
        res.sendFile(path.join(__dirname, 'views/connection.html'));
      }
    });
  });

app.route('/signIn')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'views/signIn.html'));
  })
  .post((req, res) => {
    db.query('INSERT INTO utilisateur(TEL, PSEUDO, PSSWD, CONNECT, DATE) VALUES(\'' + req.body.TEL + '\', \'' + req.body.PSEUDO + '\', \'' + req.body.PSSWD + '\', 1, CURRENT_DATE())', (error) => {
      if (error) {
        res.setHeader('sign-in-error', error.errno);
        res.sendFile(path.join(__dirname, 'views/signIn.html'));
        return;
      }
      user = {
        pseudo: req.body.PSEUDO,
        tel: req.body.TEL
      };
      req.session.user = user;
      res.cookie('pseudo', encodeURIComponent(user.pseudo));
      res.cookie('tel', encodeURIComponent(user.tel));
      res.sendFile(path.join(__dirname, 'views/welcome.html'));
    });
  });

app.route('/groupe')
  .get(isConnected, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/groupe.html'));
  })
  .post((req, res) => {
    db.query('INSERT INTO groupe(TEL, NOM, DATE) VALUES(\'' + req.body.TEL + '\', \'' + req.body.NAME + '\', CURRENT_DATE())', (error) => {
      res.sendFile(path.join(__dirname, 'views/welcome.html'));
    });
  });

app.get('/connected', (req, res) => {
  db.query('SELECT DISTINCT PSEUDO, TEL, CONNECT FROM utilisateur ORDER BY PSEUDO', (error, result) => {
    if (error)
      throw error;
    res.send(JSON.stringify(result));
  });
})
  .get('/groupe', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/groupe.html'));
  })
  .get('/quit', (req, res)=>{
    db.query('UPDATE utilisateur SET CONNECT = 0 WHERE TEL = \'' + req.session.user.tel + '\'');
    req.session.user = undefined;
    res.redirect('/');
  })
  .get('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'views/404.html'));
  });

/** socket de connexion avec le client */
var Connected = function (tel, login) {
  this.LOGIN = login;
  this.TEL = tel;
};
io.on('connection', (client) => {
  var inComme = new Connected(user.tel, user.pseudo);
  client.emit('welcome', inComme);
  allUser.push({
    USER: inComme,
    SOCKET: client
  });
  io.emit('user connect');
});

/** ecout sur 192.168.173.1:1111 */
server.listen(1111);