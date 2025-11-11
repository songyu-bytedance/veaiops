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

import { Select } from '@veaiops/components';
import { type React, useMemo } from 'react';
import {
  getAliyunContactGroupDataSource,
  getVolcengineContactGroupDataSource,
  getZabbixContactGroupDataSource,
} from './contact-group-datasource';

interface ContactGroupSelectorProps {
  loading: boolean;
  datasourceType: string;
  datasourceId: string;
}

/**
 * 联系组选择器组件
 *
 * 支持 Volcengine 和 Aliyun 两种数据源：
 * - Volcengine: 使用 DataSourceSetter 配置化方式
 * - Aliyun: 使用函数式数据源（需要先获取 connect_id）
 */
export const ContactGroupSelector: React.FC<ContactGroupSelectorProps> = ({
  loading,
  datasourceType,
  datasourceId,
}) => {
  // 🔧 修复：使用useMemo缓存dataSource，避免每次渲染都创建新的函数引用导致Select组件重建
  const dataSource = useMemo(() => {
    if (datasourceType === 'Volcengine') {
      return getVolcengineContactGroupDataSource(datasourceId);
    }
    if (datasourceType === 'Aliyun') {
      return getAliyunContactGroupDataSource(datasourceId);
    }
    if (datasourceType === 'Zabbix') {
      return getZabbixContactGroupDataSource(datasourceId);
    }
    return undefined;
  }, [datasourceType, datasourceId]);

  // 🔧 修复：使用useMemo缓存dependency数组，避免每次渲染都创建新数组导致Select组件重建
  const dependency = useMemo(
    () => [datasourceId, datasourceType],
    [datasourceId, datasourceType],
  );

  // 根据数据源类型生成友好的标签和提示信息
  const labelText = datasourceType === 'Zabbix' ? '告警组' : '联系组';
  const placeholderText =
    datasourceType === 'Zabbix' ? '请选择告警组' : '请选择联系组';
  const extraHint = ['Volcengine', 'Zabbix'].includes(datasourceType)
    ? `选择${labelText}后，需同时配置告警通知方式才会发送通知`
    : '可选配置，不选择时仅通过Webhook投递';

  // 根据数据源类型设置搜索字段
  // Volcengine/Zabbix: name (小写)
  // Aliyun: Name (大写N)
  const searchKey = datasourceType === 'Aliyun' ? 'Name' : 'name';

  return (
    <Select.Block
      isControl
      formItemProps={{
        label: labelText,
        field: 'contactGroupId',
        rules: [{ required: false, message: `请选择${labelText}` }],
        extra: extraHint,
      }}
      controlProps={{
        placeholder: placeholderText,
        disabled: loading || !datasourceId,
        canFetch: Boolean(datasourceId),
        isDebouncedFetch: true,
        isScrollFetching: true,
        dependency,
        searchKey,
        dataSource,
      }}
    />
  );
};
