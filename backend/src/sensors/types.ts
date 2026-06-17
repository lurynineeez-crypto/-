export type SensorStatus = 'normal' | 'warning' | 'alarm' | 'offline';

export type SensorType =
  | 'temperature_humidity'
  | 'co2'
  | 'light'
  | 'substrate_temperature'
  | 'substrate_humidity'

  | 'device'
  | 'safety'
  | 'electrical';

export interface SensorReading {
  value: number;
  unit: string;
  secondaryValue?: number;
  secondaryUnit?: string;
  status: SensorStatus;
  updatedAt: string;
}

export interface SensorPoint {
  id: string;
  name: string;
  type: SensorType;
  category: string;
  installPosition: string;
  layer: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  reading: SensorReading;
}

export interface AlarmEvent {
  id: string;
  sensorId: string;
  sensorName: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
  handled: boolean;
}
