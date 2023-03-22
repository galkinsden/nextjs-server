const express = require('express');
const http = require('http');
const vhost = require('vhost');
const app = express();

const config = {
  port: 3000,
  initialDomainsList: [{ domain: 'first.localhost', folder: '/first' }, { domain: 'second.localhost', folder: '/second' }],
};

config.initialDomainsList.forEach(({ domain, folder }) => {
  app.use(vhost(domain, express.static(__dirname + folder)));
});

http.createServer({}, app).listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
})