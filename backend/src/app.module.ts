import { Module } from '@nestjs/common';
import { SensorController } from './sensors/sensor.controller';
import { SensorGateway } from './sensors/sensor.gateway';
import { SensorService } from './sensors/sensor.service';

@Module({
  imports: [],
  controllers: [SensorController],
  providers: [SensorService, SensorGateway]
})
export class AppModule {}
