import {
  mysqlTable,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

import { users } from './users';

export const likes = mysqlTable(
  'likes',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resourceType: varchar('resourceType', { length: 50 }).notNull(),
    resourceId: varchar('resourceId', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  },
  (table) => ({
    uniqueUserLike: uniqueIndex('uniqueLike').on(
      table.userId,
      table.resourceType,
      table.resourceId
    ),
  })
);
