import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createFunction(
    'update_updated_at',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
    },
    `    
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
    `,
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropFunction('update_updated_at', [], {});
}
