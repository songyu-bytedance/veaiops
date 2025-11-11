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

import { useBotAttributes } from '@bot/hooks';
import { ChannelType } from '@veaiops/api-client';
import type { AttributeKey } from 'api-generate';

/**
 * Bot属性Business logicHook
 */
export const useBotAttributesBusinessLogic = ({
  botId,
  channel,
}: {
  botId?: string;
  channel?: string;
}) => {
  // Business logic Hook
  // Note: botId 和 channel 可能为 undefined，但 useBotAttributes 需要非 undefined 值
  // If not provided，use default value ChannelType.LARK（during actual usagewill be validated by API）
  const { loading, createAttribute, updateAttribute, deleteAttribute } =
    useBotAttributes({
      botId: botId || '',
      channel: (channel || ChannelType.LARK) as ChannelType, // ✅ Use enum value instead of hardcoded string
    });

  return {
    loading,
    createAttribute,
    updateAttribute,
    deleteAttribute,
  };
};
