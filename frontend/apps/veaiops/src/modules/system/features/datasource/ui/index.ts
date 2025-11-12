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

// 页面组件（同源合并优化）
export { DetailModal } from './components';

// 表格组件（已提升到 ui/tables/）
export { MonitorTable, DataSourceTable } from './tables';
export { default as DataSourceManagement } from './management';

// 图标组件
export {
  AliyunIcon,
  getDataSourceIcon,
  MonitorIcon,
  VolcengineIcon,
  ZabbixIcon,
} from './components/icons';

// ✅ 修复：移除列配置中转导出（遵循 .cursorrules 拒绝中转导出原则）
// 这些函数定义在 ui/tables/columns/，只在 datasource 模块内部使用
// 使用方应该直接从 ./tables/columns 导入

// 渲染器
export * from './components/renderers';
