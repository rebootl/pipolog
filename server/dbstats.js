import express from 'express';

export async function collectStats(db) {
  const r = await db.stats({ scale: 1024 * 1024 });

  const c = db.collection('dbstats');
  const res = await c.insertOne({
    timestamp: new Date(),
    objects: r.objects,
    dataSize: r.dataSize,
    storageSize: r.storageSize,
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

  const r = await c.find().sort({ timestamp: -1 }).toArray();
  res.send({ success: true, result: r });
});

export default router;
