import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

describe('UserService : pg-mem', () => {
  let userService: UserService;

  const userTestData = Array.from({ length: 3 }).map(() => ({
    userId: faker.internet.userName(),
    password: faker.internet.password(),
    name: faker.name.findName(),
    phoneNumber: faker.phone.number(),
    emailAddress: faker.internet.email(),
  }));

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

  describe('createUser', () => {
    it('should be return user', async () => {
      const userData = {
        userId: faker.internet.userName(),
        password: faker.internet.password(),
        name: faker.name.findName(),
        phoneNumber: faker.phone.number(),
        emailAddress: faker.internet.email(),
      };

      const user = await userService.createUser(userData);

      expect(user).toMatchObject({
        ...userData,
        userUid: expect.any(BigInt),
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findUserByUid', () => {
    it('shoud be return user', async () => {
      const user = await userService.findUserByUid(BigInt(2));
      console.log(user);
      console.log(userTestData[1]);
      expect(user).toMatchObject(userTestData[1]);
    });
  });
});
