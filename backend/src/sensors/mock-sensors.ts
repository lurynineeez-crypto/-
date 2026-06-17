import type { SensorPoint, SensorStatus, SensorType } from './types';

type SensorSeed = {
  id: string;
  name: string;
  type: SensorType;
  category: string;
  installPosition: string;
  layer: string;
  position: { x: number; y: number; z: number };
  value: number;
  unit: string;
  status?: SensorStatus;
  secondaryValue?: number;
  secondaryUnit?: string;
};

function seed(
  id: string,
  name: string,
  type: SensorType,
  category: string,
  layer: string,
  position: { x: number; y: number; z: number },
  value: number,
  unit: string,
  status: SensorStatus = 'normal',
  secondaryValue?: number,
  secondaryUnit?: string
): SensorSeed {
  return {
    id,
    name,
    type,
    category,
    installPosition: `${layer} ${name}`,
    layer,
    position,
    value,
    unit,
    status,
    secondaryValue,
    secondaryUnit
  };
}

const sensorSeeds: SensorSeed[] = [
  // 温湿度 14
  seed('TH-MAIN-001', '主温湿度', 'temperature_humidity', '温湿度', '顶部', { x: 0, y: 4.5, z: 2.8 }, 20.6, '℃', 'normal', 87.4, '%RH'),
  seed('TH-TOP-002', '上部前温湿度', 'temperature_humidity', '温湿度', '上层', { x: -1.2, y: 2.5, z: 1.8 }, 20.4, '℃', 'normal', 87.2, '%RH'),
  seed('TH-TOP-003', '上部后温湿度', 'temperature_humidity', '温湿度', '上层', { x: 1.2, y: 2.5, z: 1.8 }, 20.8, '℃', 'normal', 86.9, '%RH'),
  seed('TH-MID-004', '中部前温湿度', 'temperature_humidity', '温湿度', '中层', { x: -1.2, y: 0, z: 1.2 }, 20.5, '℃', 'normal', 88.6, '%RH'),
  seed('TH-MID-005', '中部后温湿度', 'temperature_humidity', '温湿度', '中层', { x: 1.2, y: 0, z: 1.2 }, 20.7, '℃', 'normal', 88.4, '%RH'),
  seed('TH-L2-006', '下部左温湿度', 'temperature_humidity', '温湿度', '下层', { x: -1.2, y: -2.5, z: 0.6 }, 20.3, '℃', 'warning', 84.9, '%RH'),
  seed('TH-L2-007', '下部右温湿度', 'temperature_humidity', '温湿度', '下层', { x: 1.2, y: -2.5, z: 0.6 }, 20.2, '℃', 'normal', 85.3, '%RH'),
  seed('TH-MID-008', '中左温湿度', 'temperature_humidity', '温湿度', '中层', { x: -1.6, y: 0, z: 1.2 }, 20.6, '℃', 'normal', 88.1, '%RH'),
  seed('TH-MID-009', '中右温湿度', 'temperature_humidity', '温湿度', '中层', { x: 1.6, y: 0, z: 1.2 }, 20.4, '℃', 'normal', 88.0, '%RH'),
  seed('TH-TOP-010', '上左温湿度', 'temperature_humidity', '温湿度', '上层', { x: -1.6, y: 2.5, z: 1.8 }, 21.4, '℃', 'normal', 87.0, '%RH'),
  seed('TH-TOP-011', '上右温湿度', 'temperature_humidity', '温湿度', '上层', { x: 1.6, y: 2.5, z: 1.8 }, 21.1, '℃', 'normal', 86.8, '%RH'),
  seed('TH-VENT-012', '通风口温湿度', 'temperature_humidity', '温湿度', '顶部', { x: 0, y: 4.5, z: 2.5 }, 20.9, '℃', 'normal', 86.2, '%RH'),
  seed('TH-CORNER-013', '左后角温湿度', 'temperature_humidity', '温湿度', '下层', { x: -2, y: -2.5, z: 0.6 }, 20.1, '℃', 'normal', 85.7, '%RH'),
  seed('TH-CORNER-014', '右后角温湿度', 'temperature_humidity', '温湿度', '下层', { x: 2, y: -2.5, z: 0.6 }, 20.0, '℃', 'normal', 85.5, '%RH'),

  // CO2 8
  seed('CO2-TOP-001', '顶部CO2', 'co2', 'CO2', '顶部', { x: 0, y: 4, z: 2.8 }, 1680, 'ppm'),
  seed('CO2-MID-002', '中部CO2', 'co2', 'CO2', '中层', { x: 0, y: 0, z: 1.2 }, 1580, 'ppm'),
  seed('CO2-L2-003', '下部CO2', 'co2', 'CO2', '下层', { x: 0, y: -2.5, z: 0.6 }, 1760, 'ppm', 'warning'),
  seed('CO2-VENT-004', '通风口CO2', 'co2', 'CO2', '顶部', { x: 0, y: 4.2, z: 2.5 }, 1520, 'ppm'),
  seed('CO2-CORNER-005', '左角CO2', 'co2', 'CO2', '下层', { x: -1.8, y: -2.5, z: 0.6 }, 1780, 'ppm'),
  seed('CO2-CORNER-006', '右角CO2', 'co2', 'CO2', '下层', { x: 1.8, y: -2.5, z: 0.6 }, 1740, 'ppm'),
  seed('CO2-TOP-007', '上前CO2', 'co2', 'CO2', '上层', { x: -0.8, y: 3, z: 2 }, 1650, 'ppm'),
  seed('CO2-TOP-008', '上后CO2', 'co2', 'CO2', '上层', { x: 0.8, y: 3, z: 2 }, 1690, 'ppm'),

  // 光照 6
  seed('L-TOP-001', '舱顶光照', 'light', '光照', '顶部', { x: 0, y: 4, z: 3 }, 748, 'lx'),
  seed('L-TOP-002', '上前光照', 'light', '光照', '上层', { x: -1, y: 2.5, z: 1.8 }, 735, 'lx'),
  seed('L-TOP-003', '上后光照', 'light', '光照', '上层', { x: 1, y: 2.5, z: 1.8 }, 720, 'lx'),
  seed('L-MID-004', '中前光照', 'light', '光照', '中层', { x: -1, y: 0, z: 1.2 }, 680, 'lx'),
  seed('L-MID-005', '中后光照', 'light', '光照', '中层', { x: 1, y: 0, z: 1.2 }, 665, 'lx'),
  seed('L-L2-006', '下部光照', 'light', '光照', '下层', { x: 0, y: -2.5, z: 0.6 }, 610, 'lx'),

  // 料温 8
  seed('ST-TOP-001', '上层1架料温', 'substrate_temperature', '料温', '上层', { x: -1.2, y: 2.5, z: 1.5 }, 21.2, '℃'),
  seed('ST-TOP-002', '上层2架料温', 'substrate_temperature', '料温', '上层', { x: 1.2, y: 2.5, z: 1.5 }, 21.0, '℃'),
  seed('ST-MID-003', '中层3架料温', 'substrate_temperature', '料温', '中层', { x: -1.2, y: 0, z: 0.8 }, 20.8, '℃'),
  seed('ST-MID-004', '中层4架料温', 'substrate_temperature', '料温', '中层', { x: 1.2, y: 0, z: 0.8 }, 20.9, '℃'),
  seed('ST-L2-005', '下层5架料温', 'substrate_temperature', '料温', '下层', { x: -1.2, y: -2.5, z: 0.4 }, 20.5, '℃'),
  seed('ST-L2-006', '下层6架料温', 'substrate_temperature', '料温', '下层', { x: 1.2, y: -2.5, z: 0.4 }, 20.4, '℃'),
  seed('ST-TOP-007', '上层前料温', 'substrate_temperature', '料温', '上层', { x: -0.6, y: 2.5, z: 1.5 }, 21.3, '℃'),
  seed('ST-L2-008', '下层前料温', 'substrate_temperature', '料温', '下层', { x: -0.6, y: -2.5, z: 0.4 }, 20.6, '℃'),

  // 基质湿度 8
  seed('SH-TOP-001', '上层1架基质湿度', 'substrate_humidity', '基质湿度', '上层', { x: -1.2, y: 2.5, z: 1.4 }, 82, '%'),
  seed('SH-TOP-002', '上层2架基质湿度', 'substrate_humidity', '基质湿度', '上层', { x: 1.2, y: 2.5, z: 1.4 }, 81, '%'),
  seed('SH-MID-003', '中层3架基质湿度', 'substrate_humidity', '基质湿度', '中层', { x: -1.2, y: 0, z: 0.7 }, 84, '%'),
  seed('SH-MID-004', '中层4架基质湿度', 'substrate_humidity', '基质湿度', '中层', { x: 1.2, y: 0, z: 0.7 }, 83, '%'),
  seed('SH-L2-005', '下层5架基质湿度', 'substrate_humidity', '基质湿度', '下层', { x: -1.2, y: -2.5, z: 0.3 }, 78, '%', 'warning'),
  seed('SH-L2-006', '下层6架基质湿度', 'substrate_humidity', '基质湿度', '下层', { x: 1.2, y: -2.5, z: 0.3 }, 79, '%'),
  seed('SH-TOP-007', '上前基质湿度', 'substrate_humidity', '基质湿度', '上层', { x: -0.6, y: 2.5, z: 1.4 }, 80, '%'),
  seed('SH-L2-008', '下前基质湿度', 'substrate_humidity', '基质湿度', '下层', { x: -0.6, y: -2.5, z: 0.3 }, 77, '%', 'warning'),

  // 设备状态 8
  seed('DEV-AC-03', '空调系统', 'device', '设备', '顶部', { x: 0, y: 4.5, z: 3 }, 1, 'state'),
  seed('DEV-HUM-01', '加湿系统', 'device', '设备', '中层', { x: -0.5, y: 0, z: 1.8 }, 1, 'state'),
  seed('DEV-AIR-02', '新风风机', 'device', '设备', '顶部', { x: 0, y: 4.5, z: 2.5 }, 1, 'state'),
  seed('DEV-LED-01', 'LED补光', 'device', '设备', '顶部', { x: 0, y: 4.5, z: 2.2 }, 1, 'state'),
  seed('DEV-ELEC-01', '配电箱', 'device', '设备', '下层', { x: 2, y: -2.5, z: 0.2 }, 1, 'state'),
  seed('DEV-GATE-01', '门禁', 'device', '设备', '中层', { x: 0, y: -0.5, z: 1 }, 1, 'state'),
  seed('DEV-UPS-01', 'UPS电源', 'device', '设备', '下层', { x: 2, y: -2.5, z: 0.1 }, 1, 'state'),
  seed('DEV-CTRL-01', '采集器', 'device', '设备', '中层', { x: 0, y: 0.5, z: 1.5 }, 1, 'state'),

  // 安全 10
  seed('SAFE-SMOKE-01', '烟雾检测', 'safety', '安全', '顶部', { x: 0, y: 3, z: 3 }, 0, 'state'),
  seed('SAFE-WATER-01', '水浸检测', 'safety', '安全', '下层', { x: 0, y: -2.5, z: 0 }, 0, 'state'),
  seed('SAFE-GATE-01', '门磁状态', 'safety', '安全', '中层', { x: 0, y: -0.5, z: 1 }, 0, 'state'),
  seed('SAFE-SMOKE-02', '后区烟雾', 'safety', '安全', '顶部', { x: 0, y: 1, z: 3 }, 0, 'state'),
  seed('SAFE-WATER-02', '管道区水浸', 'safety', '安全', '下层', { x: 1.5, y: -2.5, z: 0 }, 0, 'state'),
  seed('SAFE-EMER-01', '急停按钮', 'safety', '安全', '中层', { x: 0, y: 0, z: 1 }, 0, 'state'),
  seed('SAFE-CAM-01', '舱内摄像头', 'safety', '安全', '顶部', { x: 0, y: 4.5, z: 3 }, 0, 'state'),
  seed('SAFE-CAM-02', '门口摄像头', 'safety', '安全', '中层', { x: 0, y: -1, z: 1 }, 0, 'state'),
  seed('SAFE-FIRE-01', '灭火器状态', 'safety', '安全', '中层', { x: 1.5, y: 0, z: 1 }, 0, 'state'),
  seed('SAFE-LEAK-01', '漏电检测', 'safety', '安全', '下层', { x: 2, y: -2.5, z: 0.2 }, 0, 'state'),

  // 电气 6
  seed('ELEC-MAIN-01', '总电流', 'electrical', '电气', '下层', { x: 2, y: -2.5, z: 0.15 }, 12.4, 'A'),
  seed('ELEC-AC-01', '空调电流', 'electrical', '电气', '顶部', { x: 0, y: 4.5, z: 3 }, 5.2, 'A'),
  seed('ELEC-HUM-01', '加湿电流', 'electrical', '电气', '中层', { x: -0.5, y: 0, z: 1.8 }, 1.8, 'A'),
  seed('ELEC-FAN-01', '新风电流', 'electrical', '电气', '顶部', { x: 0, y: 4.5, z: 2.5 }, 2.1, 'A'),
  seed('ELEC-LED-01', 'LED电流', 'electrical', '电气', '顶部', { x: 0, y: 4.5, z: 2.2 }, 0.9, 'A'),
  seed('ELEC-UPS-01', 'UPS电压', 'electrical', '电气', '下层', { x: 2, y: -2.5, z: 0.1 }, 220, 'V')
];

