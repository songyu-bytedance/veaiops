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
 * 数据源连接管理功能模块统一导出
 */

// UI 组件
export * from './ui';

// 工具函数和类型（lib 会重新导出 types）
export * from './lib';

// ✅ 推荐：也可以直接从 types 导入类型
// import type { ... } from '@datasource/connection/types';

// 主要组件的默认导出
export { ConnectionTable as DataSourceConnectionTable } from './ui/tables/connection-table';
