import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  int,
} from 'drizzle-orm/mysql-core';
import { users } from './users';

export const resources = mysqlTable('resources', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull().unique(),
  type: mysqlEnum('type', [
    'Crosshair',
    'Sound',
    'Theme',
    'Playlist',
  ]).notNull(),
  submittedBy: varchar('submittedBy', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  likes: int('likes').default(0),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default(
    'pending'
  ),
});
