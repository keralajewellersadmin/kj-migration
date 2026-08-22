import * as migration_20260822_add_rate_columns from './20260822_add_rate_columns';

export const migrations = [
  {
    up: migration_20260822_add_rate_columns.up,
    down: migration_20260822_add_rate_columns.down,
    name: '20260822_add_rate_columns'
  },
];
