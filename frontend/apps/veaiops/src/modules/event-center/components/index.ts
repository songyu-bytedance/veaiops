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
 * 事件中心模块级共享组件导出
 *
 * ✅ 遵循 .cursorrules 规范：
 * - UpdateTooltip 作为模块级共享组件
 * - useSubscribeRelationFormLogic 已移除（已在 features/subscription 中定义）
 * - 拒绝重复导出，保持单一数据源
 */

// 导出共享组件
export { UpdateTooltip } from './update-tooltip';
