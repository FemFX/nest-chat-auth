import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WSAuthGuard } from './chat.guard';
import { ISocket } from 'src/interfaces/socket.interface';
import { MessageDto } from './dto/message.dto';

@UseGuards(WSAuthGuard)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: ISocket) {
    this.logger.log(`User ${client.id} connected`);
  }
  handleDisconnect(client: ISocket) {
    this.logger.log(`User ${client.id} disconnected`);
  }
  @SubscribeMessage('get_chats')
  async all() {
    return this.chatService.allChats();
  }
  @SubscribeMessage('get_chat')
  async getChat(
    @ConnectedSocket() client: ISocket,
    @MessageBody('id') receiverId: string | number,
  ) {
    return this.chatService.getChat(client.userId, +receiverId);
  }
  @SubscribeMessage('msg_to_server')
  async handleMessage(
    @ConnectedSocket() client: ISocket,
    @MessageBody() dto: MessageDto,
  ) {
    console.log(dto);

    const { message, chatId } = await this.chatService.msgToServer(
      client.userId,
      dto,
    );
    return this.server.to(String(chatId)).emit('msg_to_client', message);
  }
}
