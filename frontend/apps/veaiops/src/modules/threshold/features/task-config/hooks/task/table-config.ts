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

import type { BaseQuery, CustomTableActionType } from '@veaiops/components';
import type { IntelligentThresholdTask } from '@veaiops/api-client';
import React from 'react';
import type { TaskFiltersQuery } from '../../lib/filters';
import { useTaskTableConfig } from '../table';
import type { TaskTableProps } from '../../ui/task/types';

/**
 * Hook to manage table configuration and internal ref
 */
export const useTableConfig = (
  props: TaskTableProps,
  customTableRef: React.RefObject<
    CustomTableActionType<
      IntelligentThresholdTask,
      TaskFiltersQuery & BaseQuery
    >
  >,
) => {
  const {
    customTableProps,
    handleColumns,
    handleFilters,
    renderActions,
    operations,
  } = useTaskTableConfig({
    onEdit: async (task) => {
      props.onEdit(task);
      return true;
    },
    onRerun: props.onRerun,
    onViewVersions: props.onViewVersions,
    onCreateAlarm: props.onCreateAlarm,
    onCopy: props.onCopy,
    onAdd: props.onAdd
      ? async () => {
          props.onAdd();
          return true;
        }
      : undefined,
    onBatchRerun: props.onBatchRerun,
    onDelete: props.onDelete,
    handleTaskDetail: props.handleTaskDetail,
    onViewDatasource: props.onViewDatasource,
    selectedTasks: props.selectedTasks,
    // Pass internal ref so useBusinessTable can call CustomTable's refresh
    tableRef: customTableRef,
  });

  return {
    customTableProps,
    handleColumns,
    handleFilters,
    renderActions,
    operations,
  };
};
