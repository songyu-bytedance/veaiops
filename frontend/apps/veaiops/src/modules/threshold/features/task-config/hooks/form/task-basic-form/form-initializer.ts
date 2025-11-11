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

import { useTaskConfigStore } from '@/stores/task-config-store';
import type { FormInstance } from '@arco-design/web-react/es/Form';
import { logger } from '@veaiops/utils';
import type {
  IntelligentThresholdTask,
  IntelligentThresholdTaskDetail,
} from '@veaiops/api-client';
import { useEffect } from 'react';

interface UseFormInitializerParams {
  form: FormInstance;
  operationType: string;
  datasourceType?: string;
  setDatasourceType: (type: string) => void;
}

/**
 * 表单初始化 Hook
 */
export const useFormInitializer = ({
  form,
  operationType,
  datasourceType,
  setDatasourceType,
}: UseFormInitializerParams) => {
  // 从 Zustand store 获取当前编辑的任务和筛选器数据源类型
  const { taskDrawer, filterDatasourceType } = useTaskConfigStore();
  const editingTask:
    | IntelligentThresholdTask
    | IntelligentThresholdTaskDetail
    | undefined = taskDrawer.record;

  // 当打开抽屉且有编辑任务时，初始化表单数据
  useEffect(() => {
    if (taskDrawer.visible && operationType === 'copy' && editingTask) {
      // 复制任务时，填充表单数据
      // ✅ 现在使用详情数据（IntelligentThresholdTaskDetail），包含 latest_version
      const taskDetail = editingTask as IntelligentThresholdTaskDetail;
      const newDatasourceType = taskDetail.datasource_type || 'Volcengine';

      logger.info({
        message: '📋 表单初始化（复制任务）',
        data: {
          taskName: taskDetail.task_name,
          templateId: taskDetail.template_id,
          hasLatestVersion: Boolean(taskDetail.latest_version),
          hasMetricTemplateValue: Boolean(
            taskDetail.latest_version?.metric_template_value,
          ),
          direction: taskDetail.latest_version?.direction,
          nCount: taskDetail.latest_version?.n_count,
        },
        source: 'TaskBasicForm',
        component: 'useFormInitializer',
      });

      form.setFieldsValue({
        taskName: taskDetail.task_name
          ? `${taskDetail.task_name}_副本`
          : '新任务_副本',
        datasourceType: newDatasourceType,
        datasourceId: taskDetail.datasource_id,
        // ✅ 关键：设置 template_id（指标模版）
        template: taskDetail.template_id,
        projects: taskDetail.projects || [],
        products: taskDetail.products || [],
        customers: taskDetail.customers || [],
        // ✅ 使用 latest_version 的数据
        direction: taskDetail.latest_version?.direction || 'both',
        nCount: taskDetail.latest_version?.n_count || 3,
        // ✅ 关键：设置 metric_template_value（阈值上下界）
        metric_template_value: taskDetail.latest_version?.metric_template_value,
      });
      setDatasourceType(newDatasourceType);
    } else if (
      taskDrawer.visible &&
      operationType === 'create' &&
      !editingTask
    ) {
      // 新建任务时，从筛选器联动数据源类型，如果筛选器未选择则默认为 Volcengine
      const defaultDatasourceType = filterDatasourceType || 'Volcengine';
      form.setFieldsValue({ nCount: 3, datasourceType: defaultDatasourceType });
      setDatasourceType(defaultDatasourceType);
    }
  }, [
    taskDrawer.visible,
    operationType,
    editingTask,
    form,
    filterDatasourceType,
    setDatasourceType,
  ]);
};
