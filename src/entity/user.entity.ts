import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { primaryTransformer } from './common';

@Entity()
export class User {
  @Generated('increment')
  @PrimaryColumn({
    type: 'bigint',
    transformer: primaryTransformer,
  })
  userUid: bigint;

  @Column({
    unique: true,
  })
  userId: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  emailAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, +process.env.SALT_OR_ROUNT);
    }
  }

  validatePassword(password): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
