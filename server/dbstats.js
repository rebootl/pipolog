import express from 'express';
import { performance } from 'perf_hooks';

async function measureRequestTime(db) {
  const t0 = performance.now();
  const c = await db.collection('logdata');
  const r = await c.find({}).sort({ agent_timestamp: 1 })
    .limit(50).toArray();
  const t1 = performance.now();
  return t1-t0;
}

export async function collectStats(db) {
  // database stats
  const r = await db.stats({ scale: 1024 * 1024 });

  // server status
  const a = await db.admin();
  const s = await a.serverStatus();

  // measure request time
  const rtime = await measureRequestTime(db);

  const c = db.collection('dbstats');
  const res = await c.insertOne({
    timestamp: new Date(),
    objects: r.objects,
    dataSize: r.dataSize,
    storageSize: r.storageSize,
    perf: s.wiredTiger.perf,
    tcmalloc: s.tcmalloc,
    requestTime: rtime
  });
}

const router = express.Router();

router.get('/', async (req, res) => {
  // check login
  if (!req.session.loggedIn) {
    console.log('unallowed request rejected');
    return res.sendStatus(401);
  }
  const db = req.app.locals.db;
  //const c = await db.collection('logdata');

  const r = await db.stats({ scale: 1024 * 1024 });
  res.send({ success: true, result: r });
});

router.get('/collected', async (req, res) => {
  // check login
  if (!req.session.loggedIn) {
    console.log('unallowed request rejected');
    return res.sendStatus(401);
  }
  const db = req.app.locals.db;
  const c = await db.collection('dbstats');

  const r = await c.find().sort({ timestamp: 1 }).toArray();
  res.send({ success: true, result: r });
});

export default router;
