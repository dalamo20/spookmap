import * as functions from 'firebase-functions';
import express from 'express';
import next from 'next';
import fetch, { Request, Response, Headers } from 'node-fetch';

// Polyfill the Web API objects
global.Request = Request as any;
global.Response = Response as any;
global.Headers = Headers as any;
global.fetch = fetch as any;

const app = next({
  dev: false,
  conf: { distDir: '.next' },
});

const handle = app.getRequestHandler();
const server = express();

// Use Express to handle all requests with the Next.js handler
server.all('*', (req, res) => {
  return app.prepare().then(() => handle(req, res));
});

exports.nextApp = functions.https.onRequest(server);
