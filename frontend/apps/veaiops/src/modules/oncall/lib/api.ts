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
 * Oncall 模块 API 服务统一封装
 */

import apiClient from '@/utils/api-client';
import { logger } from '@veaiops/utils';
import type {
  APIResponseInterest,
  APIResponseInterestList,
  InterestUpdateRequest,
  OncallSchedule,
  OncallScheduleCreateRequest,
  OncallScheduleUpdateRequest,
} from 'api-generate';

// ============================================================
// Oncall 规则服务
// ============================================================

/**
 * Oncall 规则服务封装
 */
export const ruleService = {
  /**
   * 更新规则
   *
   * 为什么 data 参数使用 any：
   * - UpdateRuleRequest 类型已从 api-generate 中移除
   * - InterestUpdateRequest 类型定义不完整（缺少 inspect_history 字段）
   * - 后端 InterestPayload 支持 inspect_history，但 OpenAPI 规范未定义
   * - data 包含动态字段（根据 inspect_category 不同，包含不同的字段）
   *
   * TODO: 更新 OpenAPI 规范，在 InterestUpdateRequest 中添加 inspect_history 字段
   */
  updateRule: async (
    uuid: string,
    data: any,
  ): Promise<APIResponseInterest> => {
    // 将 UpdateRuleRequest 转换为 InterestUpdateRequest
    const requestBody: InterestUpdateRequest & { inspect_history?: number } = {
      name: data.name,
      description: data.description,
      level: data.level as InterestUpdateRequest.level | undefined,
      silence_delta: data.silence_delta,
      is_active: data.is_active,
      inspect_history: data.inspect_history,
      // 根据检测类别，只包含对应的字段（后端会自动忽略其他字段）
      examples_positive: data.examples_positive,
      examples_negative: data.examples_negative,
      regular_expression: data.regular_expression,
    };

    return await apiClient.oncallRule.putApisV1ManagerRuleCenterOncall({
      interestUuid: uuid,
      requestBody,
    });
  },

  /**
   * 更新规则激活状态
   *
   * 为什么返回类型使用 any：
   * - API 响应结构由 api-generate 自动生成
   * - 实际返回结构与标准 APIResponse 一致
   * - 调用方只检查 code 字段，不依赖完整类型
   *
   * TODO: 定义完整的响应类型或使用 api-generate 生成的类型
   */
  updateActiveStatus: async (
    uuid: string,
    isActive: boolean,
  ): Promise<any> => {
    return await apiClient.oncallRule.putApisV1ManagerRuleCenterOncallActive({
      interestUuid: uuid,
      requestBody: {
        is_active: isActive,
      },
    });
  },

  /**
   * 获取规则列表
   */
  getRulesByAppId: async (
    channel: string,
    botId: string,
    params?: Record<string, unknown>,
  ): Promise<APIResponseInterestList> => {
    return await apiClient.oncallRule.getApisV1ManagerRuleCenterOncall({
      channel,
      botId,
      ...(params || {}),
    });
  },
};

// ============================================================
// Oncall 值班计划服务
// ============================================================

/**
 * 获取值班计划列表的参数类型
 * TODO: 等待后端API实现后，从api-generate导入
 */
interface GetSchedulesParams {
  channel?: string;
  bot_id?: string;
  skip?: number;
  limit?: number;
}

/**
 * Oncall 值班计划服务封装
 * 对应 API: /apis/v1/manager/rule-center/oncall/{channel}/{bot_id}/oncall_schedule/
 */
export const scheduleService = {
  /**
   * 创建值班计划
   * POST /apis/v1/manager/rule-center/oncall/{channel}/{bot_id}/oncall_schedule/
   */
  createSchedule: async (
    channel: string,
    botId: string,
    data: OncallScheduleCreateRequest,
  ): Promise<{ code: number; message: string; data?: OncallSchedule }> => {
    // TODO: 等待后端实现 API
    logger.warn({
      message: 'createSchedule API not implemented yet',
      data: {
        channel,
        botId,
        data,
      },
      source: 'scheduleService',
      component: 'createSchedule',
    });
    return {
      code: 0,
      message: '创建成功（模拟）',
      data: {
        id: `schedule-${Date.now()}`,
        rule_id: botId,
        ...data,
      },
    };
  },

  /**
   * 获取值班计划列表
   * GET /apis/v1/manager/rule-center/oncall/{channel}/{bot_id}/oncall_schedule/
   */
  getSchedules: async (
    params: GetSchedulesParams,
  ): Promise<{
    code: number;
    message: string;
    data?: OncallSchedule[];
    total?: number;
    skip?: number;
    limit?: number;
  }> => {
    // TODO: 等待后端实现 API
    logger.warn({
      message: 'getSchedules API not implemented yet',
      data: { params },
      source: 'scheduleService',
      component: 'getSchedules',
    });
    return {
      code: 0,
      message: '获取成功（模拟）',
      data: [],
      total: 0,
      skip: params.skip || 0,
      limit: params.limit || 100,
    };
  },

  /**
   * 获取单个值班计划
   * GET /apis/v1/manager/rule-center/oncall/oncall_schedule/{schedule_id}
   */
  getScheduleById: async (
    scheduleId: string,
  ): Promise<{ code: number; message: string; data?: OncallSchedule }> => {
    // TODO: 等待后端实现 API
    logger.warn({
      message: 'getScheduleById API not implemented yet',
      data: { scheduleId },
      source: 'scheduleService',
      component: 'getScheduleById',
    });
    return {
      code: 0,
      message: '获取成功（模拟）',
      data: undefined,
    };
  },

  /**
   * 更新值班计划
   * PUT /apis/v1/manager/rule-center/oncall/oncall_schedule/{schedule_id}
   */
  updateSchedule: async (
    scheduleId: string,
    data: OncallScheduleUpdateRequest,
  ): Promise<{ code: number; message: string; data?: OncallSchedule }> => {
    // TODO: 等待后端实现 API
    logger.warn({
      message: 'updateSchedule API not implemented yet',
      data: {
        scheduleId,
        data,
      },
      source: 'scheduleService',
      component: 'updateSchedule',
    });
    return {
      code: 0,
      message: '更新成功（模拟）',
      data: undefined,
    };
  },

  /**
   * 删除值班计划
   * DELETE /apis/v1/manager/rule-center/oncall/oncall_schedule/{schedule_id}
   */
  deleteSchedule: async (
    scheduleId: string,
  ): Promise<{ code: number; message: string; data?: boolean }> => {
    // TODO: 等待后端实现 API
    logger.warn({
      message: 'deleteSchedule API not implemented yet',
      data: { scheduleId },
      source: 'scheduleService',
      component: 'deleteSchedule',
    });
    return {
      code: 0,
      message: '删除成功（模拟）',
      data: true,
    };
  },
};

// 向后兼容导出（保留原有的导出名称）
export const oncallRuleService = ruleService;
export const oncallScheduleService = scheduleService;
