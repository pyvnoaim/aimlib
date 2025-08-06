import {
  mysqlTable,
  varchar,
  timestamp,
  uniqueIndex,
  bigint,
} from 'drizzle-orm/mysql-core';
import { users } from './users';

export const likes = mysqlTable(
  'likes',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resourceType: varchar('resourceType', { length: 255 }).notNull(),
    resourceId: bigint('resourceId', { mode: 'number' }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  },
  (table) => ({
    uniqueUserLike: uniqueIndex('uniqueUserLike').on(
      table.userId,
      table.resourceType,
      table.resourceId
    ),
  })
);
