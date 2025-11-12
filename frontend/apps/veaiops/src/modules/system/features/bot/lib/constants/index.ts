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
 * Bot 常量配置统一导出
 *
 * 包含 3 个常量模块：
 * - bot: Bot 管理常量（BOT_MANAGEMENT_CONFIG、BOT_MESSAGES 等）
 * - attributes: 属性表格常量（BOT_ATTRIBUTES_* 系列）
 * - chat: Chat 表格常量（CHAT_TABLE_QUERY_FORMAT）
 */

// Bot 管理常量
export {
  BOT_MANAGEMENT_CONFIG,
  BOT_MESSAGES,
  createActionButtons,
  getTableProps,
} from './bot';

// 属性表格常量
export {
  BOT_ATTRIBUTES_TABLE_INIT_QUERY,
  BOT_ATTRIBUTES_INFO_MESSAGE,
  BOT_ATTRIBUTES_TABLE_SCROLL,
} from './attributes';

// Chat 表格常量
export { CHAT_TABLE_QUERY_FORMAT } from './chat';
