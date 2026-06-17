/**
 * 演示数据兜底模块
 * 当后端/WebSocket 未连接时，前端自动使用本模块数据
 * 不新增任何硬件，仅基于现有温湿度、CO2、光照、料温、基质、设备、安全、电气点位
 */
import type { AlarmEvent, DashboardSummary, SensorPoint } from '../types';

/* ── 兜底 summary ── */
export const fallbackSummary: DashboardSummary = {
  stage: '子实体生长期',
  onlineRate: 100,
  targetRate: 92,
  alarmCount: 2,
  energyToday: 4.8,
  core: { temperature: 20.6, humidity: 87.4, co2: 1720, light: 735 },
  devices: [
    { id: 'AC-03', name: '空调系统', mode: '自动', running: true, load: 72 },
    { id: 'HUM-01', name: '加湿系统', mode: '联动', running: true, load: 55 },
    { id: 'AIR-02', name: '新风风机', mode: '联动', running: true, load: 48 },
    { id: 'LED-01', name: 'LED补光', mode: '定时', running: true, load: 60 }
  ]
};

/* ── 兜底 sensors（68 个点位摘要，4 类 + 设备/安全/电气） ── */
function makeSensor(
  id: string, name: string, type: SensorPoint['type'], cat: string,
  layer: string, x: number, y: number, z: number,
  value: number, unit: string, status: SensorPoint['reading']['status'],
  secondary?: number, secondaryUnit?: string
): SensorPoint {
  return {
    id, name, type, category: cat, installPosition: cat, layer,
    position: { x, y, z },
    reading: { value, unit, secondaryValue: secondary, secondaryUnit, status, updatedAt: new Date().toISOString() }
  };
}

