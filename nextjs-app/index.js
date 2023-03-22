const http = require('http');
const express = require('express');
const next = require('next');
const vhost = require('vhost');

const config = {
  port: 3000,
  initialDomainsList: [{ domain: 'first.localhost', folder: '/first' }, { domain: 'second.localhost', folder: '/second' }],
}

const createVHostApp = (app, domainConfig) => {
  const { domain, folder } = domainConfig;
  const nextApp = next({ dev: false, hostname: domain, port: config.port, dir: `${__dirname}${folder}` });
  return app.use(vhost(domain, nextApp.getRequestHandler()));
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

init()
  .then((app) => createVHostApp(app, { domain: 'third.localhost', folder: '/third' })); // add another nextjs app to vhost
