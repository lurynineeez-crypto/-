/**
 * 用户系统模块数据 composable
 * 包含待办、任务筛选、角色工作台、演示模式、巡检、SOP等静态数据
 */
import {
  approvalRecords,
  loginRoles,
  settingGroups,
  demoScenarios,
  statusColorStandards,
  bulkActionEntries,
  noteCards,
  exportShortcuts,
  keyboardHints,
  userQuickActions,
  favoritePages,
  recentObjects,
  taskPriorityQueue,
  confirmationCards,
  onboardingSteps,
  enhancedSearchCategories,
  userOperationHistory,
  conceptHelpCenter,
  pageStateSamples,
  feedbackEntries,
  weakNetworkStatus,
  userPreferenceItems,
  terminologyModes,
  plantingLogs,
  inspectionChecklist,
  inspectionSchedule,
  sopGuides,
  stageChecklist
} from '../data/mock-business';
import type { RoleKey } from '../types';

export function useUserSystemData() {
  const taskFilterOptions = ['all', 'mine', 'overdue', 'high', 'done'] as const;
  const simplifiedModes = ['standard', 'leader', 'field'];

  const userTodoSummary = [
    { title: '待处理报警', value: '1项', detail: 'CO2预警事件' },
    { title: '今日巡检', value: '2项', detail: '加湿水位/新风响应' },
    { title: '待处理审批', value: '1项', detail: '湿度阈值调整' },
    { title: '交接班', value: '待处理', detail: '下一班注意事项' }
  ];

  const roleWorkbenchCards: Record<RoleKey, any[]> = {
    manager: [{ target: '决策看板', title: '风险决策', value: '1项待处理' }, { target: '报表中心', title: '运行日报', value: '已生成' }],
    grower: [{ target: '日常工作', title: '今日巡检', value: '2项' }, { target: '报警事件', title: '待处理报警', value: '1项' }],
    operator: [{ target: '维护校准', title: '新风复测', value: '待处理' }, { target: '点位档案', title: '点位台账', value: '68个' }],
    visitor: [{ target: '大屏', title: '驾驶舱', value: '在线' }]
  };

  const executiveSimpleCards = [
    { label: '环境评分', value: '88' }, { label: '达标率', value: '92%' },
    { label: '报警', value: '1' }, { label: '放行', value: '观察后再放行' }
  ];

  const fieldSimpleCards = [
    { label: '湿度', value: '87.4%RH' }, { label: 'CO2', value: '1720ppm' },
    { label: '巡检', value: '2项' }, { label: '报警', value: '1项' }
  ];

  const groupedNotifications = [
    { group: '生产报警', count: 1, detail: 'CO2预警' },
    { group: '设备维护', count: 1, detail: '新风复测待处理' },
    { group: '审批流程', count: 1, detail: '湿度阈值待处理' },
    { group: '交接班', count: 0, detail: '无新事项' }
  ];

  const todayTasks = [
    { name: '确认 CO2 预警（CO2-TOP-001 当前 1720ppm）', owner: '种植员', due: '09:30', status: '待处理', evidence: '报警事件', reviewer: '班组长' },
    { name: '检查加湿水位和雾化流量（HUM-01 流量点）', owner: '种植员', due: '10:00', status: '待处理', evidence: '巡检工单', reviewer: '班组长' },
    { name: '复核下层 TH-L2-002 湿度并记录结果', owner: '值班员', due: '11:40', status: '处理中', evidence: '复核记录表', reviewer: '种植负责人' },
    { name: '新风风机运行状态与通风口响应检查，完成后关闭工单', owner: '运维员', due: '本周', status: '待处理', evidence: '设备工单', reviewer: '运维负责人' }
  ];

  const handoverItems = [
    { label: '当前警报', value: '1项CO2预警待处理' },
    { label: '巡检完成率', value: '66%' },
    { label: '关键参数', value: '湿度87.4% / CO2 1720ppm' },
    { label: '待办遗留', value: '新风复测工单未派发' }
  ];

  const workOrders = [
    { id: 'WO-001', source: 'CO2-TOP-001 预警 1720ppm', level: 'P1', status: '待处理', suggestion: '核查新风风机运行状态，10 分钟内复查 CO2 回落曲线并关闭工单', owner: '种植员', reviewer: '班组长', due: '09:30' },
    { id: 'WO-002', source: 'TH-L2-002 湿度偏低 84.9%RH', level: 'P2', status: '处理中', suggestion: '检查加湿水位 HUM-01 和雾化流量，记录恢复耗时', owner: '值班员', reviewer: '种植负责人', due: '11:40' }
  ];

  return {
    taskFilterOptions,
    simplifiedModes,
    userTodoSummary,
    roleWorkbenchCards,
    executiveSimpleCards,
    fieldSimpleCards,
    groupedNotifications,
    todayTasks,
    handoverItems,
    workOrders,
    approvalRecords,
    loginRoles,
    settingGroups,
    demoScenarios,
    statusColorStandards,
    bulkActionEntries,
    noteCards,
    exportShortcuts,
    keyboardHints,
    userQuickActions,
    favoritePages,
    recentObjects,
    taskPriorityQueue,
    confirmationCards,
    onboardingSteps,
    enhancedSearchCategories,
    userOperationHistory,
    conceptHelpCenter,
    pageStateSamples,
    feedbackEntries,
    weakNetworkStatus,
    userPreferenceItems,
    terminologyModes,
    plantingLogs,
    inspectionChecklist,
    inspectionSchedule,
    sopGuides,
    stageChecklist
  };
}
