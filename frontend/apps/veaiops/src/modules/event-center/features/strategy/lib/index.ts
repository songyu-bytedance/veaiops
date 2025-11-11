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
 * 策略管理 Lib 统一导出
 *
 * 按照 Feature-Based 架构规范，lib/ 目录包含：
 * - API 服务（api.ts、service.ts）
 * - 类型定义（types.ts）
 * - 常量配置（constants.ts）
 * - 列配置（columns.tsx）
 * - 筛选器配置（filters.tsx）
 *
 * 注意：避免重复导出
 * - strategy-config.tsx 已删除（重复导出 columns 和 filters）
 */

// 导出所有 lib 内容
export * from './api';
export * from './service';
export * from './types';
export * from './constants';
export * from './columns';
export * from './filters';
