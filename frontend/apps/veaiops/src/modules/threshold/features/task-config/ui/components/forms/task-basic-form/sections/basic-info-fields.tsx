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

import { Alert } from '@arco-design/web-react';
import type { FormInstance } from '@arco-design/web-react/es/Form';
import type { OptionInfo } from '@arco-design/web-react/es/Select/interface';
import {
  type DataSourceSetter,
  Input,
  LinkRender,
  Select,
  type SelectDataSourceProps,
  WrapperWithTitle,
} from '@veaiops/components';
import { logger } from '@veaiops/utils';
import { type React, useEffect } from 'react';

interface BasicInfoFieldsProps {
  form: FormInstance;
  loading: boolean;
  datasourceType?: string;
  setDatasourceType: (type: string) => void;
  datasourceDataSource?:
    | DataSourceSetter
    | ((props: SelectDataSourceProps) => Promise<any> | any);
  templateDataSource:
    | DataSourceSetter
    | ((props: SelectDataSourceProps) => Promise<any> | any);
  projectsDataSource:
    | DataSourceSetter
    | ((props: SelectDataSourceProps) => Promise<any> | any);
}

/**
 * 基本信息字段区块
 */
export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  form,
  loading,
  datasourceType,
  setDatasourceType,
  datasourceDataSource,
  templateDataSource,
  projectsDataSource,
}) => {
  // 🔍 添加日志：追踪组件接收的 props 和表单字段值
  useEffect(() => {
    const formDatasourceType = form.getFieldValue('datasourceType');
    logger.info({
      message: '[BasicInfoFields] 组件 props 或表单字段值变化',
      data: {
        datasourceTypeProp: datasourceType,
        formFieldValue: formDatasourceType,
        valuesMatch: formDatasourceType === datasourceType,
        hasDatasourceDataSource: Boolean(datasourceDataSource),
        datasourceDataSourceApi: datasourceDataSource
          ? (datasourceDataSource as any).api
          : undefined,
        timestamp: Date.now(),
      },
      source: 'BasicInfoFields',
      component: 'useEffect',
    });
  }, [form, datasourceType, datasourceDataSource]);

  return (
    <WrapperWithTitle
      title="基本信息"
      level={2}
      contentStyle={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {/* 任务名称 */}
      <Input.Block
        isControl
        inline
        required
        formItemProps={{
          label: '任务名称',
          field: 'taskName',
          rules: [{ required: true, message: '任务名称必填' }],
          extra: '智能阈值任务设置一个唯一且描述性的名称',
        }}
        controlProps={{
          placeholder: '请输入任务名称',
          disabled: loading,
        }}
      />

      {/* 指标模版 */}
      <Select.Block
        isControl
        inline
        required
        formItemProps={{
          label: '指标模版',
          field: 'name',
          rules: [{ required: true, message: '请选择指标模版' }],
          extra: '根据指标类型选择合适的模版，给指标详情初始默认值',
        }}
        controlProps={{
          placeholder: '请选择指标模版',
          disabled: loading,
          isDebouncedFetch: true,
          isCascadeRemoteSearch: true,
          isScrollFetching: true,
          isValueEmptyTriggerOptions: true,
          dataSource: templateDataSource,
          onChange: (_: string, option: OptionInfo | OptionInfo[]) => {
            if (
              option &&
              !Array.isArray(option) &&
              'extra' in option &&
              option.extra
            ) {
              form.setFieldValue('metric_template_value', {
                ...option.extra,
              });
            }
          },
        }}
      />

      {/* 时序数据源类型 */}
      <Select.Block
        isControl
        inline
        required
        formItemProps={{
          label: '监控数据源类型',
          field: 'datasourceType',
          rules: [{ required: true, message: '监控数据源类型必填' }],
          extra: '选择监控数据的来源平台',
        }}
        controlProps={{
          placeholder: '请选择数据源类型',
          onChange: (value: string) => {
            const previousFormValue = form.getFieldValue('datasourceType');
            logger.info({
              message: '[BasicInfoFields] 监控数据源类型字段 onChange 触发',
              data: {
                newDatasourceType: value,
                previousDatasourceTypeState: datasourceType,
                previousFormFieldValue: previousFormValue,
                currentDatasourceId: form.getFieldValue('datasourceId'),
                timestamp: Date.now(),
              },
              source: 'BasicInfoFields',
              component: 'datasourceType_onChange',
            });

            // 🔍 记录状态更新前的情况
            logger.info({
              message: '[BasicInfoFields] 准备更新 datasourceType 状态',
              data: {
                newValue: value,
                currentState: datasourceType,
                currentFormValue: previousFormValue,
              },
              source: 'BasicInfoFields',
              component: 'datasourceType_onChange',
            });

            setDatasourceType(value);
            // ✅ 当数据源类型变化时，清空已选择的数据源（这是合理的业务逻辑）
            form.setFieldValue('datasourceId', undefined);

            // 🔍 记录状态更新后的情况
            const afterFormValue = form.getFieldValue('datasourceType');
            logger.info({
              message:
                '[BasicInfoFields] 监控数据源类型变化后，已清空 datasourceId',
              data: {
                newDatasourceType: value,
                datasourceIdAfterClear: form.getFieldValue('datasourceId'),
                formFieldValueAfterChange: afterFormValue,
                // 注意：状态更新是异步的，此时 datasourceType 状态可能还是旧值
                stateValueAfterChange: datasourceType,
                timestamp: Date.now(),
              },
              source: 'BasicInfoFields',
              component: 'datasourceType_onChange',
            });
          },
          options: [
            { label: '火山引擎', value: 'Volcengine' },
            { label: '阿里云', value: 'Aliyun' },
            { label: 'Zabbix', value: 'Zabbix' },
          ],
          disabled: loading,
        }}
      />

      {/* 时序数据源 */}
      <Select.Block
        isControl
        inline
        required
        formItemProps={{
          label: '监控数据源',
          field: 'datasourceId',
          rules: [{ required: true, message: '请选择数据源' }],
          extra: '选择具体的监控数据源实例',
        }}
        controlProps={{
          placeholder: '请选择数据源',
          disabled: !datasourceType || loading,
          canFetch: Boolean(datasourceType),
          isDebouncedFetch: true,
          isCascadeRemoteSearch: true,
          isScrollFetching: true,
          isValueEmptyTriggerOptions: true,
          dependency: (() => {
            // 🔍 添加日志：追踪 dependency 数组的构建
            const formDatasourceType = form.getFieldValue('datasourceType');
            const dependencyArray = [datasourceType];
            logger.info({
              message: '[BasicInfoFields] 监控数据源字段 dependency 数组构建',
              data: {
                dependencyArray,
                datasourceTypeState: datasourceType,
                formFieldValue: formDatasourceType,
                valuesMatch: formDatasourceType === datasourceType,
                hasDatasourceDataSource: Boolean(datasourceDataSource),
                datasourceDataSourceApi: datasourceDataSource
                  ? (datasourceDataSource as any).api
                  : undefined,
                timestamp: Date.now(),
              },
              source: 'BasicInfoFields',
              component: 'dependency_build',
            });
            return dependencyArray;
          })(),
          searchKey: 'name',
          dataSource: (() => {
            // 🔍 添加日志：追踪 dataSource 的传递
            const formDatasourceType = form.getFieldValue('datasourceType');
            logger.info({
              message: '[BasicInfoFields] 监控数据源字段 dataSource 传递',
              data: {
                datasourceTypeState: datasourceType,
                formFieldValue: formDatasourceType,
                valuesMatch: formDatasourceType === datasourceType,
                hasDatasourceDataSource: Boolean(datasourceDataSource),
                datasourceDataSourceApi: datasourceDataSource
                  ? (datasourceDataSource as any).api
                  : undefined,
                datasourceDataSourceType: typeof datasourceDataSource,
                timestamp: Date.now(),
              },
              source: 'BasicInfoFields',
              component: 'dataSource_pass',
            });
            return datasourceDataSource;
          })(),
          onChange: (value: string, option: OptionInfo | OptionInfo[]) => {
            logger.info({
              message: '[BasicInfoFields] 监控数据源字段 onChange 触发',
              data: {
                datasourceId: value,
                datasourceType,
                formFieldValue: form.getFieldValue('datasourceType'),
                hasOption: Boolean(option),
                optionLabel:
                  !Array.isArray(option) && option && 'label' in option
                    ? (option as any).label
                    : undefined,
              },
              source: 'BasicInfoFields',
              component: 'datasourceId_onChange',
            });
          },
          dropdownRender: (dom: React.ReactNode) => (
            <div className={'w-[100%]'}>
              <Alert
                showIcon={false}
                content={
                  <div
                    className="flex items-center gap-1 nowrap"
                    style={{ fontWeight: 'bold' }}
                  >
                    <div style={{ whiteSpace: 'nowrap' }}>找不到数据源？</div>
                    <LinkRender
                      ellipsisStyle={{ width: 'auto' }}
                      text={'创建监控数据源'}
                      link={'/system/datasource'}
                      linkProps={{ rel: 'noopener noreferrer' }}
                    />
                  </div>
                }
              />
              {dom}
            </div>
          ),
        }}
      />

      {/* 项目 */}
      <Select.Block
        isControl
        inline
        formItemProps={{
          label: '项目',
          field: 'projects',
          extra: '将任务关联到特定项目，用于权限管理和任务组织',
        }}
        controlProps={{
          mode: 'multiple',
          placeholder: '请选择项目',
          disabled: loading,
          isDebouncedFetch: true,
          isCascadeRemoteSearch: true,
          isScrollFetching: true,
          isValueEmptyTriggerOptions: true,
          dataSource: projectsDataSource,
        }}
      />

      {/* 自动更新阈值 */}
      <Select.Block
        isControl
        inline
        formItemProps={{
          label: '自动更新阈值',
          field: 'autoUpdate',
          extra: '开启后系统将定期自动重新计算和更新阈值',
          initialValue: 'true',
        }}
        controlProps={{
          placeholder: '请选择',
          disabled: loading,
          options: [
            { label: '开启', value: 'true' },
            { label: '关闭', value: 'false' },
          ],
        }}
      />

      {/* 阈值方向 */}
      <Select.Block
        isControl
        inline
        required
        formItemProps={{
          label: '阈值方向',
          field: 'direction',
          rules: [{ required: true, message: '阈值方向必填' }],
          extra: '计算正常阈值的上限、下限还是包含上下限',
          initialValue: 'both',
        }}
        controlProps={{
          placeholder: '请选择阈值方向',
          options: [
            { label: '上界', value: 'up' },
            { label: '下界', value: 'down' },
            { label: '双向', value: 'both' },
          ],
          disabled: loading,
        }}
      />

      {/* 滑动窗口 */}
      <Input.Number
        isControl
        required
        inline
        formItemProps={{
          label: '滑动窗口',
          field: 'nCount',
          rules: [{ required: true, message: '请输入滑动窗口' }],
          extra: '连续几个数据点作为计算阈值的最小窗口，默认3',
        }}
        controlProps={{
          min: 1,
          max: 100,
          precision: 0,
        }}
      />
    </WrapperWithTitle>
  );
};
