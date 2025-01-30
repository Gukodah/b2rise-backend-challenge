import { DataSource } from "typeorm";

export async function resetSQLiteSequence(
  datasourceConnection: DataSource,
  tableName: string,
): Promise<void> {
  await datasourceConnection.query(
    `DELETE FROM sqlite_sequence WHERE name = ?`,
    [tableName],
  );
}
