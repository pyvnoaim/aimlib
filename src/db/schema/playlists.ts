import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  bigint,
} from 'drizzle-orm/mysql-core';

export const playlists = mysqlTable('playlists', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  twitterHandle: varchar('twitterHandle', { length: 255 }).notNull(),
  aimtrainer: mysqlEnum('aimtrainer', ["KovaaK's", 'Aimlabs']).notNull(),
  shareCode: varchar('shareCode', { length: 255 }).unique(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
