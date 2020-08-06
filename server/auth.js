import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as config from './config.js';

const router = express.Router();

const refreshTokens = [];
const refreshTokenSecret = 'mysupersecret2blablatoot';

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) return res.sendStatus(401);
  if (username !== config.USER.name) return res.sendStatus(401);
  bcrypt.compare(password, config.USER.pwhash).then((check) => {
    if (check) {
      console.log("login ok");
      req.session.loggedIn = true;
      req.session.username = username;
      res
        /*.cookie('_pipolog_refreshtoken', createRefreshToken(), {
          // Secure: true,
          HttpOnly: true,
          sameSite: 'Strict'
        })
        .cookie('_pipolog_token', createToken(), {
          // Secure: true,
          HttpOnly: true,
          sameSite: 'Strict'
        })*/
        .send({
          success: true,
          //token: createToken()
      });
    } else {
      console.log("login failed");
      res.sendStatus(401);
    }
  });
});

router.get('/logout', (req, res) => {
  console.log(req.session)
  if (!req.session.loggedIn) {
    console.log('not logged in');
    return res.sendStatus(401);
  }
  req.session.destroy((err) => {
    if (err) {
      console.log('error destroying session: ', err);
      return res.sendStatus(500);
    }
    res.clearCookie('connect.sid', {
      httpOnly: true,
      sameSite: true
    }).send({ success: true });
    console.log('session destroyed');
  })
});

export default router;

// login / jwt stuff

function createToken() {
  // sign with default (HMAC SHA256)
  //let expirationDate =  Math.floor(Date.now() / 1000) + 30 //30 seconds from now
  return jwt.sign(
    { user: config.USER.name },
    config.SECRET,
    { expiresIn: 60 }
  );
}

function createRefreshToken() {
  return jwt.sign(
    { user: config.USER.name },
    config.SECRET
  );
}
