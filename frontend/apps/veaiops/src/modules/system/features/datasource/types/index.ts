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
 * 数据源模块类型定义统一导出
 *
 * ✅ 遵循 .cursorrules 模式 A+：简单功能+类型独立
 * - business.ts: 业务类型（原 lib/types.ts）
 * - monitor.ts: 监控表格相关类型（原 lib/monitor/types.ts）
 */

// 业务类型
export * from './business';

// 监控表格类型
export * from './monitor';
