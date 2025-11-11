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
 * Card Template Module - Type Definitions
 */

import type { Form } from '@arco-design/web-react';
import type {
  BaseQuery,
  CustomTableActionType,
  FieldItem,
  HandleFilterProps,
  ModernTableColumnProps,
  QueryFormat,
  useBusinessTable,
} from '@veaiops/components';
import type {
  AgentTemplate,
  AgentTemplateCreateRequest,
  AgentTemplateUpdateRequest,
  ChannelType,
} from 'api-generate';
import type React from 'react';

// =============================================================================
// Business Types
// =============================================================================

/**
 * Agent Template Query Parameters
 */
export interface AgentTemplateQuery {
  /** Agent type filter */
  agents?: string[];
  /** Channel type filter */
  channels?: ChannelType[];
  /** Template ID search */
  templateId?: string;
  /** Template name search */
  name?: string;
  /** Is active */
  is_active?: boolean;
  /** Create time range */
  createTimeRanges?: number[];
  /** Pagination - skip */
  skip?: number;
  /** Pagination - limit */
  limit?: number;
  /** Index signature to satisfy BaseQuery constraint */
  [key: string]: unknown;
}

/**
 * Create Agent Template Request - Using generated API type
 */
export type CreateAgentTemplateRequest = AgentTemplateCreateRequest;

/**
 * Update Agent Template Request - Using generated API type
 */
export type UpdateAgentTemplateRequest = AgentTemplateUpdateRequest;

/**
 * Guide Step Type
 */
export interface GuideStep {
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Step icon */
  icon?: React.ReactNode;
  /** Is completed */
  completed?: boolean;
  /** Action button */
  action?: {
    text: string;
    onClick: () => void;
  };
}

/**
 * Card Template Table Data Type
 */
export interface CardTemplateTableData extends AgentTemplate {
  key: string;
}

// =============================================================================
// Hook Types
// =============================================================================

/**
 * Options type for Card Template table config Hook
 */
export interface UseCardTemplateTableConfigOptions {
  onEdit?: (record: AgentTemplate) => Promise<boolean>;
  onDelete?: (templateId: string) => Promise<boolean>;
  onCreate?: () => Promise<boolean>;
  onToggleStatus?: (templateId: string, status: boolean) => Promise<boolean>;
  /**
   * Table ref, used for refresh operations
   * If not provided, a new ref will be created internally
   */
  ref?: React.RefObject<CustomTableActionType<AgentTemplate, BaseQuery>>;
}

/**
 * Return type for Card Template table config Hook
 */
export interface UseCardTemplateTableConfigReturn {
  // Table configuration
  customTableProps: Record<string, unknown>;
  customOperations: ReturnType<typeof useBusinessTable>['customOperations'];
  tableRef: React.RefObject<CustomTableActionType<AgentTemplate, BaseQuery>>;
  handleColumns: (
    props?: Record<string, unknown>,
  ) => ModernTableColumnProps<AgentTemplate>[];
  handleFilters: (props: HandleFilterProps<BaseQuery>) => FieldItem[];
  renderActions: (props?: Record<string, unknown>) => React.ReactNode[];
  queryFormat: QueryFormat;

  // Business logic state
  modalVisible: boolean;
  editingTemplate: AgentTemplate | null;
  form: ReturnType<typeof Form.useForm>[0];

  // Business logic handlers
  handleEdit: (template: AgentTemplate) => void;
  handleAdd: () => void;
  handleCancel: () => void;
  handleSubmit: (
    values: AgentTemplateCreateRequest | AgentTemplateUpdateRequest,
  ) => Promise<boolean>;
  handleDelete: (templateId: string) => Promise<boolean>;
}

/**
 * Parameters for updating template
 */
export interface UpdateTemplateParams {
  templateId: string;
  updateData: AgentTemplateUpdateRequest;
}
