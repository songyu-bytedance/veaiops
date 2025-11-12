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
 * 格式化工具函数
 * ✅ 修复：从 ui/components/detail-view/utils.ts 和 ui/components/edit-form/utils.ts 合并到 lib/formatters.ts
 */

// ✅ 修复：从正确路径导入常量
// ACTION_CATEGORY_LABELS 和 INSPECT_CATEGORY_LABELS 在 oncall/lib/constants.ts
import { Interest } from 'api-generate';
import {
  ACTION_CATEGORY_LABELS,
  INSPECT_CATEGORY_LABELS,
} from '../../../lib';

/**
 * 格式化告警类别显示文本
 * ✅ 来自 detail-view/utils.ts
 */
export const formatActionCategoryText = (
  category: Interest['action_category'],
): string => {
  if (category === Interest.action_category.DETECT) {
    return '检测';
  }
  if (category === Interest.action_category.FILTER) {
    return '过滤';
  }
  return String(category);
};

/**
 * 格式化检测类别显示文本
 * ✅ 来自 detail-view/utils.ts
 */
export const formatInspectCategoryText = (
  category: Interest['inspect_category'],
): string => {
  if (category === Interest.inspect_category.SEMANTIC) {
    return '语义分析';
  }
  if (category === Interest.inspect_category.RE) {
    return '正则表达式';
  }
  return String(category);
};

/**
 * 格式化检查历史记录数显示
 * ✅ 来自 detail-view/utils.ts
 */
export const formatInspectHistory = (
  inspectHistory: number | undefined,
): string => {
  if (inspectHistory === undefined || inspectHistory === null) {
    return '-';
  }
  return inspectHistory === 0 ? '全部记录' : `${inspectHistory}条记录`;
};

/**
 * 格式化告警类别显示文本（带标签）
 * ✅ 来自 edit-form/utils.ts
 */
export const formatActionCategoryTextWithLabel = (
  category: Interest['action_category'],
): string => {
  if (category === Interest.action_category.DETECT) {
    return ACTION_CATEGORY_LABELS[Interest.action_category.DETECT] || '检测';
  }
  if (category === Interest.action_category.FILTER) {
    return ACTION_CATEGORY_LABELS[Interest.action_category.FILTER] || '过滤';
  }
  return String(category);
};

/**
 * 格式化检测类别显示文本（带标签）
 * ✅ 来自 edit-form/utils.ts
 */
export const formatInspectCategoryTextWithLabel = (
  category: Interest['inspect_category'],
): string => {
  if (category === Interest.inspect_category.SEMANTIC) {
    return (
      INSPECT_CATEGORY_LABELS[Interest.inspect_category.SEMANTIC] || '语义分析'
    );
  }
  if (category === Interest.inspect_category.RE) {
    return (
      INSPECT_CATEGORY_LABELS[Interest.inspect_category.RE] || '正则表达式'
    );
  }
  return String(category);
};
