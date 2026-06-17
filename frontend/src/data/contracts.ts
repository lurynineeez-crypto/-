export interface SensorPointDto {
  id: string;
  name: string;
  type: string;
  installPosition: string;
  layer: string;
  position: { x: number; y: number; z: number };
}

export interface TelemetryRecordDto {
  sensorId: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'alarm' | 'offline';
  collectedAt: string;
}

export interface WorkOrderDto {
  id: string;
  sourceId: string;
  level: string;
  assignee: string;
  status: string;
  closedAt?: string;
}

export interface BatchDto {
  id: string;
  crop: string;
  stage: string;
  startedAt: string;
  expectedHarvestAt?: string;
  yieldKg?: number;
}
