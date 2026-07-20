const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function startServer() {
  await client.connect();
  console.log('Connected to MongoDB at', uri);
  db = client.db(process.env.MONGODB_DB || 'parkhr');

  const app = express();
  app.use(cors());
  // Allow larger JSON payloads (base64 images) - configurable via env
  const bodyLimit = process.env.BODY_LIMIT || '10mb';
  app.use(express.json({ limit: bodyLimit }));

  // Health
  app.get('/health', (req, res) => res.json({ ok: true }));

  // Signup endpoint: expects JSON body with signup fields
  app.post('/users', async (req, res) => {
    try {
      const payload = req.body || {};
      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({ error: 'Empty payload' });
      }

      // Normalize name fields: combine firstName + lastName into fullName and name
      const firstName = payload.firstName || payload.givenName || null;
      const lastName = payload.lastName || payload.familyName || null;
      if (firstName || lastName) {
        const full = [firstName, lastName].filter(Boolean).join(' ').trim();
        if (full) {
          payload.fullName = full;
          // keep legacy `name` property for compatibility
          payload.name = payload.name || full;
        }
      }

      const col = db.collection('users');
      // reject duplicate email
      if (payload.email) {
        const existing = await col.findOne({ email: payload.email });
        if (existing) {
          return res.status(409).json({ error: 'Email already in use' });
        }
      }

      const insert = await col.insertOne({ ...payload, createdAt: new Date() });
      return res.json({ insertedId: insert.insertedId });
    } catch (err) {
      console.error('Error in /signup:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/users/login', async (req, res) => {
    try {
      const { identifier, password } = req.body || {};

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Identifier and password are required' });
      }

      const col = db.collection('users');

      const user = await col.findOne({
        $and: [
          { $or: [{ email: identifier }, { username: identifier }] },
          { password },
        ],
      });

      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const { password: _pw, ...safe } = user;
      return res.json({ message: 'Login successful', user: safe });
    } catch (err) {
      console.error('Error in /users/login:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Error handler for JSON parse / payload too large
  app.use((err, req, res, next) => {
    if (!err) return next();
    // body-parser sets status 413 and err.type === 'entity.too.large'
    if (err.type === 'entity.too.large' || err.status === 413) {
      return res.status(413).json({ error: 'Payload too large' });
    }
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = { startServer, client };
