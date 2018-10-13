/** importation des librairies */
var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  app = express(),
  server = require('http').createServer(app), //creation du serveur
  io = require('socket.io')(server),
  db = require('./db-connector');

/** definition des middlewares */
app.use('/static', [express.static('views'),
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
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  resave: true,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');


/** utilisateur connecte */
var user = {};
var allUser = [];

/** verifier la connexion d'un utilisateur */

var isConnected = (req, res, next) => {
  if (req.session.user && req.cookies.session_id) {
    return next();
  } else res.render('connection');
};

/** traitement des routes/requete utilisateurs */

app.route('/')
  .get(isConnected, (req, res) => {
    res.render('welcome');
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
        res.cookie('pseudo', encodeURIComponent(user.pseudo), {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        res.cookie('tel', encodeURIComponent(user.tel), {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        res.setHeader('sign-in', 'succes');
        res.render('welcome');
      } else {
        res.setHeader('sign-in', 'failed');
        res.render('connection');
      }
    });
  });

app.route('/signIn')
  .get((req, res) => {
    res.render('signIn');
  })
  .post((req, res) => {
    db.query('INSERT INTO utilisateur(TEL, PSEUDO, PSSWD, CONNECT, DATE) VALUES(\'' + req.body.TEL + '\', \'' + req.body.PSEUDO + '\', \'' + req.body.PSSWD + '\', 1, CURRENT_DATE())', (error) => {
      if (error) {
        res.setHeader('sign-in-error', error.errno);
        res.render('signIn');
        return;
      }
      user = {
        pseudo: req.body.PSEUDO,
        tel: req.body.TEL
      };
      req.session.user = user;
      res.cookie('pseudo', encodeURIComponent(user.pseudo), {
        expires: new Date(Date.now() + 60 * 60 * 24)
      });
      res.cookie('tel', encodeURIComponent(user.tel), {
        expires: new Date(Date.now() + 60 * 60 * 24)
      });
      res.render('welcome');
    });
  });

app.route('/groupe')
  .get(isConnected, (req, res) => {
    res.render('groupe');
  })
  .post((req, res) => {
    db.query('INSERT INTO groupe(TEL, NOM, DATE) VALUES(\'' + req.body.TEL + '\', \'' + req.body.NAME + '\', CURRENT_DATE())', (error) => {
      if (error)
        throw error;
      res.render('welcome');
    });
  });

app.get('/connected', (req, res) => {
  db.query('SELECT DISTINCT PSEUDO, TEL, CONNECT FROM utilisateur ORDER BY PSEUDO', (error, result) => {
    if (error)
      throw error;
    res.send(JSON.stringify(result));
  });
})
  .get('/quit', (req, res) => {
    db.query('UPDATE utilisateur SET CONNECT = 0 WHERE TEL = \'' + req.session.user.tel + '\'');
    req.session.user = undefined;
    res.redirect('/');
  })
  .get('*', (req, res) => {
    res.status(404);
    res.render('404');
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

/** ecout sur localhost:1111 */
server.listen(1111);