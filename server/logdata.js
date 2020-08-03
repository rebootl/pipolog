import express from 'express';

import { checkBasicAuth } from './auth.js';
import * as config from './config.js';

const requiredFields = [
  'name',
  'host',
  'agent_timestamp'
];

const router = express.Router();

router.post('/agent', async (req, res) => {
  const db = req.app.locals.db;
  //console.log(req)
  // check api key
  if (!checkBasicAuth(req.headers.authorization, config.API_KEY))
    return res.sendStatus(401);
  // get payload
  //console.log(req.body)
  // insert into db
  for (const f of requiredFields) {
    if (!req.body.hasOwnProperty(f)) return res.sendStatus(400);
  }
  const c = await db.collection('logdata');
  const r = await c.insertOne({
    ...req.body,
    agent_timestamp: new Date(req.body.agent_timestamp)
  });
  //console.log(r)
  res.sendStatus(200);
});

function getAnyDateQuery(host, stream) {
  if (host && stream) return { host: host, name: stream };
  else if (host) return { host: host };
  else if (stream) return { name: stream };
  return {};
}

function getRelativeDateQuery(host, stream, from) {
  if (host && stream) return { $and: [
    { agent_timestamp: { $gt: from }},
    { host: host },
    { name: stream }
  ]};
  else if (host) return { $and: [
    { agent_timestamp: { $gt: from }},
    { host: host }
  ]};
  else if (stream) return { $and: [
    { agent_timestamp: { $gt: from }},
    { name: stream }
  ]};
  return { agent_timestamp: { $gt: from }};
}

function getAbsoluteDateQuery(host, stream, from, to) {
  if (host && stream) return { $and: [
    { agent_timestamp: { $gt: from, $lt: to }},
    { host: host },
    { name: stream }
  ]};
  else if (host) return { $and: [
    { agent_timestamp: { $gt: from, $lt: to }},
    { host: host }
  ]};
  else if (stream) return { $and: [
    { agent_timestamp: { $gt: from, $lt: to }},
    { name: stream }
  ]};
  return { agent_timestamp: { $gt: from, $lt: to }};
}

router.get('/', async (req, res) => {
  // check login
  if (!req.user) {
    console.log('unallowed request rejected');
    return res.sendStatus(401);
  }
  const db = req.app.locals.db;
  const c = await db.collection('logdata');

  // max limit
  const limit = 20;
  const skip = parseInt(req.query.skip) || 0;
  const host = req.query.host;
  const stream = req.query.stream;
  const reverse = req.query.reverse === 'true' ? -1 : 1;

  const from = new Date(req.query.from);
  let validFrom = true;
  if (isNaN(from.getDate())) validFrom = false;

  const to = new Date(req.query.to);
  let validTo = true;
  if (isNaN(to.getDate())) validTo = false;

  let q = {};
  if (!validFrom && !validTo) {
    q = getAnyDateQuery(host, stream);
  } else if (validFrom && !validTo) {
    q = getRelativeDateQuery(host, stream, from);
  } else if (validFrom && validTo) {
    q = getAbsoluteDateQuery(host, stream, from, to);
  }

  const r = await c.find(q).sort({ agent_timestamp: reverse })
    .skip(skip).limit(limit).toArray();
  if (!r) return res.sendStatus(404);
    return res.send({ success: true, result: r });
});

router.get('/hosts', async (req, res) => {
  if (!req.user) {
    console.log('unallowed request rejected');
    return res.sendStatus(401);
  }
  const db = req.app.locals.db;
  const c = await db.collection('logdata');
  const r = await c.distinct('host');
  return res.send({ success: true, result: r.sort() });
});

router.get('/streams', async (req, res) => {
  if (!req.user) {
    console.log('unallowed request rejected');
    return res.sendStatus(401);
  }
  const db = req.app.locals.db;
  const c = await db.collection('logdata');
  const r = await c.distinct('name');
  return res.send({ success: true, result: r.sort() });
});

export default router;
