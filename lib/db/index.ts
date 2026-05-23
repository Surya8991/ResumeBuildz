import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let _db: NeonHttpDatabase<typeof schema> | undefined;

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    if (!_db) {
      const url = process.env.DATABASE_URL;
      if (!url) throw new Error('DATABASE_URL is not set');
      _db = drizzle(neon(url), { schema });
    }
    return Reflect.get(_db, prop, receiver);
  },
});
