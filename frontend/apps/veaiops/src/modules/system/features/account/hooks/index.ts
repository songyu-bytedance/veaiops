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
 * Account Hooks 统一导出
 *
 * ✅ 按照 .cursorrules 规范：
 * - 使用职能分层模式（management、table、actions）
 * - 每个职能目录只包含相关的 Hooks
 * - types 和 utils 已移至 feature/lib/
 */

// ==================== Management 职能 ====================
export * from './management';

// ==================== Table 职能 ====================
export * from './table';

// ==================== Actions 职能 ====================
export * from './actions';
