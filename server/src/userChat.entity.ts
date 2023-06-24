import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user/user.entity';
import { Chat } from './chat/chat.entity';

@Entity()
export class UserChat {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'role_id' })
  user: User;
  @ManyToOne(() => Chat, (chat) => chat.id)
  @JoinColumn({ name: 'role_id' })
  chat: Chat;
}
