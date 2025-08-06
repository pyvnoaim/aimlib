import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  bigint,
} from 'drizzle-orm/mysql-core';

export const benchmarks = mysqlTable('benchmarks', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  twitterHandle: varchar('twitterHandle', { length: 255 }).notNull(),
  aimtrainer: mysqlEnum('aimtrainer', ["KovaaK's", 'Aimlabs']).notNull(),
  shareCode: varchar('shareCode', { length: 255 }).unique(),
  benchmarkLink: varchar('benchmarkLink', { length: 2048 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
