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

import apiClient from '@/utils/api-client';
import { API_RESPONSE_CODE } from '@veaiops/constants';
import { logger } from '@veaiops/utils';

/**
 * 检查 App ID 是否重复
 *
 * @param appId - 待检查的 App ID
 * @returns 如果重复返回错误消息，否则返回 undefined
 */
export const checkAppIdDuplicate = async (
  appId: string,
): Promise<string | undefined> => {
  if (!appId || !appId.trim()) {
    return undefined;
  }

  try {
    // 注意：此处假设后端有 checkAppIdDuplicate 接口
    // TODO: 如果后端没有此接口，需要使用 getBots 查询判断
    const response = await apiClient.bots.getApisV1ManagerSystemConfigBots({
      app_id: appId.trim(),
      limit: 1,
    });

    if (response.code === API_RESPONSE_CODE.SUCCESS) {
      // 如果查询到数据，说明 App ID 已存在
      if (response.data && response.data.length > 0) {
        return 'App ID 已存在，请使用其他 App ID';
      }
      return undefined;
    } else {
      logger.warn({
        message: 'App ID 重复检查失败',
        data: {
          appId,
          code: response.code,
          message: response.message,
        },
        source: 'validation',
        component: 'checkAppIdDuplicate',
      });
      return undefined; // 检查失败时不阻止用户继续操作
    }
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error({
      message: 'App ID 重复检查异常',
      data: {
        appId,
        error: errorObj.message,
        stack: errorObj.stack,
        errorObj,
      },
      source: 'validation',
      component: 'checkAppIdDuplicate',
    });
    return undefined; // 异常时不阻止用户继续操作
  }
};
