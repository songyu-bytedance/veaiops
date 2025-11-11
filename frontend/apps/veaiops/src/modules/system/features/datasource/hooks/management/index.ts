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
 * Management 职能 - 数据源管理统一导出
 *
 * ✅ 修复：原 datasource/ 目录改名为 management/（避免重复模块名）
 *
 * 🎯 清晰的职能命名（遵循 .cursorrules）：
 * - providers.ts: 提供各种数据源 hooks（原 management.ts/hooks.ts）
 * - management.ts: 页面级管理逻辑（原 handlers.ts/use-data-source-handlers.ts）
 */

// 数据源 Provider Hooks（原 hooks.ts → management.ts → providers.ts）
export {
  useDataSourceManagement,
  useZabbixDataSource,
  useAliyunDataSource,
  useVolcengineDataSource,
  useDetailView,
} from './providers';

// 页面级管理逻辑（原 use-data-source-handlers.ts → handlers.ts → management.ts）
export { useDataSourceHandlers } from './management';
