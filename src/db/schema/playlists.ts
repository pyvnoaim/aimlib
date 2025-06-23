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
  aimtrainer: mysqlEnum('aimtrainer', ["KovaaK's", 'Aimlabs']),
  shareCode: varchar('share_code', { length: 255 }),
  link: varchar('link', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
});
