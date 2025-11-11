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
 * 历史事件功能模块统一导出
 *
 * ✅ 按照 Feature-Based 架构规范：
 * - hooks/: 业务逻辑 Hooks
 * - lib/: 工具、配置、类型、常量（已合并 config/、ui/shared/）
 * - ui/: UI 组件（已扁平化 pages/、components/table/）
 *
 * ✅ 层层导出原则：
 * - 使用 export * from 统一导出
 * - 避免重复导出和跨层级导出
 *
 * 注意：遵循单一数据源原则
 * - 类型定义应直接从 @veaiops/types 或 api-generate 导入
 */

// 导出顺序：Hooks → Lib → UI
export * from './hooks';
export * from './lib';
export * from './ui';
