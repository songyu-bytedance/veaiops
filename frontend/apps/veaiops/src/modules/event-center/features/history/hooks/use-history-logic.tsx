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

import apiClient from '@/utils/api-client';
import { Button, Message } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
} from '@veaiops/utils';
import type { Event, EventShowStatus } from 'api-generate';
import { useMemo, useState } from 'react';

/**
 * 历史事件过滤器类型
 * 使用下划线命名，对应前端 UI 层
 * 与 filter.tsx 中定义的筛选器一一对应
 */
export interface HistoryFilters {
  /** 智能体类型 */
  agent_type?: string[];
  /** 事件级别 */
  event_level?: string;
  /** 状态（中文） */
  show_status?: EventShowStatus[];
  /** 事件状态（枚举值） */
  status?: number[];
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
}

/**
 * 历史事件管理逻辑Hook
 * 提供历史事件的状态管理和业务逻辑
 */
export const useHistoryManagementLogic = () => {
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Event | null>(null);

  const handleViewDetail = (record: Event) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const handleCloseDetail = () => {
    setDrawerVisible(false);
    setSelectedRecord(null);
  };

  const updateFilters = (newFilters: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    drawerVisible,
    selectedRecord,
    handleViewDetail,
    handleCloseDetail,
    updateFilters,
  };
};

/**
 * 历史事件表格配置Hook
 * 提供CustomTable所需的数据源配置
 *
 * ✅ 已使用工具函数：
 * - createTableRequestWithResponseHandler: 自动处理分页参数和响应
 * - createServerPaginationDataSource: 创建服务器端分页数据源
 * - createStandardTableProps: 创建标准表格属性
 */
/**
 * ❌ 移除导出：useHistoryTableConfig 已在 use-table-config.tsx 中定义
 * - 避免重复导出冲突
 * - 遵循单一数据源原则
 *
 * 注意：此函数仅在 use-history-logic.tsx 内部使用
 * 如需使用完整的 useHistoryTableConfig，请从 use-table-config.tsx 导入
 */
const useHistoryTableConfigInternal = ({
  filters,
}: {
  filters: HistoryFilters;
}) => {
  // 🎯 请求函数 - 使用工具函数
  const request = useMemo(
    () =>
      createTableRequestWithResponseHandler({
        apiCall: async ({ skip, limit }) => {
          const apiParams: Parameters<
            typeof apiClient.event.getApisV1ManagerEventCenterEvent
          >[0] = {
            skip: skip ?? 0,
            limit: limit ?? 10,
          };

          // 处理代理类型（API 支持数组）
          if (filters.agent_type && filters.agent_type.length > 0) {
            apiParams.agentType = filters.agent_type as any;
          }

          // 处理事件级别
          if (filters.event_level && filters.event_level !== '') {
            apiParams.eventLevel = filters.event_level as any;
          }

          // 处理状态（中文）
          if (filters.show_status && filters.show_status.length > 0) {
            apiParams.showStatus = filters.show_status;
          }

          // 处理事件状态（使用 status 参数，对应后端的 event_status）
          // 注意：API 参数中没有 status 字段，可能在后端还没有实现，暂时移除
          // if (filters.status && filters.status.length > 0) {
          //   apiParams.status = filters.status;
          // }

          // 处理时间范围
          if (filters.start_time) {
            apiParams.startTime = filters.start_time;
          }
          if (filters.end_time) {
            apiParams.endTime = filters.end_time;
          }

          const response =
            await apiClient.event.getApisV1ManagerEventCenterEvent(apiParams);
          // PaginatedAPIResponseEventList 与 StandardApiResponse<Event[]> 兼容
          return response as unknown as StandardApiResponse<Event[]>;
        },
        options: {
          errorMessagePrefix: '获取历史事件失败',
          defaultLimit: 10,
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '获取历史事件失败，请重试';
            Message.error(errorMessage);
          },
          transformData: <T = Event>(data: unknown): T[] => {
            // 转换数据格式，添加 key 字段
            if (Array.isArray(data)) {
              return data.map((item: Event) => ({
                ...item,
                key: item._id || Math.random().toString(),
              })) as T[];
            }
            return [];
          },
        },
      }),
    [filters],
  );

  // 🎯 使用工具函数创建数据源
  const dataSource = useMemo(
    () => createServerPaginationDataSource({ request }),
    [request],
  );

  // 🎯 使用工具函数创建表格属性
  const tableProps = useMemo(
    () =>
      createStandardTableProps({
        rowKey: '_id',
        pageSize: 10,
        scrollX: 1600,
      }),
    [],
  );

  return {
    dataSource,
    tableProps,
  };
};

/**
 * 历史事件操作按钮配置Hook
 * 提供表格工具栏操作按钮配置
 */
export const useHistoryActionConfig = (
  onRefresh: () => void,
  _onExport?: () => void,
) => {
  const actions = [
    <Button
      key="refresh"
      type="secondary"
      icon={<IconRefresh />}
      onClick={onRefresh}
    >
      刷新
    </Button>,
  ];

  return { actions };
};
