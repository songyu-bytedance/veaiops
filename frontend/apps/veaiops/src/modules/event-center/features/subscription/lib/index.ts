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
 * 订阅管理 Lib 统一导出
 *
 * 按照 .cursorrules 标准 lib/ 结构：
 * - api.ts: CRUD 函数式 API（用于 management hooks）
 * - service.ts: 服务类封装（用于 table config）
 * - types.ts: 类型定义
 * - columns.tsx: 表格列配置
 * - filters.tsx: 筛选器配置
 * - validators.ts: 验证器
 * - utils/: 工具函数目录
 *
 * ⚠️ 职责说明：
 * - api.ts 和 service.ts 都保留是为了兼容现有代码
 * - api.ts: 导出函数（createSubscription、updateSubscription、deleteSubscription）
 * - service.ts: 导出类（SubscriptionService、subscriptionService 实例）
 * - 建议：未来统一使用 service.ts，逐步移除 api.ts
 *
 * 注意：遵循单层导出原则
 * - 只导出当前目录下的内容
 * - 不重新导出其他包的内容（如 @veaiops/constants）
 */

// 导出 API
export * from './api';
export * from './service';

// 导出类型、配置、验证
export * from './types';
export * from './columns';
export * from './filters';
export * from './validators';

// 导出工具函数
export * from './utils/transform';
