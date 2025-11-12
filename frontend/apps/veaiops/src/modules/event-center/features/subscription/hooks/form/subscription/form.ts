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

import { Form } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { initializeForm } from './form-initializer';
import { createSubmitHandler } from './form-submit-handler';
import type {
  UseSubscriptionFormConfig,
  UseSubscriptionFormReturn,
} from './types';

// 导出类型
export type {
  StrategyIdItem,
  UseSubscriptionFormConfig,
  UseSubscriptionFormReturn,
  WebhookHeader,
} from './types';

// 导出工具函数（供其他模块使用）
export { normalizeStrategyIds } from './strategy-id-normalizer';
export { createDefaultTimeRange, parseTimeRange } from './time-range-utils';

/**
 * 订阅表单管理Hook
 *
 * 提供订阅表单的完整状态管理和交互逻辑，包括：
 * - 表单初始化（新建/编辑模式）
 * - 数据规范化处理
 * - 表单提交处理
 * - 加载状态管理
 *
 * @param config - Hook配置参数
 * @returns Hook返回值
 *
 * @remarks
 * 这个Hook会在以下情况下重新初始化表单：
 * - visible 状态变化
 * - initialData 变化
 * - moduleType 变化
 *
 * @see {@link UseSubscriptionFormConfig} 配置参数详情
 * @see {@link UseSubscriptionFormReturn} 返回值详情
 */
export const useSubscriptionForm = ({
  visible,
  initialData,
  moduleType,
}: UseSubscriptionFormConfig): UseSubscriptionFormReturn => {
  // 创建表单实例
  const [form] = Form.useForm();
  // 提交加载状态
  const [loading, setLoading] = useState(false);

  // 表单初始化：当弹窗显示或数据变化时
  // 🔧 注意：form 实例是稳定的（由 Form.useForm() 创建），在整个组件生命周期内引用不变
  useEffect(() => {
    if (visible) {
      initializeForm(form, initialData, moduleType);
    }
  }, [visible, initialData, moduleType]);

  // 创建提交处理函数
  const handleSubmit = createSubmitHandler(form, setLoading);

  return {
    form,
    loading,
    handleSubmit,
  };
};

export default useSubscriptionForm;
