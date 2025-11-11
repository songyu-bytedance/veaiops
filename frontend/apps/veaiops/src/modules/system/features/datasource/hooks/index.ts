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
 * 数据源管理模块 - Hooks 统一导出
 *
 * 按职能分层（遵循 .cursorrules 模式B）：
 * - monitor/: 监控管理职能
 * - datasource/: 数据源管理职能
 * - pages/: 页面管理职能
 */

// Monitor 职能
export * from './monitor';

// DataSource 职能
export * from './datasource';

// Pages 职能
export * from './pages';
