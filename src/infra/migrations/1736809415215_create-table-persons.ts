import {
  ColumnDefinitions,
  MigrationBuilder,
  PgLiteral,
} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('persons', {
    id: {
      type: 'uuid',
      primaryKey: true,
      unique: true,
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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('persons');
}
