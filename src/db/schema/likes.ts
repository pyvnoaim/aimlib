import {
  varchar,
  timestamp,
  mysqlTable,
  primaryKey,
} from 'drizzle-orm/mysql-core';
import { users } from './users';
import { crosshairs } from './crosshairs';
import { themes } from './themes';
import { sounds } from './sounds';

export const likes = mysqlTable(
  'likes',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    resourceType: varchar('resourceType', { length: 255 }).notNull(),
    resourceId: varchar('resourceId', { length: 255 })
      .notNull()
      .references(() => crosshairs.id, { onDelete: 'cascade' })
      .references(() => themes.id, { onDelete: 'cascade' })
      .references(() => sounds.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  },
  (like) => ({
    compoundKey: primaryKey(like.userId, like.resourceType, like.resourceId),
  })
);
