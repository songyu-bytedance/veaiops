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
 * 订阅管理 Hooks 统一导出
 *
 * 目录结构按职能分层（遵循 .cursorrules 模式B）：
 * - table/: 表格管理职能
 * - form/: 表单管理职能
 * - webhook/: Webhook 管理职能
 * - management/: 整体管理职能
 */

// 表格职能
export * from './table';

// 表单职能
export * from './form';

// Webhook 职能
export * from './webhook';

// 管理职能
export * from './management';
