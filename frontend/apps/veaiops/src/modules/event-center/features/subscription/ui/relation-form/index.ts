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
 * 订阅关系表单组件导出
 *
 * ✅ 遵循单一导出原则：
 * - 只使用 export * from 统一导出，避免重复
 * - 拒绝中转导出和多次导出
 */

// 导出表单组件（包括 SubscribeRelationForm）
export * from './form';

// 导出子组件
export * from './components';

// 导出 Hooks
export * from './hooks';
