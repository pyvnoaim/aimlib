import {
  varchar,
  timestamp,
  mysqlTable,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { resources } from './resources';

export const likes = mysqlTable(
  'likes',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resourceId: varchar('resourceId', { length: 255 })
      .notNull()
      .references(() => resources.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  },
  (like) => ({
    compoundKey: primaryKey(like.userId, like.resourceId),
  })
);
