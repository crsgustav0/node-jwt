const express = require('express');
const app = express();
const bodyParser = require('body-parser');

/*Importa modelo de estratégias de autenticação 
via objeto*/
const { estrategiasAuth } = require('./src/usuarios')
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

module.exports = app;