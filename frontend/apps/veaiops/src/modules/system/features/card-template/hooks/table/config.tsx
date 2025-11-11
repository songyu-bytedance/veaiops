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
import { Button, Message } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import {
  type BaseQuery,
  type CustomTableActionType,
  type FieldItem,
  type HandleFilterProps,
  type ModernTableColumnProps,
  type QueryFormat,
  useBusinessTable,
} from '@veaiops/components';
import {
  type StandardApiResponse,
  createServerPaginationDataSource,
  createStandardTableProps,
  createTableRequestWithResponseHandler,
  queryArrayFormat,
  queryBooleanFormat,
} from '@veaiops/utils';
import type {
  AgentTemplate,
  AgentTemplateCreateRequest,
  AgentTemplateUpdateRequest,
} from 'api-generate';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  type UseCardTemplateTableConfigOptions,
  type UseCardTemplateTableConfigReturn,
  getCardTemplateColumns,
  getCardTemplateFilters,
} from '../../lib';
import { useCardTemplateCRUD } from '../crud';

/**
 * Get card template table column configuration parameters interface
 */
export interface GetCardTemplateTableColumnsParams {
  onEdit?: (record: AgentTemplate) => Promise<boolean>;
  onDelete?: (templateId: string) => Promise<boolean>;
  onToggleStatus?: (templateId: string, status: boolean) => Promise<boolean>;
}

/**
 * Get card template table column configuration
 */
export const getCardTemplateTableColumns = ({
  onEdit,
  onDelete,
}: GetCardTemplateTableColumnsParams): ModernTableColumnProps<AgentTemplate>[] => {
  return getCardTemplateColumns({
    onEdit,
    onDelete,
  });
};

/**
 * Card Template table configuration aggregation Hook
 *
 * 🎯 Hook aggregation pattern + auto refresh mechanism
 * - Use useBusinessTable to centrally manage table logic
 * - Implement auto refresh through operationWrapper
 * - Centrally manage data source, table configuration, column configuration, etc.
 *
 * @param options - Hook configuration options
 * @returns Table configuration and handlers
 */
