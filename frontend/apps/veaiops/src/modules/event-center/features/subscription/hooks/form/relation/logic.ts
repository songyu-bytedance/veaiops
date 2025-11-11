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

import { ModuleType } from '@/types/module';
import { EVENT_LEVEL_OPTIONS } from '@ec/shared';
import {
  AGENT_OPTIONS_EVENT_CENTER_SUBSCRIPTION,
  AGENT_OPTIONS_ONCALL_SUBSCRIPTION,
  AGENT_OPTIONS_THRESHOLD_FILTER,
} from '@veaiops/constants';
import type { InformStrategy } from 'api-generate';
import { useMemo, useState } from 'react';

/**
 * 订阅关系表单逻辑Hook
 * @param moduleType 模块类型，用于决定显示哪些Agent选项
 */
export const useSubscribeRelationFormLogic = (moduleType?: ModuleType) => {
  const [informStrategies] = useState<InformStrategy[]>([]);

  // 根据模块类型返回对应的Agent选项
  const agentTypeOptions = useMemo(() => {
    switch (moduleType) {
      case ModuleType.ONCALL:
        return AGENT_OPTIONS_ONCALL_SUBSCRIPTION;
      case ModuleType.INTELLIGENT_THRESHOLD:
        return AGENT_OPTIONS_THRESHOLD_FILTER;
      default:
        return AGENT_OPTIONS_EVENT_CENTER_SUBSCRIPTION;
    }
  }, [moduleType]);

  return {
    informStrategies,
    agentTypeOptions,
    eventLevelOptions: EVENT_LEVEL_OPTIONS,
  };
};
