
'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');

const app = express();
app.use(cors({ origin: '*' }));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Index page
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'views', 'index.html'));
});

// FCC test routes (optional placeholder)
try {
  const fccTestingRoutes  = require('./routes/fcctesting.js');
  fccTestingRoutes(app);
} catch(e) { /* ignore in our sandbox */ }

// API routes
apiRoutes(app);

// 404
app.use((req, res) => res.status(404).type('text').send('Not Found'));

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
} else {
  // In test mode export without listening to allow chai-http to bind
}

module.exports = app;
