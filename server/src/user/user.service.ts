import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getAll() {
    return await this.userRepository.find({ relations: ['chats'] });
  }
  async getById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['chats'],
    });
    return user;
  }
}
