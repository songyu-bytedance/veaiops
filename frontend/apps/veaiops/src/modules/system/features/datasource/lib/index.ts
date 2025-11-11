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
 * 数据源管理模块工具函数和服务统一导出
 */

// 导出类型定义
export * from "./types";

// 本地常量定义（模块特定）
export * from "./constants";

// ❌ 移除中转导出：不再从 @veaiops/constants 重新导出
// 使用方应该直接导入：import { API_RESPONSE_CODE } from '@veaiops/constants';

// 导出工具函数
export * from "./utils";

// 导出配置函数（pages、guide 等，包含 getTableRef、createDataSourceConfigs）
export * from "./config";

// 导出服务
export * from "./api-service";

// 导出列配置
export * from "./columns";

// 导出监控相关配置（整合到 monitor/ 目录）
export * from "./monitor";
