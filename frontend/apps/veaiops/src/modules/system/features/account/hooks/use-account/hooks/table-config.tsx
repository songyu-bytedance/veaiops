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
import { Message } from '@arco-design/web-react';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
} from '@veaiops/utils';
import type { User } from 'api-generate';
import { useMemo } from 'react';

/**
 * 账号表格配置Hook参数
 */
interface UseAccountTableConfigParams {
  handleEdit?: (user: User) => void;
  handleDelete?: (userId: string) => Promise<boolean>;
}

/**
 * 账号表格配置Hook
 * 提供数据源配置和表格属性配置
 */
export const useAccountTableConfig = ({
  handleEdit: _handleEdit,
  handleDelete: _handleDelete,
}: UseAccountTableConfigParams) => {
  // 🎯 请求函数 - 使用工具函数
  const request = useMemo(
    () =>
      createTableRequestWithResponseHandler({
        apiCall: async ({ skip, limit }) => {
          const response = await apiClient.users.getApisV1UserUser({
            skip: skip || 0,
            limit: limit || 10,
          });
          return response as unknown as StandardApiResponse<User[]>;
        },
        options: {
          errorMessagePrefix: '获取用户列表失败',
          defaultLimit: 10,
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '获取用户列表失败，请重试';
            Message.error(errorMessage);
          },
        },
      }),
    [],
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
        scrollX: 1200,
      }),
    [],
  );

  return {
    dataSource,
    tableProps,
  };
};
