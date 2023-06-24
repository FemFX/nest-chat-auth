import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Column,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
