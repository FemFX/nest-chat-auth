import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get()
  async getAll() {
    return this.chatService.allChats();
  }
  // @UseGuards(AuthGuard)
  @Get(':receiverId')
  async getChat(@Req() req, @Param('receiverId') receiverId) {
    const refreshToken: string = req.cookies.jid;
    console.log(req.cookies);

    const userId = await this.cache.get(refreshToken);

    return this.chatService.getChat(+userId, +receiverId);
  }
}
