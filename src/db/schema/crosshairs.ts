import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

import { users } from './users';

export const crosshairs = mysqlTable('crosshairs', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  authorId: varchar('author_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  imagePath: varchar('image_path', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
});
