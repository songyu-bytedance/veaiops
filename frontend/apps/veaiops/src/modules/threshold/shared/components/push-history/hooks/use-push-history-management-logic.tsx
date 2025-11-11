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

import { ModuleType } from '@/types/module';
import apiClient from '@/utils/api-client';
import { Button, Message } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';
import { AGENT_OPTIONS_FILTER } from '@veaiops/constants';
import { useManagementRefresh } from '@veaiops/hooks';
import {
  type ApiPaginationParams,
  convertTableSortToApi,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
} from '@veaiops/utils';
import type { Event } from 'api-generate';
import { AgentType, EventShowStatus } from 'api-generate';
import { useMemo } from 'react';

/**
 * 历史事件管理逻辑Hook
 * 提供历史事件管理页面的所有业务逻辑
 */
export const usePushHistoryManagementLogic = (
  moduleType: ModuleType,
  refreshTable?: () => Promise<boolean>,
) => {
  // 使用管理刷新 Hook
  useManagementRefresh(refreshTable);

  return {
    moduleType,
  };
};

/**
 * 表格请求参数类型
 * 包含分页、排序和筛选参数
 *
 * 注意：CustomTable 使用 sort_columns 格式（不是 sorter）
 * sort_columns: [{ column: "created_at", desc: false }]
 * 排序参数转换使用 convertTableSortToApi 工具函数
 *
 * 字段命名规范：
 * - 使用 snake_case（agent_type, show_status, start_time, end_time）
 * - 与后端接口参数命名保持一致
 */
interface PushHistoryRequestParams {
  skip?: number;
  limit?: number;
  agent_type?: string[];
  sort_columns?: unknown; // 使用 convertTableSortToApi 处理
  show_status?: EventShowStatus[];
  start_time?: string;
  end_time?: string;
  [key: string]: unknown;
}

/**
 * 类型守卫：检查值是否为有效的 AgentType
 *
 * 参考 Modern.js 的类型守卫模式（packages/toolkit/utils/src/cli/is/type.ts）
 * 使用类型守卫替代类型断言，提供类型安全保障
 */
function isAgentType(value: unknown): value is AgentType {
  if (typeof value !== 'string') {
    return false;
  }
  // 使用 Object.values 获取所有枚举值，避免使用类型断言
  const validAgentTypes: string[] = Object.values(AgentType);
  return validAgentTypes.includes(value);
}

/**
 * 类型守卫：检查值是否为有效的 AgentType 数组
 */
function isAgentTypeArray(value: unknown): value is AgentType[] {
  return Array.isArray(value) && value.length > 0 && value.every(isAgentType);
}

/**
 * 类型守卫：检查值是否为有效的 EventShowStatus
 *
 * EventShowStatus 是字符串枚举，值为中文：
 * PENDING = '等待发送', SUCCESS = '发送成功', NOT_SUBSCRIBED = '未订阅' 等
 */
function isEventShowStatus(value: unknown): value is EventShowStatus {
  if (typeof value !== 'string') {
    return false;
  }
  // 使用 Object.values 获取所有枚举值，避免使用类型断言
  const validStatuses: string[] = Object.values(EventShowStatus);
  return validStatuses.includes(value);
}

/**
 * 类型守卫：检查值是否为有效的 EventShowStatus 数组
 */
function isEventShowStatusArray(value: unknown): value is EventShowStatus[] {
  return (
    Array.isArray(value) && value.length > 0 && value.every(isEventShowStatus)
  );
}

/**
 * 历史事件表格配置Hook
 */
