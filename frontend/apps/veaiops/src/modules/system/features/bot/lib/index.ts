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

// 列配置（统一从 columns/ 子目录导出）
// - getBotColumns: Bot 主表列配置
// - getChatColumns: Chat 表格列配置
// - getBotAttributesColumns: 属性表格列配置
// - getTableColumns: 通用表格列配置
export * from "./columns";

// 筛选器配置（统一从 filters/ 子目录导出）
// - getBotFilters: Bot 主表筛选器
// - getBotAttributeFilters: 属性表格筛选器
// - getChatFilters: Chat 表格筛选器
export * from "./filters";

// 常量配置（统一从 constants/ 子目录导出）⭐ 优化
// - BOT_MANAGEMENT_CONFIG、BOT_MESSAGES: Bot 管理常量
// - BOT_ATTRIBUTES_*: 属性专用常量
// - CHAT_TABLE_QUERY_FORMAT: Chat 表格常量
export * from "./constants";

// 工具函数
export * from "./utils";

// 翻译配置
export * from "./translations";
