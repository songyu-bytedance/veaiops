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

import type { TableProps } from '@arco-design/web-react/es/Table';
import {
  BOT_ATTRIBUTES_TABLE_INIT_QUERY,
  BOT_ATTRIBUTES_TABLE_SCROLL,
  type BotAttributeFiltersQuery,
  getBotAttributeFilters,
  getBotAttributesColumns,
} from '@bot/lib';
import { ChannelType } from '@veaiops/api-client';
import type { CustomTableActionType } from '@veaiops/components';
import type { BotAttribute } from 'api-generate';
import type React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { useBotAttributes } from '../main';

/**
 * Bot attributes table config Hook parameters
 */
export interface UseBotAttributesTableConfigParams {
  botId?: string;
  channel?: string;
  onDelete: (attribute: BotAttribute) => Promise<boolean>;
  tableRef: React.RefObject<
    CustomTableActionType<BotAttribute, BotAttributeFiltersQuery>
  >;
}

/**
 * Bot attributes table config Hook return value
 */
export interface UseBotAttributesTableConfigReturn {
  // Table configuration
  tableRef: React.RefObject<
    CustomTableActionType<BotAttribute, BotAttributeFiltersQuery>
  >;
  handleColumns: () => ReturnType<typeof getBotAttributesColumns>;
  handleFilters: typeof getBotAttributeFilters;
  initQuery: BotAttributeFiltersQuery;
  dataSource: {
    request: (params?: Record<string, unknown>) => Promise<unknown>;
    ready: boolean;
    responseItemsKey: string;
  };
  tableProps: (ctx: { loading: boolean }) => TableProps<BotAttribute>;
}

/**
 * Bot attributes table config Hook
 * Provides table data source configuration, column configuration, filter configuration, etc.
 */
export const useBotAttributesTableConfig = ({
  botId,
  channel,
  onDelete,
  tableRef,
}: UseBotAttributesTableConfigParams): UseBotAttributesTableConfigReturn => {
  // Business logic Hook
  // Note: botId and channel may be undefined, but useBotAttributes requires non-undefined values
  // If not provided, use default value ChannelType.LARK (will be validated by API during actual usage)
  const { fetchAttributes } = useBotAttributes({
    botId: botId || '',
    channel: (channel || ChannelType.LARK) as ChannelType, // ✅ Use enum value instead of hardcoded string
  });

  // Use ref to stabilize fetchAttributes function reference, avoid infinite loop
  const fetchAttributesRef = useRef(fetchAttributes);
  fetchAttributesRef.current = fetchAttributes;

  // Create a stable request function
  // Why use unknown: params parameter comes from CustomTable, may contain multiple types of parameters (page_req, query, filters, etc.)
  // Using unknown is safer than any, forces type checking before use
  const stableFetchAttributes = useCallback(
    (params?: Record<string, unknown>) => {
      return fetchAttributesRef.current(params);
    },
    [], // Empty dependency array, ensure function reference stability
  );

  // Table column configuration
  const handleColumns = useCallback(
    () => getBotAttributesColumns({ onDelete }),
    [onDelete],
  );

  // Filter configuration
  const handleFilters = getBotAttributeFilters;

  // ✅ Fix infinite loop: Use useMemo to stabilize dataSource object, avoid creating new reference on each render
  // According to spec: Directly returning object creates new reference on each render, triggers child component re-render
  const dataSource = useMemo(
    () => ({
      request: stableFetchAttributes,
      ready: true,
      responseItemsKey: 'data',
    }),
    [stableFetchAttributes],
  );

  return {
    tableRef,
    handleColumns,
    handleFilters,
    initQuery: BOT_ATTRIBUTES_TABLE_INIT_QUERY,
    dataSource,
    tableProps: (ctx): TableProps<BotAttribute> => ({
      loading: ctx.loading,
      rowKey: (record: BotAttribute) => record._id || '',
      pagination: false,
      scroll: BOT_ATTRIBUTES_TABLE_SCROLL,
    }),
  };
};
