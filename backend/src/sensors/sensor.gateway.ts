import { Inject } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorService } from './sensor.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true
  }
})
export class SensorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private interval?: NodeJS.Timeout;
  private clients = 0;

  constructor(@Inject(SensorService) private readonly sensorService: SensorService) {}

  handleConnection(client: Socket) {
    this.clients += 1;
    client.emit('telemetry', this.sensorService.getTelemetry());
    this.ensureInterval();
  }

  handleDisconnect() {
    this.clients = Math.max(0, this.clients - 1);
    if (this.clients === 0 && this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private ensureInterval() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.server.emit('telemetry', this.sensorService.getTelemetry());
    }, 2500);
  }
}
