import {
  ColumnDefinitions,
  MigrationBuilder,
  PgLiteral,
} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('natural_person', {
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
    cpf: {
      type: 'varchar(11)',
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
  pgm.createConstraint('users', 'fk_person_natural_person', {
    foreignKeys: { references: 'persons', columns: 'person_id' },
  });

  pgm.createTrigger('natural_person', 'set_updated_at', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'update_updated_at',
    level: 'ROW',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('natural_person');
  pgm.dropConstraint('natural_person', 'fk_person_natural_person');
  pgm.dropTrigger('natural_person', 'set_updated_at');
}
