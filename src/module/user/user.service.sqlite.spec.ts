import { TestService } from '../test/test.service';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../test/test.module';
import { User } from 'src/entity/user.entity';

describe('UserService : splite3', () => {
  let userService: UserService;
  let testService: TestService;
  const userTestData = Array.from({ length: 3 }).map(() => ({
    userId: faker.internet.userName(),
    password: faker.internet.password(),
    name: faker.name.findName(),
    phoneNumber: faker.phone.number(),
    emailAddress: faker.internet.email(),
  }));
  beforeAll(async () => {
    const user: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule.register({
          type: 'sqlite',
          entities: [User],
        }),
      ],
      providers: [UserService, TestService],
    }).compile();
    userService = user.get<UserService>(UserService);
    testService = user.get<TestService>(TestService);
    await testService.preInsert(User, userTestData);
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
