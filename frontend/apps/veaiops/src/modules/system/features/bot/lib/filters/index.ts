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
 * Bot 筛选器配置统一导出
 *
 * 包含 3 个筛选器：
 * - getBotFilters: Bot 主表筛选器
 * - getBotAttributeFilters: 属性表格筛选器
 * - getChatFilters: Chat 表格筛选器
 */

export { getBotFilters, DEFAULT_BOT_FILTERS, BOT_QUERY_FORMAT, BOT_QUERY_SEARCH_PARAMS_FORMAT } from './bot';
export { getBotAttributeFilters } from './attributes';
export { getChatFilters } from './chat';
