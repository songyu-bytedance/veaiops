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
 * Connection 子模块类型定义统一导出
 *
 * ✅ 遵循 .cursorrules 规范：
 * - types/ 目录只包含类型定义
 * - global.ts: 全局类型（原 lib/global-types.ts）
 * - business.ts: 业务类型（原 lib/types.ts）
 *
 * ✅ 说明：TABLE_CONFIG 常量已在 lib/constants.ts 中定义
 * - 通过 connection/lib/index.ts 统一导出（export * from "./constants"）
 * - 使用方应该从 @datasource/connection/lib 导入：
 *   import { TABLE_CONFIG } from '@datasource/connection/lib';
 *
 * 遵循规范：
 * - 单层导出：types/index.ts 只导出 types 目录内容
 * - 拒绝中转导出：不跨层级从 lib/ 重新导出常量
 */

// 全局类型
export * from './global';

// 业务类型
export * from './business';
