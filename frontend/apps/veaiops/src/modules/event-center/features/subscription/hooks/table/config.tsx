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
 * 订阅关系表格配置 Hook
 *
 * 🎯 按照最佳实践实现Hook聚合模式 + 自动刷新机制
 * 🎯 优先使用标准类型: @veaiops/components 和 api-generate
 */

// ✅ 保持独立：组件和 icon 来自不同子包
import { Button, Message } from '@arco-design/web-react';
import { IconPlus, IconRefresh } from '@arco-design/web-react/icon';
// ✅ 优化：使用最短路径，合并同源导入
import {
  getSubscriptionColumns,
  getSubscriptionFilters,
  subscriptionService,
} from '@ec/subscription';
import {
  type BaseQuery,
  type CustomTableActionType,
  type FieldItem,
  type HandleFilterProps,
  type ModernTableColumnProps,
  type OperationWrappers,
  type QueryValue,
  useBusinessTable,
} from '@veaiops/components';
import { API_RESPONSE_CODE } from '@veaiops/constants';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
} from '@veaiops/utils';
import type { SubscribeRelationWithAttributes } from 'api-generate';
// ✅ 同源合并：react
import React, { useCallback, useMemo } from 'react';

/**
 * 订阅关系查询参数类型 (扩展自 BaseQuery)
 */
export interface SubscriptionQueryParams extends BaseQuery {
  name?: string;
  agent_type?: string;
  event_level?: string;
  agents?: string[];
  event_levels?: string[];
  enable_webhook?: boolean;
  products?: string[];
  projects?: string[];
  customers?: string[];
  show_all?: boolean;
}

/**
 * 订阅关系表格配置 Hook 参数类型
 */
export interface UseSubscriptionTableConfigOptions {
  onEdit?: (subscription: SubscribeRelationWithAttributes) => void;
  onDelete?: (subscriptionId: string) => Promise<boolean>;
  onCreate?: () => void;
  onToggleStatus?: (
    subscriptionId: string,
    isActive: boolean,
  ) => Promise<boolean>;
  onRefresh?: () => void;
  ref?: React.Ref<
    CustomTableActionType<
      SubscribeRelationWithAttributes,
      SubscriptionQueryParams
    >
  >;
}

/**
 * 订阅关系表格配置 Hook 返回值类型
 */
export interface UseSubscriptionTableConfigReturn {
  customTableProps: ReturnType<typeof useBusinessTable>['customTableProps'];
  customOperations: ReturnType<typeof useBusinessTable>['customOperations'];
  handleColumns: (
    props?: Record<string, QueryValue>,
  ) => ModernTableColumnProps<SubscribeRelationWithAttributes>[];
  handleFilters: (
    props: HandleFilterProps<SubscriptionQueryParams>,
  ) => FieldItem[];
  renderActions: (props?: Record<string, QueryValue>) => JSX.Element[];
}

/**
 * 订阅关系表格配置 Hook
 *
 * 提供完整的表格配置（已集成 useBusinessTable 和 operationWrapper 自动刷新）
 */
export const useSubscriptionTableConfig = ({
  onEdit,
  onDelete,
  onCreate,
  onToggleStatus,
  onRefresh,
  ref,
}: UseSubscriptionTableConfigOptions): UseSubscriptionTableConfigReturn => {
  // 🎯 请求函数 - 使用工具函数
  // ✅ 关键修复：使用 useMemo 稳定化 request 函数引用
  const request = useMemo(
    () =>
      createTableRequestWithResponseHandler({
        apiCall: async ({ skip, limit, ...otherParams }) => {
          const response = await subscriptionService.getSubscriptions({
            ...otherParams,
            skip,
            limit,
          } as SubscriptionQueryParams);

          // 类型转换：PaginatedAPIResponseSubscribeRelationList 与 StandardApiResponse<SubscribeRelationWithAttributes[]> 结构兼容
          return response as unknown as StandardApiResponse<
            SubscribeRelationWithAttributes[]
          >;
        },
        options: {
          errorMessagePrefix: '加载订阅关系列表失败',
          defaultLimit: 10,
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '加载订阅关系列表失败，请重试';
            Message.error(errorMessage);
          },
        },
      }),
    [], // ✅ 空依赖数组，request 函数保持稳定
  );

  // 添加渲染日志

  // 🎯 数据源配置 - 使用工具函数
  const dataSource = useMemo(() => {
    return createServerPaginationDataSource({ request });
  }, [request]);

  // 🎯 表格属性配置 - 使用工具函数
  const tableProps = useMemo(
    () =>
      createStandardTableProps({
        rowKey: '_id',
        pageSize: 10,
        scrollX: 2300,
      }) as Record<string, unknown>,
    [],
  );

  // 🎯 使用 useBusinessTable 集成所有逻辑
  const { customTableProps, customOperations } =
    useBusinessTable<SubscriptionQueryParams>({
      dataSource,
      tableProps,
      ref: ref ? (ref as React.Ref<CustomTableActionType>) : undefined,
      refreshConfig: {
        enableRefreshFeedback: true,
        successMessage: '操作成功',
        errorMessage: '操作失败，请重试',
      },
      operationWrapper: ({ wrapUpdate, wrapDelete }: OperationWrappers) => ({
        handleEdit: (..._args: unknown[]) =>
          wrapUpdate(async () => {
            // operationWrapper暂不需要实际调用，仅用于自动刷新
          }),
        handleDelete: (..._args: unknown[]) =>
          wrapDelete(async (_id: string): Promise<boolean> => {
            // operationWrapper暂不需要实际调用，仅用于自动刷新
            return true;
          }),
      }),
    });

  // 🎯 获取列配置
  const handleColumns = useCallback(
    (
      props?: Record<string, QueryValue>,
    ): ModernTableColumnProps<SubscribeRelationWithAttributes>[] =>
      getSubscriptionColumns({
        showModuleTypeColumn: props?.showModuleTypeColumn,
        onEdit,
        onDelete,
        onToggleStatus,
      }),
    [onEdit, onDelete, onToggleStatus],
  );

  // 🎯 获取筛选器配置
  const handleFilters = useCallback(
    (props: HandleFilterProps<BaseQuery>): FieldItem[] => {
      return getSubscriptionFilters({
        query: props.query,
        handleChange: props.handleChange,
        moduleType: undefined, // 使用默认值
      });
    },
    [],
  );

  // 🎯 获取操作按钮配置
  const renderActions = useCallback(
    (_props?: Record<string, QueryValue>): JSX.Element[] =>
      [
        onCreate && (
          <Button
            key="create"
            type="primary"
            icon={<IconPlus />}
            onClick={onCreate}
          >
            新建订阅
          </Button>
        ),
        onRefresh && (
          <Button key="refresh" icon={<IconRefresh />} onClick={onRefresh}>
            刷新
          </Button>
        ),
      ].filter((item): item is JSX.Element => Boolean(item)),
    [onCreate, onRefresh],
  );

  return {
    customTableProps,
    customOperations,
    handleColumns,
    handleFilters,
    renderActions,
  };
};
