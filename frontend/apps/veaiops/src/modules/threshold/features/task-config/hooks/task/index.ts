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
 * Task 表格组件层 Hooks 统一导出
 *
 * ✅ 已从 ui/task/hooks 重构至此处
 *
 * 职能范围：
 * - table-config: 表格配置包装
 * - table-operations: 表格操作包装
 * - table-ref: 表格 ref 管理
 */

export { useTableConfig } from './table-config';
export { useTableOperations } from './table-operations';
export { useTableRef } from './table-ref';
