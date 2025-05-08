import { varchar, timestamp, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const themes = mysqlTable('themes', {
  id: varchar('resourceId', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date()),
  filePath: varchar('filePath', { length: 255 }).notNull(),
  submittedBy: varchar('submittedBy', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .default('System'),
  status: varchar('status', { length: 255 }).notNull().default('pending'),
});
