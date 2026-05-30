import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;

let client: MongoClient;
let db: Db;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  const redacted = uri.replace(/:([^@]+)@/, ":<redacted>@");
  console.log("[mongodb] connecting to:", redacted);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri);
      await global._mongoClient.connect();
    }
    client = global._mongoClient;
  } else {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db();
  return db;
}
