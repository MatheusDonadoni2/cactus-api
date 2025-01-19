import {
  ColumnDefinitions,
  MigrationBuilder,
  PgLiteral,
} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('legal_person', {
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
    cnpj: {
      type: 'varchar(14)',
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
  pgm.createConstraint('users', 'fk_person_legal_person', {
    foreignKeys: { references: 'persons', columns: 'person_id' },
  });

  pgm.createTrigger('legal_person', 'set_updated_at', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'update_updated_at',
    level: 'ROW',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('legal_person');
  pgm.dropConstraint('legal_person', 'fk_person_legal_person');
  pgm.dropTrigger('legal_person', 'set_updated_at');
}
