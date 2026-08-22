import * as migration_20260822_210250 from './20260822_210250';

export const migrations = [
  {
    up: migration_20260822_210250.up,
    down: migration_20260822_210250.down,
    name: '20260822_210250'
  },
];