export const usePushHistoryTableConfig = ({
  moduleType,
  showModuleTypeColumn = true,
}: {
  moduleType: ModuleType;
  showModuleTypeColumn?: boolean;
}) => {
  // 🎯 请求函数 - 使用工具函数
  const request = useMemo(
    () =>
      createTableRequestWithResponseHandler({
        apiCall: async ({
          skip,
          limit,
          agent_type: paramAgentType,
          sort_columns,
          ...otherParams
        }: ApiPaginationParams & PushHistoryRequestParams) => {
          // 使用现有的获取规则接口
          // 注意：agent_type 从筛选器或 URL 参数传入（snake_case）
          // 使用类型守卫进行类型验证，替代类型断言（遵循 Modern.js 最佳实践）
          let agentType: AgentType[] | undefined = isAgentTypeArray(
            paramAgentType,
          )
            ? paramAgentType
            : undefined;

          // Oncall 模块：如果未选择智能体，默认使用所有 Oncall 相关的 Agent
          if (
            moduleType === ModuleType.ONCALL &&
            (!agentType || agentType.length === 0)
          ) {
            // 使用类型守卫过滤有效的 AgentType，避免使用类型断言
            const filteredAgentTypes = AGENT_OPTIONS_FILTER.map(
              (item) => item.value,
            ).filter(isAgentType);
            agentType =
              filteredAgentTypes.length > 0 ? filteredAgentTypes : undefined;
          }

          // 智能阈值模块：如果未选择智能体，默认过滤智能阈值 Agent
          if (
            moduleType === ModuleType.INTELLIGENT_THRESHOLD &&
            (!agentType || agentType.length === 0)
          ) {
            agentType = [AgentType.INTELLIGENT_THRESHOLD_AGENT];
          }

          // 处理排序参数 - 使用统一的工具函数转换 sort_columns
          // 只允许 created_at 字段排序
          const sortOrder = convertTableSortToApi({
            sortColumns: sort_columns,
            allowedFields: ['created_at'],
          });

          // 处理筛选参数 - 边界case: 过滤无效值
          // Python 接口只支持 show_status，不支持 status 参数
          // status 是内部字段，通过 show_status 映射而来
          // 使用类型守卫进行类型验证，替代类型断言（遵循 Modern.js 最佳实践）
          const showStatus: EventShowStatus[] | undefined =
            isEventShowStatusArray(otherParams.show_status)
              ? otherParams.show_status
              : undefined;

          // 构建 API 参数 - 使用生成的 API 类型（已包含 sortOrder）
          const apiParams: Parameters<
            typeof apiClient.event.getApisV1ManagerEventCenterEvent
          >[0] = {
            skip: skip ?? 0,
            limit: limit ?? 100,
            // agentType 已通过类型守卫验证为 AgentType[] 类型
            agentType:
              agentType && agentType.length > 0 ? agentType : undefined,
            showStatus,
            // 添加排序参数（生成的 API 类型已包含 sortOrder）
            sortOrder,
          };

          // 添加可选的时间范围参数
          if (
            otherParams.start_time &&
            typeof otherParams.start_time === 'string'
          ) {
            apiParams.startTime = otherParams.start_time;
          }
          if (
            otherParams.end_time &&
            typeof otherParams.end_time === 'string'
          ) {
            apiParams.endTime = otherParams.end_time;
          }

          return await apiClient.event.getApisV1ManagerEventCenterEvent(
            apiParams,
          );
        },
        options: {
          errorMessagePrefix: '获取历史事件失败',
          defaultLimit: 100,
          onError: (error: unknown) => {
            // 边界case: 完善错误处理
            const errorObj =
              error instanceof Error ? error : new Error(String(error));
            const errorMessage = errorObj.message || '未知错误';

            // 只在非取消请求的情况下显示错误提示
            if (
              !errorMessage.includes('cancel') &&
              !errorMessage.includes('abort')
            ) {
              Message.error(`获取历史事件失败：${errorMessage}`);
            }
          },
          transformData<T = Event>(data: unknown): T[] {
            // 转换数据格式，确保每条记录都有唯一 _id
            // 使用类型安全转换：Event[] -> T[]（泛型约束确保类型安全）
            if (Array.isArray(data)) {
              const transformed = data.map((item: Event) => ({
                ...item,
                _id:
                  item._id ??
                  `push_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
              }));
              // 类型转换：Event[] 是 T[] 的具体实现，使用 as unknown as T[] 避免直接断言
              return transformed as unknown as T[];
            }
            return [] as unknown as T[];
          },
        },
      }),
    [moduleType],
  );

  // 🎯 使用工具函数创建数据源
  const dataSource = useMemo(
    () => createServerPaginationDataSource({ request }),
    [request],
  );

  // 🎯 使用工具函数创建表格属性，自定义 showTotal
  const tableProps = useMemo(() => {
    const baseProps = createStandardTableProps({
      rowKey: '_id',
      pageSize: 100,
      scrollX: showModuleTypeColumn ? 1200 : 1000,
    });
    return {
      ...baseProps,
      pagination: {
        ...baseProps.pagination,
        showTotal: (total: number, range: number[]) =>
          `共 ${total} 条记录，当前显示第 ${range[0]}-${range[1]} 条`,
      },
    };
  }, [showModuleTypeColumn]);

  return {
    dataSource,
    tableProps,
  };
};

/**
 * 历史事件操作按钮配置Hook
 */
export const usePushHistoryActionConfig = ({
  loading = false,
  onRefresh,
}: {
  loading?: boolean;
  onRefresh?: () => Promise<boolean>;
}) => {
  const actionButtons = useMemo(
    () => [
      <Button
        key="refresh"
        icon={<IconRefresh />}
        onClick={async () => {
          if (onRefresh) {
            await onRefresh();
          }
        }}
        loading={loading}
      >
        刷新
      </Button>,
    ],
    [loading, onRefresh],
  );

  return {
    actionButtons,
  };
};
