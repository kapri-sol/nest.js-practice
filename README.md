# nest.js-practice

nest.js practice

## Nest Js 테스트 설정

### package.json

```json
{
  "jest": {
    "moduleDirectories": ["node_modules", "src"],
    "moduleFileExtensions": ["js", "json", "ts"],
    "roots": ["src"],
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "src/(.*)": "<rootDir>/src/$1"
    }
  }
}
```

### Typeorm Module

```typescript
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
      exports: [TypeOrmModule],
    };
  }
}
```

### sqlite

```typescript
describe('UserService : splite3', () => {
  let userService: UserService;

  beforeAll(async () => {
    const user: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule.register({
          type: 'sqlite',
          entities: [User],
        }),
      ],
      providers: [UserService],
    }).compile();
    userService = user.get < UserService > UserService;
  });
});
```

### pg-mem

```typescript
describe('UserService : pg-mem', () => {
  let userService: UserService;

  beforeAll(async () => {
    const db = newDb();

    db.public.registerFunction({
      name: 'current_database',
      implementation: () => 'test',
    });

    const datasource = db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User],
      database: 'test',
      synchronize: true,
    });

    await datasource.initialize();

    const user: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([User])],
      providers: [UserService],
    })
      .overrideProvider(DataSource)
      .useValue(datasource)
      .compile();

    userService = user.get<UserService>(UserService);
  });
});
```
