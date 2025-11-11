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
 * Oncall Config UI 统一导出
 *
 * ✅ 遵循 .cursorrules 规范：
 * - 简化文件名：config-page.tsx → management.tsx（主页面标准命名）
 * - 拒绝中转导出：不使用别名导出
 * - 使用方应该直接导入原始组件名 ConfigPage
 */

export * from './management';
export * from './table';
export * from './drawer';
export * from './info';
export * from './components';
