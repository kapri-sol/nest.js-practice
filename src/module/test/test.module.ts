import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TestService } from './test.service';

export type TestType = 'sqlite' | 'pg-mem' | 'mysql' | 'postgres';
export type TestConfig = {
  type: TestType;
  entities: EntityClassOrSchema[];
};

@Module({})
export class TestModule {
  static register(config: TestConfig): DynamicModule {
    return {
      module: TestModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.development',
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: config.entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature(config.entities),
      ],
      providers: [TestService],
      exports: [TypeOrmModule, TestService],
    };
  }
}
