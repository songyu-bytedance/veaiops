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

import { logger } from '@veaiops/utils';
import type { IntelligentThresholdTask } from 'api-generate';
import { useMemo } from 'react';
import type { TaskTableActions } from '../../lib';

interface UseTableActionsParams {
  handleTaskDetail?: (task: IntelligentThresholdTask) => void;
}

/**
 * 表格操作配置 Hook
 */
export const useTableActions = ({
  handleTaskDetail,
}: UseTableActionsParams): TaskTableActions => {
  // 🎯 构造表格操作配置 - 使用传入的回调函数
  const tableActions: TaskTableActions = useMemo(
    () => ({
      onAdd: async (): Promise<boolean> => {
        // 新增任务 - 由调用方实现
        return true;
      },
      onTaskDetail:
        handleTaskDetail ||
        (() => {
          // 任务详情 - 由调用方实现
        }),
      onRerun: () => {
        // 重新执行 - 由调用方实现
      },
      onViewVersions: () => {
        // 查看版本 - 由调用方实现
      },
      onCreateAlarm: () => {
        // 创建告警 - 由调用方实现
      },
      onCopy: () => {
        // 复制任务 - 由调用方实现
      },
      onBatchRerun: () => {
        // 批量重新执行 - 由调用方实现
      },
      onDelete: async (taskId: string): Promise<boolean> => {
        // ✅ 正确：使用 logger 记录信息
        logger.info({
          message: '删除任务',
          data: { taskId },
          source: 'useManagementLogic',
          component: 'onDelete',
        });
        // 删除任务 - 由调用方实现
        return true;
      },
    }),
    [handleTaskDetail],
  );

  return tableActions;
};
