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
 * 历史事件 Hooks 统一导出
 *
 * 注意：遵循单层导出原则
 * - 只导出当前目录下的 Hooks
 * - 类型定义从 lib 导入，不在 hooks 中重新导出
 *
 * ✅ 修复重复导出问题：
 * - useHistoryTableConfig 在三个文件中重复定义
 * - 只保留 use-table-config.tsx 中的定义（最完整）
 * - use-management.tsx 和 use-history-logic.tsx 中改为内部函数
 * - ❌ 拒绝中转导出：不使用别名重新导出
 */

// 导出所有 Hooks
export * from './use-history-logic';
// export * from './use-management'; // ✅ 移除：use-management.tsx 中所有导出已改为内部函数，避免重复导出冲突
export * from './use-table-config';

// ✅ 添加别名导出（用于 table.tsx 的向后兼容）
export { useHistoryTableConfig as useHistoryTableConfigFromTable } from './use-table-config';
