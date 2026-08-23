import * as migration_20260822_add_category_image from './20260822_add_category_image';
import * as migration_20260822_add_rate_columns from './20260822_add_rate_columns';
import * as migration_20260823_192410_issues_2_3_4_permanent from './20260823_192410_issues_2_3_4_permanent';

export const migrations = [
  {
    up: migration_20260822_add_category_image.up,
    down: migration_20260822_add_category_image.down,
    name: '20260822_add_category_image',
  },
  {
    up: migration_20260822_add_rate_columns.up,
    down: migration_20260822_add_rate_columns.down,
    name: '20260822_add_rate_columns',
  },
  {
    up: migration_20260823_192410_issues_2_3_4_permanent.up,
    down: migration_20260823_192410_issues_2_3_4_permanent.down,
    name: '20260823_192410_issues_2_3_4_permanent'
  },
];