export const fallbackSensors: SensorPoint[] = [
  /* 温湿度 14 点 */
  makeSensor('TH-MAIN-001', '主温湿度', 'temperature_humidity', '温湿度', '顶部', 0, 4.5, 2.8, 20.6, '℃', 'normal', 87.4, '%RH'),
  makeSensor('TH-TOP-002', '上部前温湿度', 'temperature_humidity', '温湿度', '上层', -1.2, 2.5, 1.8, 20.4, '℃', 'normal', 87.2, '%RH'),
  makeSensor('TH-TOP-003', '上部后温湿度', 'temperature_humidity', '温湿度', '上层', 1.2, 2.5, 1.8, 20.8, '℃', 'normal', 86.9, '%RH'),
  makeSensor('TH-MID-004', '中部前温湿度', 'temperature_humidity', '温湿度', '中层', -1.2, 0, 1.2, 20.5, '℃', 'normal', 88.6, '%RH'),
  makeSensor('TH-MID-005', '中部后温湿度', 'temperature_humidity', '温湿度', '中层', 1.2, 0, 1.2, 20.7, '℃', 'normal', 88.4, '%RH'),
  makeSensor('TH-L2-006', '下部左温湿度', 'temperature_humidity', '温湿度', '下层', -1.2, -2.5, 0.6, 20.3, '℃', 'warning', 84.9, '%RH'),
  makeSensor('TH-L2-007', '下部右温湿度', 'temperature_humidity', '温湿度', '下层', 1.2, -2.5, 0.6, 20.2, '℃', 'normal', 85.3, '%RH'),
  makeSensor('TH-MID-008', '中左温湿度', 'temperature_humidity', '温湿度', '中层', -1.6, 0, 1.2, 20.6, '℃', 'normal', 88.1, '%RH'),
  makeSensor('TH-MID-009', '中右温湿度', 'temperature_humidity', '温湿度', '中层', 1.6, 0, 1.2, 20.4, '℃', 'normal', 88.0, '%RH'),
  makeSensor('TH-TOP-010', '上左温湿度', 'temperature_humidity', '温湿度', '上层', -1.6, 2.5, 1.8, 21.4, '℃', 'normal', 87.0, '%RH'),
  makeSensor('TH-TOP-011', '上右温湿度', 'temperature_humidity', '温湿度', '上层', 1.6, 2.5, 1.8, 21.1, '℃', 'normal', 86.8, '%RH'),
  makeSensor('TH-VENT-012', '通风口温湿度', 'temperature_humidity', '温湿度', '顶部', 0, 4.5, 2.5, 20.9, '℃', 'normal', 86.2, '%RH'),
  makeSensor('TH-CORNER-013', '左后角温湿度', 'temperature_humidity', '温湿度', '下层', -2, -2.5, 0.6, 20.1, '℃', 'normal', 85.7, '%RH'),
  makeSensor('TH-CORNER-014', '右后角温湿度', 'temperature_humidity', '温湿度', '下层', 2, -2.5, 0.6, 20.0, '℃', 'normal', 85.5, '%RH'),

  /* CO2 8 点 */
  makeSensor('CO2-TOP-001', '顶部CO2', 'co2', 'CO2', '顶部', 0, 4, 2.8, 1680, 'ppm', 'normal'),
  makeSensor('CO2-MID-002', '中部CO2', 'co2', 'CO2', '中层', 0, 0, 1.2, 1580, 'ppm', 'normal'),
  makeSensor('CO2-L2-003', '下部CO2', 'co2', 'CO2', '下层', 0, -2.5, 0.6, 1760, 'ppm', 'warning'),
  makeSensor('CO2-VENT-004', '通风口CO2', 'co2', 'CO2', '顶部', 0, 4.2, 2.5, 1520, 'ppm', 'normal'),
  makeSensor('CO2-CORNER-005', '左角CO2', 'co2', 'CO2', '下层', -1.8, -2.5, 0.6, 1780, 'ppm', 'normal'),
  makeSensor('CO2-CORNER-006', '右角CO2', 'co2', 'CO2', '下层', 1.8, -2.5, 0.6, 1740, 'ppm', 'normal'),
  makeSensor('CO2-TOP-007', '上前CO2', 'co2', 'CO2', '上层', -0.8, 3, 2, 1650, 'ppm', 'normal'),
  makeSensor('CO2-TOP-008', '上后CO2', 'co2', 'CO2', '上层', 0.8, 3, 2, 1690, 'ppm', 'normal'),

  /* 光照 6 点 */
  makeSensor('L-TOP-001', '舱顶光照', 'light', '光照', '顶部', 0, 4, 3, 748, 'lx', 'normal'),
  makeSensor('L-TOP-002', '上前光照', 'light', '光照', '上层', -1, 2.5, 1.8, 735, 'lx', 'normal'),
  makeSensor('L-TOP-003', '上后光照', 'light', '光照', '上层', 1, 2.5, 1.8, 720, 'lx', 'normal'),
  makeSensor('L-MID-004', '中前光照', 'light', '光照', '中层', -1, 0, 1.2, 680, 'lx', 'normal'),
  makeSensor('L-MID-005', '中后光照', 'light', '光照', '中层', 1, 0, 1.2, 665, 'lx', 'normal'),
  makeSensor('L-L2-006', '下部光照', 'light', '光照', '下层', 0, -2.5, 0.6, 610, 'lx', 'normal'),

  /* 料温 8 点 */
  makeSensor('ST-TOP-001', '上层1架料温', 'substrate_temperature', '料温', '上层', -1.2, 2.5, 1.5, 21.2, '℃', 'normal'),
  makeSensor('ST-TOP-002', '上层2架料温', 'substrate_temperature', '料温', '上层', 1.2, 2.5, 1.5, 21.0, '℃', 'normal'),
  makeSensor('ST-MID-003', '中层3架料温', 'substrate_temperature', '料温', '中层', -1.2, 0, 0.8, 20.8, '℃', 'normal'),
  makeSensor('ST-MID-004', '中层4架料温', 'substrate_temperature', '料温', '中层', 1.2, 0, 0.8, 20.9, '℃', 'normal'),
  makeSensor('ST-L2-005', '下层5架料温', 'substrate_temperature', '料温', '下层', -1.2, -2.5, 0.4, 20.5, '℃', 'normal'),
  makeSensor('ST-L2-006', '下层6架料温', 'substrate_temperature', '料温', '下层', 1.2, -2.5, 0.4, 20.4, '℃', 'normal'),
  makeSensor('ST-TOP-007', '上层前料温', 'substrate_temperature', '料温', '上层', -0.6, 2.5, 1.5, 21.3, '℃', 'normal'),
  makeSensor('ST-L2-008', '下层前料温', 'substrate_temperature', '料温', '下层', -0.6, -2.5, 0.4, 20.6, '℃', 'normal'),

  /* 基质湿度 8 点 */
  makeSensor('SH-TOP-001', '上层1架基质湿度', 'substrate_humidity', '基质湿度', '上层', -1.2, 2.5, 1.4, 82, '%', 'normal'),
  makeSensor('SH-TOP-002', '上层2架基质湿度', 'substrate_humidity', '基质湿度', '上层', 1.2, 2.5, 1.4, 81, '%', 'normal'),
  makeSensor('SH-MID-003', '中层3架基质湿度', 'substrate_humidity', '基质湿度', '中层', -1.2, 0, 0.7, 84, '%', 'normal'),
  makeSensor('SH-MID-004', '中层4架基质湿度', 'substrate_humidity', '基质湿度', '中层', 1.2, 0, 0.7, 83, '%', 'normal'),
  makeSensor('SH-L2-005', '下层5架基质湿度', 'substrate_humidity', '基质湿度', '下层', -1.2, -2.5, 0.3, 78, '%', 'warning'),
  makeSensor('SH-L2-006', '下层6架基质湿度', 'substrate_humidity', '基质湿度', '下层', 1.2, -2.5, 0.3, 79, '%', 'normal'),
  makeSensor('SH-TOP-007', '上前基质湿度', 'substrate_humidity', '基质湿度', '上层', -0.6, 2.5, 1.4, 80, '%', 'normal'),
  makeSensor('SH-L2-008', '下前基质湿度', 'substrate_humidity', '基质湿度', '下层', -0.6, -2.5, 0.3, 77, '%', 'warning'),

  /* 设备状态 8 点 */
  makeSensor('DEV-AC-03', '空调系统', 'device', '设备', '顶部', 0, 4.5, 3, 1, 'state', 'normal'),
  makeSensor('DEV-HUM-01', '加湿系统', 'device', '设备', '中层', -0.5, 0, 1.8, 1, 'state', 'normal'),
  makeSensor('DEV-AIR-02', '新风风机', 'device', '设备', '顶部', 0, 4.5, 2.5, 1, 'state', 'normal'),
  makeSensor('DEV-LED-01', 'LED补光', 'device', '设备', '顶部', 0, 4.5, 2.2, 1, 'state', 'normal'),
  makeSensor('DEV-ELEC-01', '配电箱', 'device', '设备', '下层', 2, -2.5, 0.2, 1, 'state', 'normal'),
  makeSensor('DEV-GATE-01', '门禁', 'device', '设备', '中层', 0, -0.5, 1, 1, 'state', 'normal'),
  makeSensor('DEV-UPS-01', 'UPS电源', 'device', '设备', '下层', 2, -2.5, 0.1, 1, 'state', 'normal'),
  makeSensor('DEV-CTRL-01', '采集器', 'device', '设备', '中层', 0, 0.5, 1.5, 1, 'state', 'normal'),

  /* 安全 10 点 */
  makeSensor('SAFE-SMOKE-01', '烟雾检测', 'safety', '安全', '顶部', 0, 3, 3, 0, 'state', 'normal'),
  makeSensor('SAFE-WATER-01', '水浸检测', 'safety', '安全', '下层', 0, -2.5, 0, 0, 'state', 'normal'),
  makeSensor('SAFE-GATE-01', '门磁状态', 'safety', '安全', '中层', 0, -0.5, 1, 0, 'state', 'normal'),
  makeSensor('SAFE-SMOKE-02', '后区烟雾', 'safety', '安全', '顶部', 0, 1, 3, 0, 'state', 'normal'),
  makeSensor('SAFE-WATER-02', '管道区水浸', 'safety', '安全', '下层', 1.5, -2.5, 0, 0, 'state', 'normal'),
  makeSensor('SAFE-EMER-01', '急停按钮', 'safety', '安全', '中层', 0, 0, 1, 0, 'state', 'normal'),
  makeSensor('SAFE-CAM-01', '舱内摄像头', 'safety', '安全', '顶部', 0, 4.5, 3, 0, 'state', 'normal'),
  makeSensor('SAFE-CAM-02', '门口摄像头', 'safety', '安全', '中层', 0, -1, 1, 0, 'state', 'normal'),
  makeSensor('SAFE-FIRE-01', '灭火器状态', 'safety', '安全', '中层', 1.5, 0, 1, 0, 'state', 'normal'),
  makeSensor('SAFE-LEAK-01', '漏电检测', 'safety', '安全', '下层', 2, -2.5, 0.2, 0, 'state', 'normal'),

  /* 电气 6 点 */
  makeSensor('ELEC-MAIN-01', '总电流', 'electrical', '电气', '下层', 2, -2.5, 0.15, 12.4, 'A', 'normal'),
  makeSensor('ELEC-AC-01', '空调电流', 'electrical', '电气', '顶部', 0, 4.5, 3, 5.2, 'A', 'normal'),
  makeSensor('ELEC-HUM-01', '加湿电流', 'electrical', '电气', '中层', -0.5, 0, 1.8, 1.8, 'A', 'normal'),
  makeSensor('ELEC-FAN-01', '新风电流', 'electrical', '电气', '顶部', 0, 4.5, 2.5, 2.1, 'A', 'normal'),
  makeSensor('ELEC-LED-01', 'LED电流', 'electrical', '电气', '顶部', 0, 4.5, 2.2, 0.9, 'A', 'normal'),
  makeSensor('ELEC-UPS-01', 'UPS电压', 'electrical', '电气', '下层', 2, -2.5, 0.1, 220, 'V', 'normal')
];

