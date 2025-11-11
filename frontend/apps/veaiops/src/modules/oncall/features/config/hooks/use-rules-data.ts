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

import { ruleService } from '@oncall/lib';
import {
  type CustomTableActionType,
  useBusinessTable,
} from '@veaiops/components';
import { API_RESPONSE_CODE } from '@veaiops/constants';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
  logger,
} from '@veaiops/utils';
import type { Bot, Interest } from 'api-generate';
import { type React, useMemo } from 'react';

export interface UseRulesDataProps {
  bots: Bot[];
  ref?: React.Ref<CustomTableActionType<Interest>>;
}

/**
 * 内聚型Hook - 规则数据逻辑
 * 负责业务逻辑：数据源配置、API调用
 * 使用 CustomTable 的自动刷新机制
 */
export const useRulesData = ({ bots, ref }: UseRulesDataProps) => {
  // 🎯 数据请求函数 - 使用工具函数
  // 注意：将复杂对象参数提取为变量，避免 TypeScript 解析错误（TS1136）
  // 原因：options 对象包含嵌套的 onError 回调，可能导致解析器无法正确识别对象边界
  const requestOptions = useMemo(
    () => ({
      errorMessagePrefix: '获取Oncall规则失败',
      defaultLimit: 10,
      onError: (error: unknown) => {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error({
          message: '获取Oncall规则失败',
          data: {
            error: errorObj.message,
            stack: errorObj.stack,
            errorObj,
          },
          source: 'useRulesData',
          component: 'request',
        });
      },
    }),
    [],
  );

  const request = useMemo(
    () =>
      createTableRequestWithResponseHandler({
        apiCall: async ({
          botId,
          ...otherParams
        }: { botId?: unknown; [key: string]: unknown }) => {
          if (!botId || typeof botId !== 'string') {
            return {
              code: API_RESPONSE_CODE.SUCCESS,
              data: [],
              total: 0,
              message: '',
            };
          }

          const selectedBot = bots.find((bot) => bot.bot_id === botId);
          if (!selectedBot) {
            return {
              code: API_RESPONSE_CODE.SUCCESS,
              data: [],
              total: 0,
              message: '',
            };
          }

          // ✅ 修复：Bot.channel 是枚举类型，枚举值是字符串（如 'Lark', 'DingTalk'）
          // API 期望 string 类型，需要将枚举值转换为字符串
          // 使用类型守卫确保类型安全
          let channelValue = '';
          if (selectedBot.channel != null) {
            if (typeof selectedBot.channel === 'string') {
              channelValue = selectedBot.channel;
            } else {
              channelValue = String(selectedBot.channel);
            }
          }
          const response = await ruleService.getRulesByAppId(
            channelValue,
            botId,
            otherParams,
          );
          // 类型转换：APIResponseInterestList 与 StandardApiResponse<Interest[]> 结构兼容
          return response as unknown as StandardApiResponse<Interest[]>;
        },
        options: requestOptions,
      }),
    [bots, requestOptions],
  );

  // 🎯 数据源配置 - 使用工具函数
  const dataSource = useMemo(
    () =>
      createServerPaginationDataSource({
        request,
        ready: bots.length > 0,
      }),
    [request, bots.length],
  );

  // 🎯 表格配置 - 使用工具函数
  const tableProps = useMemo(
    () =>
      createStandardTableProps({
        rowKey: 'uuid',
        pageSize: 10,
      }) as Record<string, unknown>,
    [],
  );

  // 使用 useBusinessTable
  // 注意：ref 类型使用断言适配，因为 useBusinessTable 的 ref 类型是通用的 CustomTableActionType
  const { customTableProps, operations } = useBusinessTable({
    dataSource,
    tableProps,
    refreshConfig: {
      enableRefreshFeedback: true,
      successMessage: '刷新成功',
      errorMessage: '刷新失败，请重试',
    },
    // ✅ 修复：useBusinessTable 现在支持泛型参数，无需使用 as any
    ref,
  });

  return {
    customTableProps,
    operations,
  };
};
