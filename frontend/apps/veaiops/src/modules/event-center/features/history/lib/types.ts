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
 * 历史事件模块类型定义
 *
 * 注意：公共类型已迁移到 @veaiops/types
 * 此文件仅保留模块特定类型
 */

// 从 packages 导入公共类型
import type {
  EventQueryParams,
  EventTableData,
  TableQueryParams,
  TableDataResponse,
} from "@veaiops/types";
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

import type { EventShowStatus, EventStatus } from 'api-generate';

// 重新导出公共类型（向后兼容）
export type {
  EventQueryParams as HistoryQueryParams,
  EventTableData as HistoryTableData,
  TableQueryParams,
  TableDataResponse,
};

// 从 api-generate 导出原始类型
export type { Event, AgentType, EventLevel } from "api-generate";

// ✅ 直接从 @veaiops/api-client 导出 EventStatus（不通过 constants 中转）
export { EventStatus } from "@veaiops/api-client";

// 导出新增的类型定义（从 origin/feat/web-v2 迁移）
// 使用 origin/feat/web-v2 的字段定义方式
export type { EventApiParams, HistoryFilters } from "../types/event-api-params";

/**
 * API 请求参数类型
 * 基于生成的 EventService.getApisV1ManagerEventCenterEvent 方法
 * 使用驼峰命名，对应后端 API 接口
 */
export type EventApiParams = {
  agentType?: Array<
    | 'CHATOPS_INTEREST'
    | 'CHATOPS_REACTIVE_REPLY'
    | 'CHATOPS_PROACTIVE_REPLY'
    | 'INTELLIGENT_THRESHOLD'
    | 'ONCALL'
  >;
  eventLevel?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  showStatus?: Array<EventShowStatus>;
  status?: Array<EventStatus>;
  startTime?: string;
  endTime?: string;
  sortOrder?: 'asc' | 'desc';
  skip?: number;
  limit?: number;
};

/**
 * 历史事件过滤器类型
 * 使用下划线命名，对应前端 UI 层
 * 与 filter.tsx 中定义的筛选器一一对应
 */
export interface HistoryFilters {
  /** 智能体类型 */
  agent_type?: string[];
  /** 事件级别 */
  event_level?: string;
  /** 状态（中文） */
  show_status?: EventShowStatus[];
  /** 事件状态（枚举值） */
  status?: number[];
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
}

/**
 * 历史事件详情抽屉组件属性接口
 */
export interface HistoryDetailDrawerProps {
  visible: boolean;
  selectedRecord: Event | null;
  onClose: () => void;
}

/**
 * 可折叠章节组件属性接口
 */
export interface CollapsibleSectionProps {
  title: string;
  sectionKey: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expandedSections: Set<string>;
  onToggle: (section: string) => void;
  collapsedHint?: string; // 收起状态下的提示文本
}

/**
 * 事件概览组件属性接口
 */
export interface EventOverviewProps {
  selectedRecord: Event;
}

/**
 * 时间信息组件属性接口
 */
export interface TimeInfoProps {
  selectedRecord: Event;
}

/**
 * 原始数据组件属性接口
 */
export interface RawDataProps {
  selectedRecord: Event;
  format: 'json' | 'formatted';
  onFormatChange: (format: 'json' | 'formatted') => void;
}

/**
 * 事件类型配置接口
 */
export interface EventTypeConfig {
  color: string;
  text: string;
  icon: string;
  bgColor: string;
  description: string;
}

/**
 * 事件级别配置接口
 */
export interface EventLevelConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  priority: number;
}
