import { Controller, Get, Inject } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller()
export class SensorController {
  constructor(@Inject(SensorService) private readonly sensorService: SensorService) {}

  @Get('dashboard/summary')
  getSummary() {
    return this.sensorService.getSummary();
  }

  @Get('sensors')
  getSensors() {
    return this.sensorService.getSensors();
  }

  @Get('alarms')
  getAlarms() {
    return this.sensorService.getAlarms();
  }

  @Get('3d/points')
  get3dPoints() {
    return this.sensorService.getSensors().map((sensor) => ({
      id: sensor.id,
      name: sensor.name,
      type: sensor.type,
      position: sensor.position,
      installPosition: sensor.installPosition
    }));
  }
}
