import express from 'express';
import expressJwt from 'express-jwt';
//import cors from 'cors';

import login from './login.js';
import logdata from './logdata.js';

import getDb from './db.js';
import * as config from './config.js';

const app = express();

// static files (client)
app.use('/', express.static(config.STATICDIR,));
//app.use(cors({
//  origin: function(origin, callback){callback(null, true)},
//  credentials: true
//}))
app.use(express.json({limit: '32kb'}));
app.use(expressJwt({
  secret: config.SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
}));

async function main() {
  const db = await getDb();
  app.locals.db = db;

  app.use('/api/login', login);
  app.use('/api/logdata', logdata);

  app.listen(config.PORT);
}
main();
