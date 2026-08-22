import * as migration_20260822_add_rate_columns from './20260822_add_rate_columns';
import * as migration_20260822_add_category_image from './20260822_add_category_image';

export const migrations = [
  {
    up: migration_20260822_add_rate_columns.up,
    down: migration_20260822_add_rate_columns.down,
    name: '20260822_add_rate_columns'
  },
  {
    up: migration_20260822_add_category_image.up,
    down: migration_20260822_add_category_image.down,
    name: '20260822_add_category_image'
  },
];
