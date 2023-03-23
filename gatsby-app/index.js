const http = require('http');
const express = require('express');
const gatsyExpress = require('gatsby-plugin-express');
const vhost = require('vhost');

const config = {
  port: 3000,
  initialDomainsList: [{ domain: 'first.localhost', folder: '/first' }],
}

const createVHostApp = (app, domainConfig) => {
  const { domain, folder } = domainConfig;
  const public = __dirname + folder + '/public/';
  app.use(vhost(domain, express.static(public)));
  app.use(vhost(domain, gatsyExpress(__dirname + folder + '/gatsby-express.json', { publicDir: public, redirectSlashes: true })));
}

const init = async () => {
  const app = express();
  config.initialDomainsList.forEach((domainConfig) => createVHostApp(app, domainConfig));
  http
      .createServer(
        {}, // todo cert, keys, etc
        app,
      )
      .once('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(config.port, () => console.log(`App listening on port ${config.port}`));
  return app;
}

init();