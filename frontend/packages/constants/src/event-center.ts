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
 * Note: Agent type related constants have been migrated to agent.ts
 * Please import from '@veaiops/constants' uniformly
 * To avoid duplicate exports, they are no longer exported here (already exported in index.ts via export * from './agent')
 */

/**
 * ⚠️ Note: EventStatus enum has been migrated to @veaiops/api-client
 *
 * ✅ Single source of truth principle: Import directly from @veaiops/api-client, not through @veaiops/constants as intermediary
 *
 * Usage:
 * ```typescript
 * import { EventStatus } from '@veaiops/api-client';
 * // Or backward compatible path
 * import { EventStatus } from 'api-generate';
 * ```
 *
 * Corresponding relationships:
 * - OpenAPI spec (event-center.json): Uses x-enum-varnames to define semantic key names
 * - Generated TypeScript enum (@veaiops/api-client/models/event-status.ts): Auto-generated semantic enum
 * - Python backend enum (veaiops/schema/types.py): EventStatus enum
 *
 * Enum value mapping:
 * - INITIAL (0) ↔ Python EventStatus.INITIAL
 * - SUBSCRIBED (1) ↔ Python EventStatus.SUBSCRIBED
 * - CARD_BUILT (2) ↔ Python EventStatus.CARD_BUILT
 * - DISTRIBUTED (3) ↔ Python EventStatus.DISPATCHED
 * - NO_DISTRIBUTION (4) ↔ Python EventStatus.NONE_DISPATCH
 * - CHATOPS_NO_MATCH (11) ↔ Python EventStatus.CHATOPS_NOT_MATCHED
 * - CHATOPS_RULE_FILTERED (12) ↔ Python EventStatus.CHATOPS_RULE_FILTERED
 * - CHATOPS_RULE_LIMITED (13) ↔ Python EventStatus.CHATOPS_RULE_RESTRAINED
 *
 * ⚠️ Maintenance instructions:
 * - To modify enum values or key names, modify x-enum-varnames in OpenAPI spec (event-center.json)
 * - After modification, run `pnpm generate:api` to regenerate
 * - It is forbidden to manually define or re-export EventStatus here
 */

/**
 * Event status options
 * Corresponds to backend EventStatus enum
 * Note: Migrated from application, includes complete event status definitions
 */
export const EVENT_STATUS_OPTIONS = [
  { label: '初始化', value: 0, extra: { color: 'gray' } },
  { label: '已订阅', value: 1, extra: { color: 'blue' } },
  { label: '已构建卡片', value: 2, extra: { color: 'cyan' } },
  { label: '已分发', value: 3, extra: { color: 'green' } },
  { label: '无分发', value: 4, extra: { color: 'orange' } },
  { label: 'ChatOps未匹配', value: 11, extra: { color: 'red' } },
  { label: 'ChatOps规则过滤', value: 12, extra: { color: 'purple' } },
  { label: 'ChatOps规则限制', value: 13, extra: { color: 'magenta' } },
] as const;

/**
 * Event status mapping
 */
export const EVENT_STATUS_MAP = EVENT_STATUS_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.value] = cur;
    return acc;
  },
  {} as Record<number, (typeof EVENT_STATUS_OPTIONS)[number]>,
);

/**
 * Event type options
 */
export const EVENT_TYPE_OPTIONS = [
  { label: '系统告警', value: 'system_alert' },
  { label: '应用异常', value: 'app_exception' },
  { label: '性能告警', value: 'performance_alert' },
  { label: '安全事件', value: 'security_event' },
  { label: '业务异常', value: 'business_exception' },
  { label: '基础设施告警', value: 'infrastructure_alert' },
] as const;

/**
 * Priority options
 */
export const PRIORITY_OPTIONS = [
  { label: '紧急', value: 'critical', color: 'red' },
  { label: '高', value: 'high', color: 'orange' },
  { label: '中', value: 'medium', color: 'blue' },
  { label: '低', value: 'low', color: 'gray' },
] as const;
