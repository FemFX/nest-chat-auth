import { Chat } from 'src/chat/chat.entity';
import { Message } from 'src/chat/message.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
  @ManyToMany(() => Chat, (chat) => chat.users)
  @JoinTable()
  chats: Chat[];
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
