export type SensorStatus = 'normal' | 'warning' | 'alarm' | 'offline';

export type ViewKey =
  | 'overview'
  | 'cabin'
  | 'environment'
  | 'growth'
  | 'control'
  | 'professional'
  | 'batch'
  | 'workflow'
  | 'sop'
  | 'governance'
  | 'display'
  | 'config'
  | 'history'
  | 'reports'
  | 'security'
  | 'settings'
  | 'screen'
  | 'user'
  | 'demo'
  | 'decision'
  | 'trace'
  | 'audit'
  | 'engineering'
  | 'integration'
  | 'drill'
  | 'search'
  | 'point'
  | 'explain'
  | 'delivery'
  | 'recipe'
  | 'calendar'
  | 'biosecurity'
  | 'production'
  | 'harvest'
  | 'experience'
  | 'closure'
  | 'reviewMeeting'
  | 'quality'
  | 'director'
  | 'economics'
  | 'collaboration'
  | 'brain'
  | 'strategy'
  | 'acceptance'
  | 'presentation'
  | 'alarms'
  | 'maintenance';

export type RoleKey = 'manager' | 'grower' | 'operator' | 'visitor';

export type SceneMode = 'points' | 'heatmap' | 'patrol';

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

export interface DashboardSummary {
  stage: string;
  onlineRate: number;
  targetRate: number;
  alarmCount: number;
  energyToday: number;
  core: {
    temperature: number;
    humidity: number;
    co2: number;
    light: number;
  };
  devices: Array<{
    id: string;
    name: string;
    mode: string;
    running: boolean;
    load: number;
  }>;
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

export interface TelemetryPayload {
  summary: DashboardSummary;
  sensors: SensorPoint[];
  alarms: AlarmEvent[];
}
