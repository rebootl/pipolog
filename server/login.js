import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as config from './config.js';

const router = express.Router();

router.post('/', (req, res) => {
  if (req.body.username !== config.USER.name) {
    res.sendStatus(401);
    return;
  }
  bcrypt.compare(req.body.password, config.USER.pwhash).then((check) => {
    if (check) {
      console.log("login ok");
      res.send({
        success: true,
        token: createToken()
      });
    } else {
      console.log("login failed");
      res.sendStatus(401);
    }
  });
});

export default router;

// login / jwt stuff

function createToken() {
  // sign with default (HMAC SHA256)
  //let expirationDate =  Math.floor(Date.now() / 1000) + 30 //30 seconds from now
  var token = jwt.sign({ user: config.USER.name }, config.SECRET);
  return token;
}
