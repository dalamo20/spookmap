import * as functions from 'firebase-functions';
import next from 'next';
import { Request, Response } from 'express'; 

const app = next({
  dev: false,
  conf: { distDir: '.next' },
});

const handle = app.getRequestHandler();

exports.nextApp = functions.https.onRequest((req: Request, res: Response) => {
  return app.prepare().then(() => handle(req, res));
});
