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
 * ✅ 修复：创建 components/index.ts 统一导出
 * - 避免深层路径导入
 * - 遵循 Feature-Based 架构规范
 */

export * from './management';
export { ProjectManagement } from './management';
export * from './create-drawer';
export * from './detail-drawer';
export { ProjectImportDrawer } from './import-drawer';
export * from './modal';
export * from './table';
export * from './table-config';
export * from './components';
