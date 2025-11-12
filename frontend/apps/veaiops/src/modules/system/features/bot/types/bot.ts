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
 * Bot 相关类型定义
 * 统一管理 Bot 相关的类型、接口和常量
 */

// 导入生成的类型定义，确保与 Python 接口一致
import type {
  AgentCfg,
  AgentCfgPayload,
  Bot,
  VolcCfg,
  VolcCfgPayload,
} from 'api-generate';

export type {
  AgentCfg,
  AgentCfgPayload,
  APIResponseBot,
  Bot,
  BotCreateRequest,
  BotUpdateRequest,
  ChannelType,
  VolcCfg,
  VolcCfgPayload,
} from 'api-generate';

/**
 * 火山引擎区域类型（与后端tos_region枚举对应）
 */
export type VolcRegion = VolcCfgPayload.tos_region;

/**
 * 网络类型（与后端NetworkType枚举对应）
 */
export type NetworkType = VolcCfgPayload.network_type;

/**
 * 扩展的机器人数据（包含完整配置信息）
 */
export type ExtendedBot = Bot & {
  volc_cfg?: VolcCfg;
  agent_cfg?: AgentCfg;
};

/**
 * 表单数据类型（与表单字段名匹配）
 * 字段命名与 API 对齐：使用 agent_cfg 而不是 agent_cfg_payload
 *
 * 注意：name 字段已移除，因为：
 * 1. BotCreateRequest 不包含 name 字段
 * 2. 创建表单中未使用 name 字段
 * 3. 表格筛选中的 name 是查询参数，不是表单字段
 */
export interface BotFormData {
  bot_id: string;
  secret: string;
  channel: Bot.channel;
  webhook_urls?: Array<string>;
  volc_cfg?: VolcCfgPayload;
  agent_cfg?: AgentCfgPayload;
}

/**
 * ✅ 修复：常量已移至 lib/constants/bot.ts
 * 使用方式：import { NETWORK_TYPE_OPTIONS, TOS_REGION_OPTIONS } from '@bot/lib';
 *
 * 遵循 .cursorrules 规范：
 * - 常量定义在 lib/constants/
 * - 类型定义在 types/
 * - 避免重复定义
 */

/**
 * @see frontend/packages/constants/src/channel.ts
 *
 * 使用方式：
 * import { CHANNEL_OPTIONS } from '@veaiops/constants';
 */

/**
 * 机器人表格操作回调
 */
export interface BotTableActions {
  onEdit: (bot: Bot) => void;
  onDelete: (botId: string) => Promise<boolean>;
}

/**
 * 机器人表格组件属性接口
 */
export interface BotTableProps {
  onEdit: (bot: Bot) => void;
  onDelete: (botId: string) => Promise<boolean>;
  onAdd: () => void;
  onViewAttributes: (bot: Bot) => void;
  onGroupManagement: (bot: Bot) => void;
}

/**
 * 机器人表格组件引用接口
 */
export interface BotTableRef {
  refresh: () => Promise<boolean>;
}

/**
 * Bot 筛选查询参数接口
 *
 * ✅ 类型独立原则：从 lib/filters.ts 移至 types/bot.ts
 * 对应 CustomTable 的 query 参数结构
 */
export interface BotFilters {
  /** 状态筛选 */
  status?: string;
  /** 频道类型筛选 */
  channel?: string;
  /** 关键字搜索 */
  keyword?: string;
  /** 索引签名，满足 BaseQuery 约束 */
  [key: string]: unknown;
}
