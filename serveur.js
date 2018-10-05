/* eslint-disable */
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
var path = require('path');
var express = require('express');
var app = express();
app.use('/static', express.static('assets/js'));
app.use('/static', express.static('node_modules/bootstrap/dist/css'));
app.use('/static', express.static('node_modules/bootstrap/dist/js'));
app.use('/static', express.static('node_modules/jquery/dist'));

function connector() {
    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "agenda"
    });
    return connection;
}

var db = connector();
var chaine = '';

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'assets/connexion.html'));
}).get('/site', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'assets/welcome.html'));
}).get('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, 'assets/404.html'));
});

app.listen(8080);