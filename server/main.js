import express from 'express';
//import expressJwt from 'express-jwt';
import session from 'express-session';
//import cors from 'cors';

import auth from './auth.js';
import logdata from './logdata.js';

import getDb from './db.js';
import * as config from './config.js';

const app = express();

app.use(session({
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    //maxAge: 1000 * 3600 * 24 * 365 * 5,
    httpOnly: true,
    sameSite: true,
    //secure: true
  }
}))

// static files (client)
app.use('/', express.static(config.STATICDIR,));
//app.use(cors({
//  origin: function(origin, callback){callback(null, true)},
//  credentials: true
//}))
app.use(express.json({limit: '32kb'}));
/*app.use(expressJwt({
  secret: config.SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
}), (err, req, res, next) => {
  //console.log(err)
  if (err.code === 'invalid_token') return next();
  return next(err);
});*/

async function main() {
  const db = await getDb();
  app.locals.db = db;

  app.use('/api/auth', auth);
  app.use('/api/logdata', logdata);

  app.listen(config.PORT);
}
main();
