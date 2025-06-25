import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const playlists = mysqlTable('playlists', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  twitterHandle: varchar('twitter_handle', { length: 255 }).notNull(),
  aimtrainer: mysqlEnum('aimtrainer', ["KovaaK's", 'Aimlabs']).notNull(),
  shareCode: varchar('share_code', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
