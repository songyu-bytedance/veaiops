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
 * Account Hooks 统一导出
 *
 * ✅ 按照 .cursorrules 规范：
 * - 使用 export * 统一导出，避免中转导出
 * - 每个 Hook 只在源文件中定义一次
 */

// ✅ 选择性导出，避免 transformUserToTableData 冲突（遵循单一数据源原则）
// 从 use-account-management-logic 只导出 Hook，不导出工具函数
export { useAccountManagementLogic } from './use-account-management-logic';

// 从 use-account 导出（包含 transformUserToTableData）
export * from './use-account';