export function createInitialSensors(): SensorPoint[] {
  return sensorSeeds.map((sensor) => ({
    id: sensor.id,
    name: sensor.name,
    type: sensor.type,
    category: sensor.category,
    installPosition: sensor.installPosition,
    layer: sensor.layer,
    position: sensor.position,
    reading: {
      value: sensor.value,
      unit: sensor.unit,
      secondaryValue: sensor.secondaryValue,
      secondaryUnit: sensor.secondaryUnit,
      status: sensor.status ?? 'normal',
      updatedAt: new Date().toISOString()
    }
  }));
}

export function nextStatus(sensor: SensorPoint): SensorStatus {
  if (sensor.reading.status === 'offline') return 'offline';
  if (sensor.type === 'safety' && sensor.reading.value > 0.85) return 'alarm';
  if (sensor.type === 'co2' && sensor.reading.value > 1900) return 'warning';
  if (sensor.type === 'temperature_humidity' && sensor.reading.secondaryValue !== undefined && sensor.reading.secondaryValue < 85) return 'warning';
  if (sensor.type === 'substrate_humidity' && sensor.reading.value < 80) return 'warning';
  if (sensor.type === 'electrical' && sensor.reading.unit === 'A' && sensor.reading.value > 18) return 'warning';
  return 'normal';
}
