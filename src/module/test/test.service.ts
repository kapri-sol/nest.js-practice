import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TestService {
  constructor(private dataSource: DataSource) {}

  preInsert(target: EntityTarget<unknown>, entities: QueryDeepPartialEntity<unknown>[]) {
    const entityManager = this.dataSource.createEntityManager();
    entityManager.insert<unknown>(target, entities);
  }
}
