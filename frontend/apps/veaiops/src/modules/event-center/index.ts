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
 * 事件中心模块统一导出
 *
 * ✅ 遵循 .cursorrules 规范：
 * - 拒绝中转导出：不导出 shared、components
 * - 只导出 features 和 pages（业务模块）
 * - 使用方应该从具体模块导入：
 *   - 常量：从 @ec/shared 导入
 *   - 组件：从 @ec/components 或具体 feature 导入
 * - 避免重复导出冲突
 */

// 导出业务模块
export * from './features';
export * from './pages';

// ❌ 移除：避免重复导出冲突（EVENT_LEVEL_OPTIONS、UpdateTooltip、useSubscribeRelationFormLogic）
// export * from './shared';
// export * from './components';
