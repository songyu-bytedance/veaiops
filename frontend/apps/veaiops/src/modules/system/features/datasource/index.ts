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
 * 数据源管理模块统一导出
 *
 * ✅ 修复：优化目录结构（遵循 .cursorrules Feature-Based 架构）
 * - types/: 类型定义（独立目录）✅
 * - hooks/: 数据源管理业务逻辑
 *   - management/: 数据源管理职能（原 datasource/）✅
 *   - monitor/: 监控管理职能
 *   - page-management/: 页面管理职能（原 pages/）✅
 * - lib/: 工具函数、API服务、配置
 *   - monitor-*.ts: 监控相关配置（原 monitor/ 子目录）✅
 * - ui/: UI 组件
 * - connection/: 连接配置管理子功能（独立子模块，类似 bot/attributes）
 *   - types/: 连接类型定义（独立）✅
 *   └─ 管理数据源的连接配置（Connect CRUD、测试、表单等）
 */

export * from './ui';
export * from './hooks';
export * from './types';
export * from './lib/constants';

// API 服务
export { DataSourceApiService as ThresholdDataSourceApiService } from './lib/api-service';

// Connection 子功能（独立导出，避免命名冲突）
export * as Connection from './connection';
