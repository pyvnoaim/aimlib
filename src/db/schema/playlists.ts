import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  boolean,
} from 'drizzle-orm/mysql-core';

export const playlists = mysqlTable('playlists', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  twitterHandle: varchar('twitterHandle', { length: 255 }).notNull(),
  aimtrainer: mysqlEnum('aimtrainer', ["KovaaK's", 'Aimlabs']).notNull(),
  shareCode: varchar('shareCode', { length: 255 }).unique(),
  isBenchmark: boolean('isBenchmark').default(false).notNull(),
  benchmarkLink: varchar('benchmarkLink', { length: 2048 }),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
