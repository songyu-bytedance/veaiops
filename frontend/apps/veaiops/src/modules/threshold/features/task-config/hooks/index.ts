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
 * 智能阈值任务配置模块 - Hooks 统一导出
 *
 * 目录结构按职能分层：
 * - table/: 表格配置、操作、请求
 * - management/: 整体管理、操作配置
 * - form/: 表单处理
 * - timeseries/: 时序数据
 * - version/: 版本管理（✅ 从 ui/version/hooks 移至此处）
 * - auto-refresh/: 自动刷新（通用）
 */

// 表格职能
export * from './table';

// 管理职能
export * from './management';

// 表单职能
export * from './form';

// 时序数据职能
export * from './timeseries';

// 版本管理职能（✅ 已从 ui/version/hooks 重构至此）
export * from './version';

// Task UI 层 Hooks（✅ 已从 ui/task/hooks 重构至此）
export * from './task';

// 自动刷新（通用工具）
export {
  useAutoRefreshOperations,
  createOperationWrapper,
  type AutoRefreshOperations,
  type UseAutoRefreshOperationsParams,
  type CreateOperationWrapperParams,
} from './auto-refresh';

// 独立功能 Hooks
export { useUrlParams } from './use-url-params';
export { useDatasourceDetail } from './use-datasource-detail';
