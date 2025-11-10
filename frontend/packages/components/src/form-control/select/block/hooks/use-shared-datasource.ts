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
import type { SelectBlockState } from '../../types/plugin';

interface UseSharedDatasourceParams {
  dataSourceShare: boolean;
  currentState: SelectBlockState | undefined;
  _canFetch: boolean;
  dataSource: unknown;
  shouldFetchDueToValueEmpty: boolean;
  isFirstHint: boolean;
  _fetchOptions: () => void;
  addDebugLog: (action: string, data: Record<string, unknown>) => void;
}

export const useSharedDatasource = ({
  dataSourceShare,
  currentState,
  _canFetch,
  dataSource,
  shouldFetchDueToValueEmpty,
  isFirstHint,
  _fetchOptions,
  addDebugLog,
}: UseSharedDatasourceParams) => {
  useEffect(() => {
    utilLogger.debug({
      message: 'useSharedDatasource effect triggered',
      data: {
        dataSourceShare,
        hasCurrentState: Boolean(currentState),
        searchValue: currentState?.searchValue,
        _canFetch,
        hasDataSource: Boolean(dataSource),
        shouldFetchDueToValueEmpty,
        isFirstHint,
      },
      source: 'SelectBlock',
      component: 'UseSharedDatasource',
    });

    if (!dataSourceShare) {
      return;
    }

    const shouldFetch = Boolean(
      (currentState && !currentState.searchValue && _canFetch && dataSource) ||
        shouldFetchDueToValueEmpty,
    );

    if (!shouldFetch) {
      utilLogger.debug({
        message: 'Skip fetch - conditions not met',
        data: {
          hasCurrentState: Boolean(currentState),
          searchValue: currentState?.searchValue,
          _canFetch,
          hasDataSource: Boolean(dataSource),
          shouldFetchDueToValueEmpty,
        },
        source: 'SelectBlock',
        component: 'UseSharedDatasource',
      });
      return;
    }

    if (isFirstHint) {
      addDebugLog('TRIGGERING_FETCH_IMMEDIATE', {
        reason: 'dataSourceShare + isFirstHint',
      });
      utilLogger.info({
        message: 'Triggering immediate fetch',
        data: { reason: 'dataSourceShare + isFirstHint' },
        source: 'SelectBlock',
        component: 'UseSharedDatasource',
      });
      _fetchOptions();
    } else {
      addDebugLog('TRIGGERING_FETCH_DELAYED', {
        reason: 'dataSourceShare + !isFirstHint',
      });
      utilLogger.info({
        message: 'Triggering delayed fetch (1000ms)',
        data: { reason: 'dataSourceShare + !isFirstHint' },
        source: 'SelectBlock',
        component: 'UseSharedDatasource',
      });
      setTimeout(() => {
        _fetchOptions();
      }, 1000);
    }
    // 🔧 修复死循环：移除不必要的依赖
    // 符合 .cursorrules 中的 "useDataSource 精确依赖规范"
  }, [
    dataSourceShare,
    isFirstHint,
    currentState?.searchValue, // ✅ 只依赖需要的字段
    _canFetch,
    dataSource,
    shouldFetchDueToValueEmpty,
    _fetchOptions,
    // addDebugLog, // ❌ 移除：函数引用稳定，不需要在依赖数组中
  ]);
};
