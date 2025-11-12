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

// ✅ 修复：从正确路径导入类型
import type { TimeseriesBackendItem } from './validators';

/**
 * 从 labels 对象中获取指定 key 的值
 *
 * ❌ 改为内部函数：避免与 parsers.ts 中的 getLabelValue 冲突
 * - 遵循单一数据源原则
 * - parsers.ts 中的 getLabelValue 更通用，被 data-point-processor 使用
 * - 此处作为内部辅助函数使用
 */
const getLabelValue = ({
  obj,
  key,
}: {
  obj: Record<string, unknown> | undefined;
  key: string;
}): string => {
  if (!obj || !(key in obj)) {
    return '';
  }

  const value = obj[key];

  // 确保值可以安全转换为字符串
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
};

/**
 * 生成系列标识符
 */
export const generateSeriesIdentifier = ({
  item,
  seriesIndex,
}: {
  item: TimeseriesBackendItem;
  seriesIndex: number;
}): string => {
  const { labels } = item;

  const hostname = getLabelValue({ obj: labels, key: 'hostname' });
  const itemid = getLabelValue({ obj: labels, key: 'itemid' });
  const instanceId = getLabelValue({ obj: labels, key: 'instance_id' });

  // 边界检查：生成有意义的系列名称（预留，未来可能用于图表系列标识）
  if (hostname) {
    return hostname;
  } else if (itemid) {
    return `ID:${itemid}`;
  } else if (instanceId) {
    return instanceId;
  } else {
    return `series-${seriesIndex + 1}`;
  }
};
