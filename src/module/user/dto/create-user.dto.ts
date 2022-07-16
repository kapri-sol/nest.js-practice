import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class CreateUserDto extends PickType(User, ['userId', 'password', 'name', 'phoneNumber', 'emailAddress']) {}
