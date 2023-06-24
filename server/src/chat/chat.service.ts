import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}
  async allChats() {
    return await this.chatRepository.find({
      relations: ['users', 'messages'],
    });
  }
  async byId(id: number): Promise<Chat> {
    return await this.chatRepository.findOne({
      where: { id },
      relations: ['users', 'messages'],
    });
  }
  async chatByUsers(userId: number, receiverId: number) {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'user1', 'user1.id = :userId1', {
        userId1: userId,
      })
      .innerJoin('chat.users', 'user2', 'user2.id = :userId2', {
        userId2: receiverId,
      })
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'messageUser')
      .getOne();
    return chat;
  }
  //refactoring
  async getChat(userId: number, receiverId: number) {
    const chat = await this.chatByUsers(userId, receiverId);
    if (!chat) {
      const user = await this.userService.getById(userId);
      const receiver = await this.userService.getById(receiverId);
      const newChat = await this.chatRepository.create();
      await this.chatRepository.save(newChat);
      //   newChat.users = [user, receiver];
      //   await this.chatRepository.save(newChat);

      user.chats.push(newChat);
      receiver.chats.push(newChat);
      await this.userRepository.save(user);
      await this.userRepository.save(receiver);
      //   return newChat;
      return await this.chatRepository.findOne({
        where: { id: newChat.id },
        relations: ['users', 'messages'],
      });
    }
    return chat;
  }

  async msgToServer(userId: number, dto: MessageDto) {
    const { receiverId, text } = dto;
    const chat = await this.chatByUsers(userId, +receiverId);
    const user = await this.userService.getById(userId);
    const message = await this.messageRepository
      .create({
        text,
        chat,
        user,
      })
      .save();
    return { message, chatId: chat.id };
  }
}