/* ── 兜底 alarms ── */
export const fallbackAlarms: AlarmEvent[] = [
  {
    id: 'ALM-001',
    sensorId: 'TH-L2-006',
    sensorName: '下部左温湿度',
    level: 'warning',
    message: '下层湿度 84.9%RH，低于子实体期下限 85%RH',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    handled: false
  },
  {
    id: 'ALM-002',
    sensorId: 'CO2-L2-003',
    sensorName: '下部CO2',
    level: 'warning',
    message: 'CO2 达 1760ppm，接近阶段上限 2000ppm',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    handled: false
  }
];

/* ── 判断连接状态文案 ── */
export type ConnectionState = 'connecting' | 'demo' | 'online' | 'error';

export function connectionLabel(state: ConnectionState): string {
  switch (state) {
    case 'online': return '实时在线';
    case 'demo': return '演示数据';
    case 'connecting': return '连接中，显示演示样例';
    case 'error': return '连接异常，使用演示数据';
    default: return '演示数据';
  }
}

export function connectionPillClass(state: ConnectionState): string {
  switch (state) {
    case 'online': return 'pill-online';
    case 'demo': return 'pill-demo';
    case 'connecting': return 'pill-connecting';
    case 'error': return 'pill-error';
    default: return 'pill-demo';
  }
}

/* ── 统一状态所用色值（CSS 变量 fallback） ── */
export const STATUS_COLORS: Record<string, string> = {
  正常: '#10b981',
  稳定: '#10b981',
  通过: '#10b981',
  已闭环: '#10b981',
  关注: '#f59e0b',
  预警: '#f59e0b',
  处理中: '#2563eb',
  待复核: '#2563eb',
  待处理: '#ea580c',
  未通过: '#ef4444',
  异常: '#ef4444',
  离线: '#94a3b8'
} as const;
