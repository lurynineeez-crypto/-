import { io } from 'socket.io-client';
import type { AlarmEvent, DashboardSummary, SensorPoint, TelemetryPayload } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  summary: () => request<DashboardSummary>('/api/dashboard/summary'),
  sensors: () => request<SensorPoint[]>('/api/sensors'),
  alarms: () => request<AlarmEvent[]>('/api/alarms')
};

export function connectTelemetry(onTelemetry: (payload: TelemetryPayload) => void) {
  const socket = io(API_BASE || window.location.origin, {
    path: '/socket.io',
    transports: ['websocket', 'polling']
  });

  socket.on('telemetry', onTelemetry);
  return socket;
}
