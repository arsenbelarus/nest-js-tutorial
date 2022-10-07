import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Connection {
  username?: string;
  client: Socket;
}

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  connections: Connection[] = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    this.connections.push({ client });
    this.server.emit('chatToClient', {
      message: `New user connecting... there are ${this.connections.length} users on chat now`,
    });
  }

  handleDisconnect(client: Socket) {
      this.connections = this.connections.filter(c => c.client === client);
      this.server.emit('chatToClient', {
        message: `New user disconnecting... there are ${this.connections.length} users left on chat`,
      });
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, payload: any) {
    this.server.emit('chatToClient', payload);
  }
}
