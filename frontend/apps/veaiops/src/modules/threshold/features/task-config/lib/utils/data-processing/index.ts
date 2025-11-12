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
 * 数据处理工具函数统一导出
 *
 * ✅ 已从 ui/components/shared/data-utils 重构至此处
 *
 * ✅ 修复（2025-11-12）：解决重复导出冲突
 * - 只从 data-processors.ts 导出主要函数（processTimeseriesItem, addThresholdLines）
 * - 移除其他文件的重复导出（data-point-processor, threshold-processor, parsers）
 * - 保留 label-processors 的 generateSeriesIdentifier（不冲突）
 * - 保留 threshold-processors 的 extractThresholdConfig（不冲突）
 *
 * 包含：
 * - data-processors: 主要数据处理器（processTimeseriesItem, addThresholdLines, getLabelValue）
 * - label-processors: 标签处理器（generateSeriesIdentifier）
 * - threshold-processors: 阈值处理器（extractThresholdConfig）
 * - validators: 验证器
 * - data-sorter: 数据排序器
 * - types: 类型定义
 */

// ✅ 主要处理器（包含所有导出函数）
export * from './data-processors';

// ✅ 标签处理器（只导出 generateSeriesIdentifier，不导出 getLabelValue）
export { generateSeriesIdentifier } from './label-processors';

// ✅ 阈值处理器（只导出 extractThresholdConfig，不导出其他冲突函数）
export { extractThresholdConfig } from './threshold-processors';

// ❌ 移除重复导出：这些文件中的函数已在 data-processors 中导出
// export * from './data-point-processor';    // processTimeseriesItem 冲突
// export * from './threshold-processor';     // addThresholdLines 冲突
// export * from './parsers';                 // getLabelValue 冲突

// ✅ 验证器和排序器
export * from './validators';
export * from './data-sorter';

// ✅ 类型定义
export * from './types';
