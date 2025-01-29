import {
  ColumnDefinitions,
  MigrationBuilder,
  PgLiteral,
} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    person_id: {
      type: 'uuid',
      primaryKey: true,
      unique: true,
      notNull: true,
    },
    username: {
      type: 'varchar(50)',
      notNull: true,
    },
    password: {
      type: 'varchar(250)',
      notNull: true,
    },
    updated_at: {
      type: 'timestamp',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: new PgLiteral('current_timestamp'),
    },
  });

  pgm.createConstraint('users', 'fk_person_user', {
    foreignKeys: { references: 'persons', columns: 'person_id' },
  });

  pgm.createTrigger('users', 'set_updated_at', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'update_updated_at',
    level: 'ROW',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
  pgm.dropConstraint('users', 'fk_person_user');
  pgm.dropTrigger('users', 'set_updated_at');
}
