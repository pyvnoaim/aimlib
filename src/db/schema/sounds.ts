import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

import { users } from './users';

export const sounds = mysqlTable('sounds', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  authorId: varchar('author_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  soundPath: varchar('sound_path', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
});
