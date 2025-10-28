'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect; // (FCC lo usa en su runner)
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); // Para FCC testing

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Página index (HTML estático)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// Rutas de testing de FCC
fccTestingRoutes(app);

// Ruteo del API
apiRoutes(app);

// Middleware 404
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

// Start del server y ejecución de tests si corresponde
const server = app.listen(port, function () {
  console.log('Listening on port ' + port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 1500);
  }
});

// Export para pruebas (chai-http usa este export)
module.exports = app;

