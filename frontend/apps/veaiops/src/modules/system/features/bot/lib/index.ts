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
 * Bot 管理库统一导出
 *
 * 📂 标准结构（2025-11-12 优化）：
 *
 * ✅ 子目录（多文件统一组织）：
 *    - columns/: 列配置（4个文件）- bot/chat/attributes/table
 *    - filters/: 筛选器（3个文件）- bot/chat/attributes
 *    - constants/: 常量配置（3个文件）- bot/attributes/chat ⭐ 新增
 *
 * ✅ 根目录（按职能独立）：
 *    - api.ts: API 服务（统一入口）
 *    - utils.tsx: 工具函数
 *    - translations.ts: 翻译配置
 *
 * ✅ 核心规范：
 *    - 单一数据源：每个功能只在一处定义，避免重复文件
 *    - 单层导出：只导出 lib/ 内容，不跨级导出 types
 *    - 类型独立：所有类型在 types/，lib 不含类型定义
 *    - 统一子目录：多文件同类职能使用子目录（>=3个）
 *    - 目录上下文：文件名简化，移除冗余前缀/后缀
 */

// API 服务
export * from "./api";

// 列配置
export * from "./columns";

// 筛选器配置
export * from "./filters";

// 常量配置
export * from "./constants";

// 工具函数
export * from "./utils";

// 翻译配置
export * from "./translations";

/**
 * ✅ 说明：NETWORK_TYPE_OPTIONS 和 TOS_REGION_OPTIONS 已在 lib/constants/bot.ts 中定义
 * 通过 export * from "./constants" 统一导出（第 48 行）
 *
 * 遵循 .cursorrules 规范：
 * - 单层导出：lib/index.ts 只导出 lib 目录内容
 * - 拒绝中转导出：不跨层级从 types/ 重新导出常量
 * - 使用方应该从 @bot/lib 导入：import { NETWORK_TYPE_OPTIONS } from '@bot/lib';
 */
