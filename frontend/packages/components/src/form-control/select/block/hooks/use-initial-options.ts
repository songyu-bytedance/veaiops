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

import { logger as utilLogger } from '@veaiops/utils';
import { useEffect } from 'react';
import type React from 'react';
import type { SelectBlockState } from '../../types/plugin';

interface UseInitialOptionsParams {
  currentState: SelectBlockState | undefined;
  dataSource: unknown;
  initialOptions: unknown;
  dependency: unknown;
  pluginManagerRef: React.MutableRefObject<any>;
  addDebugLog: (action: string, data: Record<string, unknown>) => void;
}

export const useInitialOptions = ({
  currentState,
  dataSource,
  initialOptions,
  dependency,
  pluginManagerRef,
  addDebugLog,
}: UseInitialOptionsParams) => {
  useEffect(() => {
    const hasInitialOptions = Boolean(
      initialOptions &&
        Array.isArray(initialOptions) &&
        initialOptions.length > 0,
    );

    const shouldHandleInitialOptions = Boolean(
      !currentState?.searchValue && !dataSource && hasInitialOptions,
    );

    utilLogger.debug({
      message: 'useInitialOptions effect triggered',
      data: {
        hasInitialOptions,
        shouldHandleInitialOptions,
        searchValue: currentState?.searchValue,
        hasDataSource: Boolean(dataSource),
        dependency: JSON.stringify(dependency),
      },
      source: 'SelectBlock',
      component: 'UseInitialOptions',
    });

    if (!shouldHandleInitialOptions) {
      return;
    }

    addDebugLog('TRIGGERING_RERENDER_FOR_INITIAL_OPTIONS', {
      reason: 'dependency change with initialOptions but no dataSource',
    });

    // ⚠️ 修复死循环：移除手动更新 stateVersion 的逻辑
    // 手动更新 stateVersion 会触发其他 effect，导致死循环
    // 如果需要强制重新渲染，应该通过其他机制实现
    utilLogger.info({
      message: 'Initial options ready (skipped manual stateVersion update)',
      data: {
        initialOptionsLength: Array.isArray(initialOptions)
          ? initialOptions.length
          : 0,
        dependency: JSON.stringify(dependency),
      },
      source: 'SelectBlock',
      component: 'UseInitialOptions',
    });

    // ❌ 移除：手动更新 stateVersion 导致死循环
    // pluginManagerRef.current?.setState({
    //   stateVersion:
    //     (pluginManagerRef.current?.getState()?.stateVersion || 0) + 1,
    // });
    // 🔧 修复死循环：优化依赖数组，移除不必要的依赖
    // 符合 .cursorrules 中的 "useDataSource 精确依赖规范"
  }, [
    currentState?.searchValue, // ✅ 只依赖需要的字段
    dataSource,
    initialOptions,
    dependency,
    // pluginManagerRef, // ❌ 移除：ref 不应该在依赖数组中
    // addDebugLog, // ❌ 移除：函数引用稳定，不需要在依赖数组中
  ]);
};
