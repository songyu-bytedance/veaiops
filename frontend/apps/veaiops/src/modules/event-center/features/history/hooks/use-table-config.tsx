// Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. and/or its affiliates
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * 历史事件表格配置 Hook
 *
 * 按照最佳实践实现Hook聚合模式 + 自动刷新机制
 */

import { Message } from '@arco-design/web-react';
// ✅ 优化：使用最短路径，合并同源导入
import {
  type HistoryFilters,
  getHistoryColumns,
  getHistoryFilters,
  historyService,
} from '@ec/history';
import {
  type BaseQuery,
  type CustomTableActionType,
  type FieldItem,
  type HandleFilterProps,
  type ModernTableColumnProps,
  useBusinessTable,
} from '@veaiops/components';
import type { FilterValue } from '@veaiops/types';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
} from '@veaiops/utils';
import type { Event } from 'api-generate';
import React, { useCallback, useMemo } from 'react';

/**
 * 历史事件查询参数类型（扩展用于前端表格）
 */
export interface HistoryQueryParams {
  skip?: number;
  limit?: number;
  agentType?: string[];
  eventLevel?: string;
  status?: number[];
  region?: string[];
  projects?: string[];
  products?: string[];
  customers?: string[];
  dateRange?: [string, string];
  [key: string]: FilterValue;
}

/**
 * 查看详情参数接口
 */
/**
 * 历史事件表格配置 Hook 参数类型
 */
export interface UseHistoryTableConfigOptions {
  filters: HistoryFilters;
  // 注意：统一使用 (record: Event) => void 格式，与 HistoryTableProps 保持一致
  onViewDetail?: (record: Event) => void;
  onRefresh?: () => void;
  ref?: React.Ref<CustomTableActionType<Event, BaseQuery>>;
}

/**
 * 历史事件表格配置 Hook 返回值类型
 */
export interface UseHistoryTableConfigReturn {
  customTableProps: ReturnType<typeof useBusinessTable>['customTableProps'];
  operations: ReturnType<typeof useBusinessTable>['operations'];
  handleColumns: (
    props: Record<string, unknown>,
  ) => ModernTableColumnProps<Event>[];
  handleFilters: (
    props: HandleFilterProps<Record<string, unknown>>,
  ) => FieldItem[];
  renderActions: (props?: Record<string, FilterValue>) => JSX.Element[];
}

/**
 * 历史事件表格配置 Hook
 *
 * 提供完整的表格配置（已集成 useBusinessTable）
 */
export const useHistoryTableConfig = ({
  filters,
  onViewDetail,
  onRefresh: _onRefresh,
  ref,
}: UseHistoryTableConfigOptions): UseHistoryTableConfigReturn => {
  // 🎯 请求函数 - 使用工具函数
  const request = useMemo(
    () =>
      createTableRequestWithResponseHandler({
        apiCall: async ({ skip, limit }) => {
          // 将 HistoryFilters (下划线命名) 映射到 HistoryQueryParams (驼峰命名)
          const response = await historyService.getHistoryEvents({
            skip: skip || 0,
            limit: limit || 10,
            // filters.agent_type 是 string[]，需要转换为 API 期望的格式
            // 类型断言：将 HistoryFilters.agent_type (string[]) 转换为 API 期望的字符串字面量数组
            agentType: filters.agent_type as unknown as
              | Array<
                  | 'CHATOPS_INTEREST'
                  | 'CHATOPS_REACTIVE_REPLY'
                  | 'CHATOPS_PROACTIVE_REPLY'
                  | 'INTELLIGENT_THRESHOLD'
                  | 'ONCALL'
                >
              | undefined,
            // filters.event_level 是 string，需要转换为 API 期望的格式
            // 类型断言：将 HistoryFilters.event_level (string) 转换为 API 期望的字符串字面量
            eventLevel:
              (filters.event_level as unknown as
                | 'INFO'
                | 'WARNING'
                | 'ERROR'
                | 'CRITICAL'
                | undefined) || undefined,
            status: filters.status,
            startTime: filters.start_time,
            endTime: filters.end_time,
          });
          // PaginatedAPIResponseEventList 与 StandardApiResponse<Event[]> 结构兼容
          // 注意：类型断言是因为 PaginatedAPIResponseEventList 结构上与 StandardApiResponse 兼容
          return response as unknown as StandardApiResponse<Event[]>;
        },
        options: {
          errorMessagePrefix: '加载历史事件失败',
          defaultLimit: 10,
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '加载历史事件失败，请重试';
            Message.error(errorMessage);
          },
        },
      }),
    [filters],
  );

  // 🎯 数据源配置 - 使用工具函数
  const dataSource = useMemo(
    () => createServerPaginationDataSource({ request }),
    [request],
  );

  // 🎯 表格属性配置 - 使用工具函数
  const tableProps = useMemo(
    () =>
      createStandardTableProps({
        rowKey: '_id',
        pageSize: 10,
        scrollX: 1600,
      }) as Record<string, unknown>,
    [],
  );

  // 🎯 使用 useBusinessTable 集成所有逻辑
  // 注意：ref 类型使用断言适配，因为 useBusinessTable 的 ref 类型是通用的 CustomTableActionType
  // ✅ 修复：useBusinessTable 现在支持泛型参数，类型完全匹配
  const { customTableProps, operations } = useBusinessTable<
    HistoryQueryParams,
    Event,
    BaseQuery
  >({
    dataSource,
    tableProps,
    refreshConfig: {
      enableRefreshFeedback: false,
    },
    // ✅ 修复：ref 类型已支持泛型参数，无需使用 as any
    ref,
  });

  // 🎯 获取列配置
  const handleColumns = useCallback(
    (props: Record<string, unknown>): ModernTableColumnProps<Event>[] =>
      getHistoryColumns({
        // getHistoryColumns 期望 onViewDetail?: (record: Event) => void
        // useHistoryTableConfig 接口也定义为 (record: Event) => void，直接传递即可
        onViewDetail,
      }),
    [onViewDetail],
  );

  // 🎯 获取筛选器配置
  // 注意：HandleFilterProps<HistoryQueryParams> 兼容 HandleFilterProps<BaseQuery>
  const handleFilters = useCallback(
    (props: HandleFilterProps<Record<string, unknown>>): FieldItem[] =>
      getHistoryFilters(props as HandleFilterProps<HistoryQueryParams>),
    [],
  );

  // 🎯 获取操作按钮配置
  // 注意：刷新按钮在 history-table.tsx 中配置，这里不需要 renderActions
  const renderActions = useCallback(
    (_props?: Record<string, FilterValue>): JSX.Element[] => [],
    [],
  );

  return {
    customTableProps,
    operations,
    handleColumns,
    handleFilters,
    renderActions,
  };
};
