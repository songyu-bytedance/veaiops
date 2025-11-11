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
 * 数据源连接表格配置 Hook
 *
 * 整合 useBusinessTable 和各个配置 hook
 */

import { type OperationWrappers, useBusinessTable } from '@veaiops/components';
import {
  createLocalDataSource,
  createStandardTableProps,
} from '@veaiops/utils';
import type { Connect } from '@veaiops/api-client';
import { useMemo } from 'react';
import { useConnectionTableActions } from '../ui/tables/components/connection-table-actions';
import { useConnectionTableColumns } from '../ui/tables/components/connection-table-columns';
import { useConnectionTableFilters } from '../ui/tables/components/connection-table-filters';

/**
 * 数据源连接表格配置 Hook
 * 提供完整的表格配置（已集成 useBusinessTable）
 */
export const useConnectionTableConfig = ({
  type,
  connects,
  onEdit,
  onDelete,
  onTest,
  onCreateMonitor,
  onRefresh,
}: {
  type?: string;
  connects: Connect[];
  onEdit?: (connection: Connect) => void;
  onDelete?: (id: string) => void;
  onTest?: (connection: Connect) => void;
  onCreateMonitor?: (connection: Connect) => void;
  onRefresh?: () => void;
}) => {
  // 🎯 使用工具函数创建本地数据源
  const dataSource = useMemo(
    () => createLocalDataSource({ dataList: connects, ready: true }),
    [connects],
  );

  // 🎯 使用工具函数创建表格属性
  const tableProps = useMemo(
    () =>
      createStandardTableProps({
        rowKey: '_id',
        pageSize: 10,
        scrollX: 1200,
      }),
    [],
  );

  // 🎯 使用 useBusinessTable 集成所有逻辑（本地数据模式）
  const { customTableProps } = useBusinessTable({
    dataSource,
    tableProps,
    refreshConfig: {
      enableRefreshFeedback: false, // 本地数据不需要刷新反馈
    },
    // 🎯 自定义操作包装逻辑，支持复杂场景（这里主要是查看和操作，不需要删除）
    operationWrapper: (_: OperationWrappers) => ({}),
  });

  // 🎯 获取各个配置
  const handleColumns = useConnectionTableColumns({
    type,
    onEdit,
    onDelete,
    onTest,
    onCreateMonitor,
  });

  const handleFilters = useConnectionTableFilters();

  const renderActions = useConnectionTableActions({
    onRefresh,
  });

  return {
    customTableProps,
    handleColumns,
    handleFilters,
    renderActions,
  };
};
