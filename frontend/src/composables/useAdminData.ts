/**
 * 管理支撑模块数据 composable
 * 包含合规审计、历史查询、数据质量、报表等静态数据
 */
import {
  thresholdChangeRecords,
  apiDocs as apiDocsList
} from '../data/mock-business';

export function useAdminData() {
  const complianceAudit = [
    { item: '传感器台账完整性', result: '通过', detail: '68个点位已录入', status: '已闭环', owner: '管理员', reviewer: '管理者' },
    { item: '批次生命周期覆盖', result: '待补全', detail: '采收/清舱记录预留', status: '待处理', owner: '种植负责人', reviewer: '管理者' },
    { item: '报警闭环率', result: '部分', detail: '1项复核中', status: '处理中', owner: '班组长', reviewer: '管理者' }
  ];

  const historyQueries = [
    { name: '近24小时温湿度', points: 'TH-MAIN-001至004', range: '近24小时', status: '已保存' },
    { name: 'CO2回落趋势', points: 'CO2-TOP-001', range: '近7天', status: '已保存' }
  ];

  return {
    complianceAudit,
    historyQueries,
    thresholdChangeRecords,
    apiDocsList
  };
}
