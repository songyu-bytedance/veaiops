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
 * 版本管理 Hooks 统一导出
 *
 * ✅ 已从 ui/version/hooks 重构至此处
 *
 * 职能范围：
 * - history: 版本历史管理
 * - table-renderer: 表格渲染器
 * - alarm-drawer: 告警抽屉管理
 * - rerun-drawer: 重跑抽屉管理
 * - table-config: 版本表格配置（从 ../table 重新导出）
 */

export {
  useVersionHistory,
  type UseVersionHistoryReturn,
} from './history';
export {
  useAlarmDrawer,
  useCreateAlarmCallback,
} from './alarm-drawer';
export { useRerunDrawer } from './rerun-drawer';
export {
  useTaskVersionTableRenderer,
  type TaskVersionTableRendererProps,
} from './table-renderer';

// ✅ 重新导出 useTaskVersionTableConfig（从 table 职能）
// 用于向后兼容 ui/version/table.tsx 的导入
export { useTaskVersionTableConfig } from '../table/version';
