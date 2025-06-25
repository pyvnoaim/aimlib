import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const playlists = mysqlTable('playlists', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  aimtrainer: varchar('aimtrainer', { length: 20 }).notNull(),
  shareCode: varchar('share_code', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
});
