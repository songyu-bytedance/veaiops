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
 * Tables - 统一导出入口
 * 职责：导出所有表格组件和列配置
 *
 * ⚠️ 注意：与 upstream/main 保持一致
 * - 列配置函数定义在 ui/tables/columns/index.ts 中
 * - 通过此文件统一导出，供 ui/index.ts 使用
 * - TODO: 未来可重构，将列配置函数移至 lib/columns/ 目录
 */

// 导出表格组件
export { DataSourceTable } from './data-source';
export {
  MonitorTable,
  type MonitorTableRef,
} from './monitor';

// 导出列配置（与 upstream/main 保持一致）
// ✅ 修复：只导出存在的列配置函数
export {
  getCommonColumns,
  getZabbixColumns,
  getAliyunColumns,
  getVolcengineColumns,
  getActionColumn,
} from './columns';
