import { DataSource, DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";

export class DataSeeder {
  private datasourceConnection: DataSource;

  constructor(datasourceConnection: DataSource) {
    this.datasourceConnection = datasourceConnection;
  }

  async seed<EntityType extends ObjectLiteral>(
    entity: EntityTarget<EntityType>,
    data: Array<DeepPartial<EntityType>>,
  ) {
    await this.datasourceConnection.getRepository(entity).save(data);
  }
}