export const useCardTemplateTableConfig = ({
  onEdit,
  onDelete,
  onCreate,
  onToggleStatus,
  ref: externalRef,
}: UseCardTemplateTableConfigOptions = {}): UseCardTemplateTableConfigReturn => {
  // 🎯 Use external ref or create new ref
  // ✅ Fix: Prioritize external ref to ensure using the same ref as page component
  const internalRef =
    useRef<CustomTableActionType<AgentTemplate, BaseQuery>>(null);
  const tableActionRef = externalRef || internalRef;

  // 🎯 Use CRUD Hook to manage business logic
  const crud = useCardTemplateCRUD();

  // 🎯 Data request logic - use utility functions
  // ✅ Fix: Use useMemo to stabilize request function, avoid creating new reference on every render
  const request = useMemo(() => {
    return createTableRequestWithResponseHandler({
      apiCall: async ({ skip, limit, ...otherParams }) => {
        const response =
          await apiClient.agentTemplate.getApisV1ManagerEventCenterAgentTemplate(
            {
              skip,
              limit,
              ...otherParams,
            },
          );

        // handleApiResponse internally handles optional code (supports PaginatedApiResponse)
        // PaginatedAPIResponseAgentTemplateList is compatible with StandardApiResponse structure
        return response as unknown as StandardApiResponse<AgentTemplate[]>;
      },
      options: {
        errorMessagePrefix: 'Failed to get card template list',
        defaultLimit: 10,
      },
    });
  }, []); // ✅ Empty dependency array, because API call logic doesn't depend on any props or state

  const requestRef = useRef(request);
  useEffect(() => {
    if (requestRef.current !== request) {
      requestRef.current = request;
    }
  }, [request]);

  // 🎯 Data source configuration - use utility functions
  const dataSource = useMemo(() => {
    return createServerPaginationDataSource({ request });
  }, [request]);

  const dataSourceRef = useRef(dataSource);
  useEffect(() => {
    if (dataSourceRef.current !== dataSource) {
      dataSourceRef.current = dataSource;
    }
  }, [dataSource]);

  // 🎯 Table configuration - use utility functions
  const tableProps = useMemo(
    () =>
      createStandardTableProps({
        rowKey: '_id',
        pageSize: 10,
        scrollX: 1200,
      }),
    [],
  );

  // 🎯 Business operation wrapper - auto refresh
  // ✅ Fix: Use handlers mechanism to ensure auto refresh after handleSubmit succeeds
  // Note: handleAdd and handleEdit only open modal, should not trigger refresh
  // Refresh should be triggered after handleSubmit (form submission succeeds)

  // Note: handlers.delete is no longer needed, because useBusinessTable will automatically wrap through wrappedHandlers
  // But for backward compatibility, we still provide an empty handlers object
  // Delete operation refresh logic has been handled in handleDeleteWithRefresh
  const handlers = useMemo(() => {
    return {
      // ✅ Create operation: auto refresh after form submission succeeds
      create: async () => {
        // Actual create logic is handled in handleSubmit
        // This is just a placeholder, real refresh will be triggered through afterCreate after handleSubmit succeeds
      },
      // ✅ Update operation: auto refresh after form submission succeeds
      update: async () => {
        // Actual update logic is handled in handleSubmit
        // This is just a placeholder, real refresh will be triggered through afterUpdate after handleSubmit succeeds
      },
      // ✅ Delete operation: must be included for auto refresh to work
      delete: async (id: string) => {
        return await crud.handleDelete(id);
      },
    };
  }, [crud.handleDelete]);

  const handlersRef = useRef(handlers);
  useEffect(() => {
    if (handlersRef.current !== handlers) {
      handlersRef.current = handlers;
    }
  }, [handlers]);

  const { customTableProps, operations } = useBusinessTable({
    dataSource,
    tableProps,
    handlers,
    refreshConfig: {
      enableRefreshFeedback: true,
      successMessage: 'Operation successful',
      errorMessage: 'Operation failed, please try again',
    },
    ref: tableActionRef, // ✅ Pass ref so operations.afterDelete can work properly
  });

  // ✅ Wrap crud.handleDelete, add refresh logic
  // Note: If external onDelete is provided, prioritize using it (already includes refresh logic)
  const handleDeleteWithRefresh = useCallback(
    async (templateId: string): Promise<boolean> => {
      // If external onDelete is provided, use it directly (assume external has handled refresh logic)
      if (onDelete) {
        return await onDelete(templateId);
      }

      // Use internal crud.handleDelete + refresh logic
      try {
        const success = await crud.handleDelete(templateId);
        if (success && operations.afterDelete) {
          // Refresh table after successful delete
          await operations.afterDelete();
        }
        return success;
      } catch (error) {
        // ✅ Correct: Pass through actual error information
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Delete failed, please try again';
        Message.error(errorMessage);
        return false;
      }
    },
    [onDelete, crud.handleDelete, operations.afterDelete],
  );

  // 🎯 Column configuration
  // ✅ Fix: Use handleDeleteWithRefresh that includes refresh logic
  // Note: crud.handleEdit returns void, needs to be wrapped as Promise<boolean> to satisfy type requirements
  const handleColumns = useCallback(
    (_props?: Record<string, unknown>) => {
      const editHandler =
        onEdit ??
        (async (record: AgentTemplate) => {
          crud.handleEdit(record);
          return true;
        });
      return getCardTemplateTableColumns({
        onEdit: editHandler,
        onDelete: handleDeleteWithRefresh,
        onToggleStatus,
      });
    },
    [onEdit, onToggleStatus, crud.handleEdit, handleDeleteWithRefresh],
  );

  // 🎯 Filter configuration
  const handleFilters = useCallback(
    (props: HandleFilterProps<BaseQuery>): FieldItem[] => {
      return getCardTemplateFilters({
        query: props.query,
        handleChange: props.handleChange,
      });
    },
    [],
  );

  // 🎯 Action configuration
  const renderActions = useCallback(
    (_props?: Record<string, unknown>) => {
      // Prioritize external onCreate, if not provided use internal crud.handleAdd
      const createHandler =
        onCreate ||
        (() => {
          crud.handleAdd();
        });
      return [
        <Button
          key="create"
          type="primary"
          icon={<IconPlus />}
          onClick={createHandler}
          data-testid="new-card-template-btn"
        >
          新建模版
        </Button>,
      ];
    },
    [onCreate, crud.handleAdd, crud.modalVisible],
  );

  // 🎯 Query format configuration
  const queryFormat: QueryFormat = useMemo(
    () => ({
      channels: queryArrayFormat,
      agents: queryArrayFormat,
      isActive: (params: { pre: unknown; value: unknown }) =>
        queryBooleanFormat({ value: params.value }),
    }),
    [],
  );

  // ✅ Fix: Wrap handleSubmit to ensure auto refresh after success
  const handleSubmit = useCallback(
    async (
      values: AgentTemplateCreateRequest | AgentTemplateUpdateRequest,
    ): Promise<boolean> => {
      // ✅ Save editingTemplate value first, because it may be cleared after handleSubmit executes
      const isUpdate = Boolean(crud.editingTemplate);

      const success = await crud.handleSubmit(values);

      if (success) {
        // Determine if it's create or update based on whether editingTemplate exists
        if (isUpdate) {
          await operations.afterUpdate();
        } else {
          await operations.afterCreate();
        }
      }
      return success;
    },
    [crud.handleSubmit, crud.editingTemplate, operations],
  );

  // ✅ Fix: Explicit return type to ensure correct type inference
  const result: UseCardTemplateTableConfigReturn = {
    // Table configuration
    customTableProps,
    customOperations: operations,
    tableRef: tableActionRef, // ⭐ Return ref, must be passed to CustomTable
    handleColumns,
    handleFilters,
    renderActions,
    queryFormat,

    // Business logic state
    modalVisible: crud.modalVisible,
    editingTemplate: crud.editingTemplate,
    form: crud.form,

    // Business logic handlers
    handleEdit: crud.handleEdit,
    handleAdd: crud.handleAdd,
    handleCancel: crud.handleCancel,
    handleSubmit,
    handleDelete: handleDeleteWithRefresh, // ✅ Use delete handler that includes refresh logic
  };

  return result;
};
