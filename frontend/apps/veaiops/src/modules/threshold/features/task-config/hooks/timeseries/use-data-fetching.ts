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
import type { MetricThresholdResult } from 'api-generate';
import { useCallback, useRef, useState } from 'react';
import { convertTimeseriesData } from '../../../ui/components/shared/data-utils';
import type { TimeseriesDataPoint } from '../../../ui/components/shared/types';
import type { RequestParams } from './types';
import { callTimeseriesApi } from './use-api-call';

/**
 * 数据获取Hook参数接口
 */
export interface UseDataFetchingParams {
  metric?: MetricThresholdResult;
  timeRange: [Date, Date];
  prepareRequestParams: () => RequestParams | null;
}

/**
 * 数据获取Hook
 * 负责获取和处理时序数据
 */
export const useDataFetching = ({
  metric,
  timeRange,
  prepareRequestParams,
}: UseDataFetchingParams) => {
  const [loading, setLoading] = useState(false);
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesDataPoint[]>(
    [],
  );
  // 用于防止竞态条件的请求计数器
  const requestIdRef = useRef(0);

  // 🔧 渲染计数器 - 用于检测死循环
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  if (renderCountRef.current > 50) {
    logger.error({
      message: '⚠️ useDataFetching 渲染次数过多，可能存在死循环！',
      data: {
        renderCount: renderCountRef.current,
      },
      source: 'useTimeseriesData',
      component: 'useDataFetching',
    });
  }

  // 获取时序数据 - 使用 useCallback 稳定化引用，避免死循环
  const fetchTimeseriesData = useCallback(async () => {
    logger.info({
      message: '📊 开始获取时序数据',
      data: {
        hasMetric: Boolean(metric),
        metricName: metric?.name,
        timeRange: timeRange.map((d) => d.toISOString()),
        requestId: requestIdRef.current + 1,
      },
      source: 'useTimeseriesData',
      component: 'fetchTimeseriesData',
    });

    const params = prepareRequestParams();
    if (!params) {
      logger.warn({
        message: '⚠️ 请求参数无效，取消获取',
        data: { hasMetric: Boolean(metric) },
        source: 'useTimeseriesData',
        component: 'fetchTimeseriesData',
      });
      return;
    }

    // 递增请求ID，用于检测竞态条件
    const currentRequestId = ++requestIdRef.current;

    logger.info({
      message: '🚀 准备调用时序数据API',
      data: {
        requestId: currentRequestId,
        datasourceType: params.datasourceTypeNormalized,
        metricName: metric?.name,
      },
      source: 'useTimeseriesData',
      component: 'fetchTimeseriesData',
    });

    setLoading(true);
    try {
      let response;

      try {
        response = await callTimeseriesApi(params);
        logger.info({
          message: '✅ 时序数据API调用成功',
          data: {
            requestId: currentRequestId,
            responseCode: response.code,
            hasData: Boolean(response.data),
          },
          source: 'useTimeseriesData',
          component: 'fetchTimeseriesData',
        });
      } catch (_apiError: unknown) {
        // ✅ 正确：使用 logger 记录错误，并透出实际错误信息
        const errorObj =
          _apiError instanceof Error ? _apiError : new Error(String(_apiError));
        logger.error({
          message: '❌ 时序数据API调用失败',
          data: {
            requestId: currentRequestId,
            error: errorObj.message,
            stack: errorObj.stack,
            errorObj,
            params,
          },
          source: 'useTimeseriesData',
          component: 'fetchTimeseriesData',
        });
        throw _apiError; // 重新抛出，让外层 catch 处理
      }

      // 检查是否是最新的请求（防止竞态条件）
      if (currentRequestId !== requestIdRef.current) {
        // ✅ 正确：使用 logger 记录信息
        logger.info({
          message: 'Request superseded, ignoring response',
          data: {
            currentRequestId,
            expectedRequestId: requestIdRef.current,
          },
          source: 'useTimeseriesData',
          component: 'fetchTimeseriesData',
        });
        return;
      }

      // 边界检查：响应必须存在
      if (!response) {
        Message.error('服务器响应为空');
        return;
      }

      // 边界检查：响应码和数据
      if (response.code === API_RESPONSE_CODE.SUCCESS) {
        // 边界检查：response.data 可能是 null、undefined 或不是数组
        if (!response.data) {
          // ✅ 正确：使用 logger 记录警告
          logger.warn({
            message: 'Response data is empty',
            data: { responseCode: response.code },
            source: 'useTimeseriesData',
            component: 'fetchTimeseriesData',
          });
          setTimeseriesData([]);
          Message.info('暂无数据');
          return;
        }

        const dataArray = Array.isArray(response.data) ? response.data : [];

        // 边界检查：数据数组为空
        if (dataArray.length === 0) {
          // ✅ 正确：使用 logger 记录信息
          logger.info({
            message: 'No timeseries data returned',
            data: { timeRange },
            source: 'useTimeseriesData',
            component: 'fetchTimeseriesData',
          });
          setTimeseriesData([]);
          Message.info('查询时间范围内暂无数据');
          return;
        }

        // 边界检查：数据量过大警告
        const totalDataPoints = dataArray.reduce((sum, item) => {
          return sum + (item.timestamps?.length || 0);
        }, 0);

        if (totalDataPoints > 10000) {
          Message.warning(
            `数据点数量较大 (${totalDataPoints})，图表渲染可能较慢`,
          );
        }

        try {
          // 边界检查：metric 必须存在
          if (!metric) {
            Message.error('指标信息无效');
            setTimeseriesData([]);
            return;
          }
          // metric 已经验证存在，类型为 MetricThresholdResult
          const chartData = convertTimeseriesData({
            backendData: dataArray,
            metric,
          });

          // 边界检查：转换后的数据应该有效
          if (!chartData || chartData.length === 0) {
            // ✅ 正确：使用 logger 记录警告
            logger.warn({
              message: 'Converted chart data is empty',
              data: { dataArrayLength: dataArray.length },
              source: 'useTimeseriesData',
              component: 'fetchTimeseriesData',
            });
            Message.info('数据转换后为空，可能是数据格式问题');
            setTimeseriesData([]);
            return;
          }

          setTimeseriesData(chartData);
        } catch (conversionError: unknown) {
          // ✅ 正确：使用 logger 记录错误，并透出实际错误信息
          const errorObj =
            conversionError instanceof Error
              ? conversionError
              : new Error(String(conversionError));
          logger.error({
            message: 'Data conversion error',
            data: {
              error: errorObj.message,
              stack: errorObj.stack,
              errorObj,
            },
            source: 'useTimeseriesData',
            component: 'fetchTimeseriesData',
          });
          const errorMessage =
            conversionError instanceof Error
              ? conversionError.message
              : '数据格式转换失败，请检查数据格式';
          Message.error(errorMessage);
          setTimeseriesData([]);
        }
      } else {
        // API 返回了错误码
        const errorMessage = response.message || '获取时序数据失败';
        Message.error(errorMessage);
        setTimeseriesData([]);
      }
    } catch (error: unknown) {
      // 只在请求未被取代时显示错误
      if (currentRequestId === requestIdRef.current) {
        // ✅ 正确：使用 logger 记录错误，并透出实际错误信息
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error({
          message: 'fetchTimeseriesData error',
          data: {
            error: errorObj.message,
            stack: errorObj.stack,
            errorObj,
          },
          source: 'useTimeseriesData',
          component: 'fetchTimeseriesData',
        });

        // 边界检查：错误对象的类型
        const errorMessage = errorObj.message || '获取时序数据失败';

        Message.error(errorMessage);
        setTimeseriesData([]);
      }
    } finally {
      // 只在请求未被取代时更新 loading 状态
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
        logger.info({
          message: '✅ 时序数据获取流程完成',
          data: {
            requestId: currentRequestId,
            dataPointsCount: timeseriesData.length,
          },
          source: 'useTimeseriesData',
          component: 'fetchTimeseriesData',
        });
      }
    }
  }, [prepareRequestParams, metric, timeRange]); // ✅ 添加依赖数组，稳定化函数引用

  return {
    loading,
    timeseriesData,
    fetchTimeseriesData,
    setTimeseriesData,
  };
};
