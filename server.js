const express = require('express');

const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const api = require('./src/api');
const errorHandler = require('./src/services/error-handler');
const jwt = require('./src/services/jwt');

app.get('/', (request, response) => response.sendStatus(200));
app.get('/health', (request, response) => response.sendStatus(200));

app.use(cors());
app.use(morgan('short'));
app.use(express.json());
app.use(helmet());

app.use(jwt());
app.use(api);
app.use(errorHandler);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  },
  app() {
    return app;
  }
};
