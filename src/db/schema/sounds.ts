import { mysqlTable, varchar, timestamp, bigint } from 'drizzle-orm/mysql-core';

export const sounds = mysqlTable('sounds', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  submittedBy: varchar('submittedBy', { length: 255 }).notNull(),
  twitterHandle: varchar('twitterHandle', { length: 255 }),
  filePath: varchar('filePath', { length: 255 }).unique().notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
