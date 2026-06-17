import { Injectable } from '@nestjs/common';
import { AlarmEvent, SensorPoint } from './types';
import { createInitialSensors, nextStatus } from './mock-sensors';

@Injectable()
export class SensorService {
  private sensors: SensorPoint[] = createInitialSensors();

  getSummary() {
    const coreTemp = this.average((sensor) => sensor.type === 'temperature_humidity', 'value');
    const coreHumidity = this.averageSecondary((sensor) => sensor.type === 'temperature_humidity');
    const coreCo2 = this.average((sensor) => sensor.type === 'co2', 'value');
    const coreLight = this.average((sensor) => sensor.type === 'light', 'value');
    const alarms = this.getAlarms();
    const onlineCount = this.sensors.filter((sensor) => sensor.reading.status !== 'offline').length;

    return {
      stage: '子实体生长期',
      onlineRate: Math.round((onlineCount / this.sensors.length) * 100),
      targetRate: 94,
      alarmCount: alarms.length,
      energyToday: 38.6,
      core: {
        temperature: coreTemp,
        humidity: coreHumidity,
        co2: coreCo2,
        light: coreLight
      },
      devices: [
        { id: 'ac', name: '空调系统', mode: '自动', running: true, load: 62 },
        { id: 'humidifier', name: '加湿系统', mode: '自动', running: true, load: 71 },
        { id: 'fresh-air', name: '新风系统', mode: '联动', running: true, load: 54 },
        { id: 'lighting', name: 'LED 照明', mode: '定时', running: true, load: 48 }
      ]
    };
  }

  getSensors() {
    return this.sensors;
  }

  getAlarms(): AlarmEvent[] {
    return this.sensors
      .filter((sensor) => sensor.reading.status === 'warning' || sensor.reading.status === 'alarm')
      .slice(0, 8)
      .map((sensor, index) => ({
        id: `ALARM-${sensor.id}`,
        sensorId: sensor.id,
        sensorName: sensor.name,
        level: sensor.reading.status === 'alarm' ? 'critical' : 'warning',
        message: sensor.reading.status === 'alarm' ? '检测到紧急异常，请现场确认' : '读数接近控制阈值',
        createdAt: new Date(Date.now() - index * 90_000).toISOString(),
        handled: false
      }));
  }

  getTelemetry() {
    this.tick();
    return {
      summary: this.getSummary(),
      sensors: this.getSensors(),
      alarms: this.getAlarms()
    };
  }

  private tick() {
    const now = new Date().toISOString();
    this.sensors = this.sensors.map((sensor, index) => {
      const wave = Math.sin(Date.now() / 9000 + index) * this.amplitude(sensor);
      const drift = Math.cos(Date.now() / 17000 + index * 0.3) * this.amplitude(sensor) * 0.45;
      const value = Math.max(0, sensor.reading.value + wave * 0.08 + drift * 0.03);
      const secondaryValue =
        sensor.reading.secondaryValue === undefined
          ? undefined
          : Math.max(0, Math.min(100, sensor.reading.secondaryValue + Math.sin(Date.now() / 8000 + index) * 0.08));
      const next = {
        ...sensor,
        reading: {
          ...sensor.reading,
          value: Number(value.toFixed(sensor.type === 'co2' || sensor.type === 'light' ? 0 : 2)),
          secondaryValue: secondaryValue === undefined ? undefined : Number(secondaryValue.toFixed(2)),
          updatedAt: now
        }
      };
      next.reading.status = nextStatus(next);
      return next;
    });
  }

  private average(predicate: (sensor: SensorPoint) => boolean, field: 'value') {
    const values = this.sensors.filter(predicate).map((sensor) => sensor.reading[field]);
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
  }

  private averageSecondary(predicate: (sensor: SensorPoint) => boolean) {
    const values = this.sensors
      .filter(predicate)
      .map((sensor) => sensor.reading.secondaryValue)
      .filter((value): value is number => value !== undefined);
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
  }

  private amplitude(sensor: SensorPoint) {
    if (sensor.type === 'co2') return 28;
    if (sensor.type === 'light') return 16;
    if (sensor.type === 'electrical') return 0.2;
    if (sensor.type === 'safety') return 0.04;
    return 0.16;
  }
}
