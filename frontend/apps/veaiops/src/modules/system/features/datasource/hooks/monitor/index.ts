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
 * Monitor 职能 - 统一导出
 *
 * 🎯 遵循 .cursorrules 的扁平化 + helpers 模式
 */

// 核心逻辑（原 use-monitor-access-logic/）
export { useMonitorAccessLogic } from './access-logic';

// 表格配置（原 use-monitor-table-config.tsx）
export { useMonitorTableConfig } from './table-config';

// 操作配置（原 use-monitor-action-config.tsx）
export { useMonitorActionConfig } from './action-config';

// 辅助功能（原 access-logic/ 下的辅助文件）
export * from './helpers';
