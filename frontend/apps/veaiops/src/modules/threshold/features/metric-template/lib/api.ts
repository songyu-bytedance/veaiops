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

import { Message } from '@arco-design/web-react';
import { API_RESPONSE_CODE } from '@veaiops/constants';
import { logger } from '@veaiops/utils';
import type {
  APIResponse,
  APIResponseMetricTemplate,
  MetricTemplateCreateRequest,
  MetricTemplateUpdateRequest,
  PaginatedAPIResponseMetricTemplateList,
  ToggleActiveRequest,
} from 'api-generate';
import apiClient from '@/utils/api-client';

/**
 * Parameters for updating metric template
 */
interface UpdateTemplateParams {
  templateId: string;
  request: MetricTemplateUpdateRequest;
}

/**
 * Parameters for toggling active status
 */
interface ToggleParams {
  uid: string;
  data: ToggleActiveRequest;
}

/**
 * Metric Template Management API
 *
 * Contains CRUD operations and status toggle functionality for metric templates
 */
export const metricTemplateApi = {
  /**
   * Get metric template list (basic call, no user feedback)
   *
   * @param params Query parameters
   * @param params.skip Number of records to skip (pagination)
   * @param params.limit Number of records to return (pagination)
   * @returns Metric template list response
   */
  list: (params?: { skip?: number; limit?: number }): Promise<PaginatedAPIResponseMetricTemplateList> => {
    return apiClient.metricTemplate.getApisV1DatasourceTemplate(params || {});
  },

  /**
   * Get metric template list (with error handling and user feedback)
   *
   * @param params Query parameters
   * @returns Metric template list response
   */
  async listTemplates(params?: {
    skip?: number;
    limit?: number;
    name?: string;
  }): Promise<PaginatedAPIResponseMetricTemplateList> {
    try {
      const response = await apiClient.metricTemplate.getApisV1DatasourceTemplate({
        skip: params?.skip || 0,
        limit: params?.limit || 100,
      });

      if (response.code === API_RESPONSE_CODE.SUCCESS) {
        return response;
      } else {
        throw new Error(response.message || '获取指标模板列表失败');
      }
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const errorMessage = errorObj.message || '获取指标模板列表失败';

      logger.error({
        message: '获取指标模板列表失败',
        data: {
          error: errorMessage,
          stack: errorObj.stack,
          errorObj,
        },
        source: 'MetricTemplateAPI',
        component: 'listTemplates',
      });

      Message.error(errorMessage);
      throw errorObj;
    }
  },

  /**
   * Create metric template (basic call, no user feedback)
   *
   * @param data Create parameters
   * @returns API response
   */
  create: (data: MetricTemplateCreateRequest) => {
    return apiClient.metricTemplate.postApisV1DatasourceTemplate({
      requestBody: data,
    });
  },

  /**
   * Create metric template (with success feedback and error handling)
   *
   * @param request Create request parameters
   * @returns Created metric template response
   */
  async createTemplate(
    request: MetricTemplateCreateRequest,
  ): Promise<APIResponseMetricTemplate> {
    try {
      const response = await apiClient.metricTemplate.postApisV1DatasourceTemplate({
        requestBody: request,
      });

      if (response.code === API_RESPONSE_CODE.SUCCESS) {
        Message.success('指标模板创建成功');
        return response as APIResponseMetricTemplate;
      } else {
        throw new Error(response.message || '创建指标模板失败');
      }
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const errorMessage = errorObj.message || '创建指标模板失败';

      logger.error({
        message: '创建指标模板失败',
        data: {
          error: errorMessage,
          stack: errorObj.stack,
          errorObj,
        },
        source: 'MetricTemplateAPI',
        component: 'createTemplate',
      });

      Message.error(errorMessage);
      throw errorObj;
    }
  },

  /**
   * Get single metric template (basic call)
   *
   * @param uid Template unique identifier
   * @returns API response
   */
  get: (uid: string) => {
    return apiClient.metricTemplate.getApisV1DatasourceTemplate1({
      uid,
    });
  },

  /**
   * Get metric template details (with error handling and user feedback)
   *
   * @param templateId Template unique identifier
   * @returns Metric template details response
   */
  async getTemplate(templateId: string): Promise<APIResponseMetricTemplate> {
    try {
      const response = await apiClient.metricTemplate.getApisV1DatasourceTemplate1({
        uid: templateId,
      });

      if (response.code === API_RESPONSE_CODE.SUCCESS && response.data) {
        return response;
      } else {
        throw new Error(response.message || '获取指标模板详情失败');
      }
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const errorMessage = errorObj.message || '获取指标模板详情失败';

      logger.error({
        message: '获取指标模板详情失败',
        data: {
          error: errorMessage,
          stack: errorObj.stack,
          errorObj,
        },
        source: 'MetricTemplateAPI',
        component: 'getTemplate',
      });

      Message.error(errorMessage);
      throw errorObj;
    }
  },

  /**
   * Update metric template (basic call)
   *
   * @param params Update parameters
   * @param params.uid Template unique identifier
   * @param params.data Update data
   * @returns API response
   */
  update: ({ uid, data }: { uid: string; data: MetricTemplateUpdateRequest }) => {
    return apiClient.metricTemplate.putApisV1DatasourceTemplate({
      uid,
      requestBody: data,
    });
  },

  /**
   * Update metric template (with success feedback and error handling)
   *
   * @param params Update parameters
   * @param params.templateId Template unique identifier
   * @param params.request Update request data
   * @returns Updated metric template response
   */
  async updateTemplate({
    templateId,
    request,
  }: UpdateTemplateParams): Promise<APIResponseMetricTemplate> {
    try {
      const response = await apiClient.metricTemplate.putApisV1DatasourceTemplate({
        uid: templateId,
        requestBody: request,
      });

      if (response.code === API_RESPONSE_CODE.SUCCESS) {
        Message.success('指标模板更新成功');
        return response as APIResponseMetricTemplate;
      } else {
        throw new Error(response.message || '更新指标模板失败');
      }
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const errorMessage = errorObj.message || '更新指标模板失败';

      logger.error({
        message: '更新指标模板失败',
        data: {
          error: errorMessage,
          stack: errorObj.stack,
          errorObj,
        },
        source: 'MetricTemplateAPI',
        component: 'updateTemplate',
      });

      Message.error(errorMessage);
      throw errorObj;
    }
  },

  /**
   * Delete metric template (basic call)
   *
   * @param uid Template unique identifier
   * @returns API response
   */
  delete: (uid: string) => {
    return apiClient.metricTemplate.deleteApisV1DatasourceTemplate({
      uid,
    });
  },

  /**
   * Delete metric template (with success feedback and error handling)
   *
   * @param templateId Template unique identifier
   * @returns Delete success response
   */
  async deleteTemplate(templateId: string): Promise<APIResponse> {
    try {
      const response = await apiClient.metricTemplate.deleteApisV1DatasourceTemplate({
        uid: templateId,
      });

      if (response.code === API_RESPONSE_CODE.SUCCESS) {
        Message.success('指标模板删除成功');
        return response;
      } else {
        throw new Error(response.message || '删除指标模板失败');
      }
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      const errorMessage = errorObj.message || '删除指标模板失败';

      logger.error({
        message: '删除指标模板失败',
        data: {
          error: errorMessage,
          stack: errorObj.stack,
          errorObj,
        },
        source: 'MetricTemplateAPI',
        component: 'deleteTemplate',
      });

      Message.error(errorMessage);
      throw errorObj;
    }
  },

  /**
   * Toggle metric template active status
   *
   * @param params Toggle parameters
   * @param params.uid Template unique identifier
   * @param params.data Toggle request data
   * @returns API response
   */
  toggle: ({ uid, data }: ToggleParams) => {
    return apiClient.metricTemplate.putApisV1DatasourceTemplateToggle({
      uid,
      requestBody: data,
    });
  },
} as const;

export default metricTemplateApi;
