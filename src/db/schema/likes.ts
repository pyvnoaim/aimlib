import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

import { users } from './users';

export const likes = mysqlTable(
  'likes',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resourceType: mysqlEnum('resource_type', [
      'playlist',
      'theme',
      'sound',
      'crosshair',
      'valorant',
    ]).notNull(),
    resourceId: varchar('resource_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
  },
  (table) => ({
    uniqueUserLike: uniqueIndex('unique_like').on(
      table.userId,
      table.resourceType,
      table.resourceId
    ),
  })
);
