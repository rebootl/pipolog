import express from 'express';
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);
//import expressJwt from 'express-jwt';
//import cors from 'cors';

import auth from './auth.js';
import logdata from './logdata.js';
import dbstats from './dbstats.js';
import { collectStats } from './dbstats.js';
import { client } from './db.js';

import getDb from './db.js';
import * as config from './config.js';

const app = express();

// static files (client)
app.use('/', express.static(config.STATICDIR,));

app.use(express.json({limit: '32kb'}));
app.use(session({
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    //maxAge: 1000 * 3600 * 24 * 365 * 5,
    HttpOnly: true,
    sameSite: true,
    secure: config.PRODUCTION
  },
  store: new MongoStore({
    client: client,
    touchAfter: 24 * 3600,
    dbName: config.DBNAME,
    collection: 'sessions'
  })
}));
// JWT
/*app.use(expressJwt({
  secret: config.SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
}), (err, req, res, next) => {
  //console.log(err)
  if (err.code === 'invalid_token') return next();
  return next(err);
});*/
// CORS
/*app.use(cors({
  origin: function(origin, callback){callback(null, true)},
  credentials: true
}))*/

async function main() {
  const db = await getDb();
  app.locals.db = db;

  // set mongodb indexes for query performance
  const l = await db.collection('logdata');
  l.createIndexes([{ key: {
    agent_timestamp: 1,
    host: 1,
    name: 1
  }}]);

  // collect database stats hourly
  setInterval(() => collectStats(db), 1000 * 60 * 60);

  app.use('/api/auth', auth);
  app.use('/api/logdata', logdata);
  app.use('/api/dbstats', dbstats);

  app.listen(config.PORT);
  console.log("Listening on port: " + config.PORT);
}
main();
