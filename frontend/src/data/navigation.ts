import type { RoleKey, SceneMode, SensorType, ViewKey } from '../types';

export interface NavItem {
  key: ViewKey;
  label: string;
}

export interface NavGroup {
  name: string;
  items: ViewKey[];
}

export interface RoleView {
  key: RoleKey;
  label: string;
  defaultView: ViewKey;
  focus: string;
}

export const navItems: NavItem[] = [
  { key: 'overview', label: '3D 总控' },
  { key: 'brain', label: '决策大脑' },
  { key: 'cabin', label: '三维巡检' },
  { key: 'screen', label: '独立大屏' },

  { key: 'workflow', label: '今日值班' },
  { key: 'sop', label: 'SOP 工单' },

  { key: 'batch', label: '批次总览' },
  { key: 'growth', label: '阶段管理' },
  { key: 'production', label: '菌包状态' },
  { key: 'harvest', label: '采收质量' },
  { key: 'closure', label: '清舱消毒' },
  { key: 'quality', label: '质量放行' },
  { key: 'calendar', label: '种植日历' },
  { key: 'recipe', label: '工艺配方' },
  { key: 'biosecurity', label: '生物安全记录' },
  { key: 'experience', label: '种植知识库' },

  { key: 'environment', label: '环境监测' },
  { key: 'control', label: '联动规则配置' },
  { key: 'alarms', label: '报警处置' },
  { key: 'point', label: '点位巡检' },
  { key: 'professional', label: '专业判断摘要' },

  { key: 'reports', label: '报告文件' },
  { key: 'acceptance', label: '验收材料' },
  { key: 'audit', label: '审计追溯' },
  { key: 'presentation', label: '汇报演示' },
  { key: 'engineering', label: '工程交付' },
  { key: 'config', label: '系统配置' },

  { key: 'user', label: '用户中心' },
  { key: 'decision', label: '风险决策' },
  { key: 'trace', label: '批次追溯' },
  { key: 'history', label: '历史查询' },
  { key: 'governance', label: '报表权限' },
  { key: 'integration', label: '联调文档' },
  { key: 'drill', label: '运维演练' },
  { key: 'search', label: '全局检索' },
  { key: 'explain', label: '规则解释' },
  { key: 'display', label: '多端通知' },
  { key: 'director', label: '主管工作台' },
  { key: 'economics', label: '经营分析' },
  { key: 'collaboration', label: '标准协同' },
  { key: 'strategy', label: '策略沙盘' },
  { key: 'reviewMeeting', label: '复盘会议' },
  { key: 'delivery', label: '交付总览' }
];

export const navGroups: NavGroup[] = [
  {
    name: '总览',
    items: ['overview', 'cabin', 'screen', 'brain']
  },
  {
    name: '今日作业',
    items: ['workflow', 'sop', 'user']
  },
  {
    name: '种植批次',
    items: [
      'batch',
      'growth',
      'production',
      'harvest',
      'calendar',
      'recipe',
      'closure',
      'biosecurity',
      'experience',
      'quality',
      'director',
      'economics',
      'collaboration',
      'strategy',
      'reviewMeeting'
    ]
  },
  {
    name: '运维处置',
    items: [
      'environment',
      'control',
      'alarms',
      'point',
      'professional',
      'decision'
    ]
  },
  {
    name: '报告交付',
    items: [
      'reports',
      'acceptance',
      'audit',
      'presentation',
      'engineering',
      'integration',
      'delivery',
      'drill',
      'search',
      'explain',
      'config',
      'governance',
      'history',
      'display',
      'trace'
    ]
  }
];

export const roleViews: RoleView[] = [
  { key: 'grower', label: '种植员', defaultView: 'overview', focus: '3D 方舱、今日任务、报警处置、批次状态、报告追溯' },
  { key: 'operator', label: '运维员', defaultView: 'overview', focus: '3D 点位、报警处置、设备联动、维护校准' },
  { key: 'manager', label: '管理者', defaultView: 'overview', focus: '3D 总览、批次状态、风险决策、报告验收' },
  { key: 'visitor', label: '演示/访客', defaultView: 'overview', focus: '3D 演示、方舱点位、交付材料' }
];

export const typeOptions: Array<{ value: SensorType | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'temperature_humidity', label: '温湿度' },
  { value: 'co2', label: 'CO2' },
  { value: 'light', label: '光照' },
  { value: 'substrate_temperature', label: '料温' },
  { value: 'substrate_humidity', label: '基质湿度' },
  { value: 'device', label: '设备' },
  { value: 'safety', label: '安全' },
  { value: 'electrical', label: '电气' }
];

export const sceneModes: Array<{ value: SceneMode; label: string }> = [
  { value: 'points', label: '点位' },
  { value: 'heatmap', label: '热力' },
  { value: 'patrol', label: '巡检' }
];
