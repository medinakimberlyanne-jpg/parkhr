import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'parkhr';

let cachedClient: MongoClient | null = null;
let cachedDb: Awaited<ReturnType<MongoClient['db']>> | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
