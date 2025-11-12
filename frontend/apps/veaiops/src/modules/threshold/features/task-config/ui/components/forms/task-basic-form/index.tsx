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

import { Form, type FormInstance } from '@arco-design/web-react';
import { useDataSources, useFormInitializer } from '@task-config/hooks';
import { logger } from '@veaiops/utils';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MetricTemplateForm } from '../../../shared-forms';
import { BasicInfoFields } from './sections';
import type { TaskBasicFormProps } from './types';

/**
 * 任务基本信息表单组件
 */
export const TaskBasicForm: React.FC<TaskBasicFormProps> = ({
  form,
  loading,
  onSubmit,
  operationType,
}) => {
  const [datasourceType, setDatasourceType] = useState<string | undefined>(
    form.getFieldValue('datasourceType') || 'Volcengine',
  );

  // 🔍 添加日志：追踪表单字段 datasourceType 的值变化
  useEffect(() => {
    const formDatasourceType = form.getFieldValue('datasourceType');
    logger.info({
      message: '[TaskBasicForm] 表单字段 datasourceType 值变化',
      data: {
        formFieldValue: formDatasourceType,
        stateValue: datasourceType,
        valuesMatch: formDatasourceType === datasourceType,
        timestamp: Date.now(),
      },
      source: 'TaskBasicForm',
      component: 'useEffect_formField',
    });
  }, [form, datasourceType]);

  // 数据源配置
  const { datasourceDataSource, templateDataSource, projectsDataSource } =
    useDataSources(datasourceType);

  // 🔍 添加调试日志：监控 datasourceType 和 datasourceDataSource 的变化
  useEffect(() => {
    const formDatasourceType = form.getFieldValue('datasourceType');
    logger.info({
      message:
        '[TaskBasicForm] datasourceType 状态或 datasourceDataSource 变化',
      data: {
        datasourceTypeState: datasourceType,
        formFieldValue: formDatasourceType,
        valuesMatch: formDatasourceType === datasourceType,
        datasourceDataSource: datasourceDataSource
          ? {
              api: (datasourceDataSource as any).api,
              hasServiceInstance: Boolean(
                (datasourceDataSource as any).serviceInstance,
              ),
              responseEntityKey: (datasourceDataSource as any)
                .responseEntityKey,
            }
          : null,
        timestamp: Date.now(),
      },
      source: 'TaskBasicForm',
      component: 'useEffect',
    });
  }, [datasourceType, datasourceDataSource, form]);

  // 表单初始化
  useFormInitializer({
    form,
    operationType,
    datasourceType,
    setDatasourceType,
  });

  // 🔍 添加日志：追踪传递给 BasicInfoFields 的 props
  useEffect(() => {
    const formDatasourceType = form.getFieldValue('datasourceType');
    logger.info({
      message: '[TaskBasicForm] 传递给 BasicInfoFields 的 props',
      data: {
        datasourceTypeProp: datasourceType,
        formFieldValue: formDatasourceType,
        hasDatasourceDataSource: Boolean(datasourceDataSource),
        datasourceDataSourceApi: datasourceDataSource
          ? (datasourceDataSource as any).api
          : undefined,
        timestamp: Date.now(),
      },
      source: 'TaskBasicForm',
      component: 'useEffect_props',
    });
  }, [datasourceType, datasourceDataSource, form]);

  // 🔍 添加日志：表单提交前的值检查
  const handleFormSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      logger.info({
        message: '[TaskBasicForm] 表单提交前 - 检查表单值',
        data: {
          operationType,
          formValues: values,
          formFieldDatasourceType: form.getFieldValue('datasourceType'),
          stateDatasourceType: datasourceType,
          valuesMatch:
            form.getFieldValue('datasourceType') === values.datasourceType,
          allFormValues: form.getFieldsValue(),
          timestamp: new Date().toISOString(),
        },
        source: 'TaskBasicForm',
        component: 'handleFormSubmit',
      });

      // 调用实际的 onSubmit
      return await onSubmit(values);
    },
    [form, onSubmit, operationType, datasourceType],
  );

  return (
    <Form
      form={form}
      layout="inline"
      onSubmit={handleFormSubmit}
      disabled={loading}
    >
      <BasicInfoFields
        form={form}
        loading={loading}
        datasourceType={datasourceType}
        setDatasourceType={setDatasourceType}
        datasourceDataSource={datasourceDataSource}
        templateDataSource={templateDataSource}
        projectsDataSource={projectsDataSource}
      />
      {/* MetricTemplateForm - 引入外部组件 */}
      <MetricTemplateForm
        disabled={loading}
        operateType={operationType}
        prefixField="metric_template_value"
      />
    </Form>
  );
};

export default TaskBasicForm;
