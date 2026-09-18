import * as migration_20260918_104300 from './20260918_104300'

export const migrations = [
  {
    up: migration_20260918_104300.up,
    down: migration_20260918_104300.down,
    name: '20260918_104300',
  },
]
