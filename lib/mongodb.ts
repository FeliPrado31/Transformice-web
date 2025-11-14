import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "transformice3";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

class MongoDBSingleton {
  private static instance: MongoDBSingleton;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connectionPromise: Promise<MongoClient> | null = null;

  private constructor() {}

  static getInstance(): MongoDBSingleton {
    if (!MongoDBSingleton.instance) {
      MongoDBSingleton.instance = new MongoDBSingleton();
    }
    return MongoDBSingleton.instance;
  }

  async connect(): Promise<MongoClient> {
    if (this.client) {
      return this.client;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = MongoClient.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }

    try {
      this.client = await this.connectionPromise;
      this.db = this.client.db(DB_NAME);
      console.log("MongoDB connected successfully");
      return this.client;
    } catch (e) {
      this.connectionPromise = null;
      console.error("MongoDB connection error:", e);
      throw e;
    }
  }

  async getDb(): Promise<Db> {
    if (this.db) {
      return this.db;
    }
    await this.connect();
    return this.db!;
  }

  getClient(): MongoClient | null {
    return this.client;
  }
}

const mongoInstance = MongoDBSingleton.getInstance();

export async function getDb() {
  return mongoInstance.getDb();
}

export async function getMongoClient() {
  return mongoInstance.connect();
}
