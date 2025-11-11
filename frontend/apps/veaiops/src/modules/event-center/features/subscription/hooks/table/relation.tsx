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
 * ✅ 修复：从 ui/subscribe-relation-table/use-relation-table.tsx 移动到 hooks/table/relation.tsx
 */

import apiClient from '@/utils/api-client';
// ✅ 同源合并：@arco-design/web-react
import { Button, Message } from '@arco-design/web-react';
// ✅ icon 来自不同子包，保持独立
import { IconPlus, IconRefresh } from '@arco-design/web-react/icon';
import { API_RESPONSE_CODE } from '@veaiops/constants';
import { ModuleType } from '@veaiops/types';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
} from '@veaiops/utils';
import type { SubscribeRelationWithAttributes } from 'api-generate';

/**
 * 表格配置 Hook
 */
export const useSubscribeRelationTableConfig = ({
  moduleType,
}: {
  moduleType: string;
}) => {
  /**
   * CustomTable的request函数
   * 使用工具函数自动处理分页参数、响应和错误
   */
  const request = createTableRequestWithResponseHandler({
    apiCall: async ({
      skip,
      limit,
      name,
      agents,
      eventLevels,
      enableWebhook,
      projects,
    }) => {
      const response =
        await apiClient.subscribe.getApisV1ManagerEventCenterSubscribe({
          agents:
            (agents as string[] | undefined) ||
            (moduleType === ModuleType.EVENT_CENTER
              ? undefined
              : ['intelligent_threshold_agent']),
          skip,
          limit,
          name: name as string | undefined,
          event_levels: eventLevels as string[] | undefined,
          enable_webhook: enableWebhook as boolean | undefined,
          projects: projects as string[] | undefined,
        });
      // 类型转换：PaginatedAPIResponseSubscribeRelationList 与 StandardApiResponse<SubscribeRelationWithAttributes[]> 结构兼容
      return response as unknown as StandardApiResponse<
        SubscribeRelationWithAttributes[]
      >;
    },
    options: {
      errorMessagePrefix: '获取订阅关系列表失败',
      defaultLimit: 10,
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '加载订阅关系列表失败，请重试';
        Message.error(errorMessage);
      },
    },
  });

  // 🎯 使用工具函数创建数据源
  const dataSource = createServerPaginationDataSource({ request });

  // 🎯 使用工具函数创建表格属性
  const tableProps = createStandardTableProps({
    rowKey: '_id',
    pageSize: 10,
    scrollX: 1200,
  });

  return {
    dataSource,
    tableProps,
  };
};

/**
 * 操作按钮配置 Hook
 */
export const useSubscribeRelationActionConfig = ({
  onCreate,
  onRefresh,
  loading,
}: {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}) => {
  return {
    actions: [
      <Button
        key="create"
        type="primary"
        icon={<IconPlus />}
        onClick={onCreate}
      >
        新建订阅关系
      </Button>,
      <Button
        key="refresh"
        icon={<IconRefresh />}
        onClick={onRefresh}
        loading={loading}
      >
        刷新
      </Button>,
    ],
  };
};
