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
 * 订阅管理 UI 组件统一导出
 *
 * ✅ 遵循 .cursorrules 规范：
 * - 拒绝中转导出：不使用别名重新导出
 * - 单一导出原则：只使用 export * from 统一导出
 * - 使用方应该直接导入原始组件名
 */

// 导出所有 UI 组件
export * from './management';
export * from './table';
export * from './relation-manager';
export * from './relation-page';
export * from './components';
export * from './relation-form';
export * from './subscribe-relation-table';

// ✅ 重新导出 UpdateTooltip（从 event-center/components，用于向后兼容）
// ❌ 根据 .cursorrules：拒绝中转导出，移除此行
// 使用方应该从 @/modules/event-center/components 直接导入
// export { UpdateTooltip } from '@/modules/event-center/components/update-tooltip';
