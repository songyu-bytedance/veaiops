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

import { Button, Empty, Modal, Space, Spin } from '@arco-design/web-react';
import { IconRefresh } from '@arco-design/web-react/icon';
import { RangePicker } from '@veaiops/components';
import { logger } from '@veaiops/utils';
import type { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import { useTimeseriesData } from '@task-config/hooks';
import {
  ChartLegend,
  TimeseriesChart,
} from '@task-config/ui/components/charts';
import type { TimeseriesChartModalProps } from '@task-config/ui/components/shared/types';
import styles from './index.module.less';

export const TimeseriesChartModal: React.FC<TimeseriesChartModalProps> = ({
  visible,
  onClose,
  metric,
  task,
}) => {
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    new Date(), // Now
  ]);

  const { loading, timeseriesData, fetchTimeseriesData } = useTimeseriesData({
    metric: metric || undefined,
    task: task || undefined,
    timeRange,
  });

  // Fetch data when modal opens or metric changes
  useEffect(() => {
    if (visible && metric) {
      logger.info({
        message: '🎯 TimeseriesChartModal useEffect 触发',
        data: {
          visible,
          hasMetric: Boolean(metric),
          metricName: metric?.name,
          hasTask: Boolean(task),
        },
        source: 'TimeseriesChartModal',
        component: 'useEffect',
      });
      fetchTimeseriesData();
    }
    // ✅ Remove fetchTimeseriesData from dependency array, as it's already stabilized with useCallback
  }, [visible, metric, task, timeRange, fetchTimeseriesData]);

  // Handle time range changes
  // Note: RangePicker's onChange must use positional parameters to match third-party library signature
  const handleTimeRangeChange = (dateString: string[], date: Dayjs[]): void => {
    if (date && date.length === 2) {
      setTimeRange([date[0].toDate(), date[1].toDate()]);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchTimeseriesData();
  };

  // Remove redundant debug logs
  return (
    <Modal
      title={
        <div className="flex gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">
              📈 指标历史时序图与阈值对比
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-normal text-gray-400">
            <span>指标名称: {metric?.name || '未知指标'}</span>
            {task && <span>| 数据源: {task.datasource_type}</span>}
          </div>
        </div>
      }
      style={{ width: 1000 }}
      visible={visible}
      onCancel={onClose}
      footer={null}
      className={`top-[50px] ${styles.timeseriesChartModal}`}
      focusLock={false}
    >
      <div className="mb-4">
        <Space>
          <RangePicker
            showTime
            value={timeRange}
            prefix={'时间'}
            onChange={handleTimeRangeChange}
            className="w-[350px]"
            disabledDate={(current) => {
              // Disable dates after today
              return current?.isAfter(new Date(), 'day');
            }}
          />
          <Button
            icon={<IconRefresh />}
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </div>

      {metric && <ChartLegend metric={metric} />}

      <div className="h-[500px] w-full">
        <Spin loading={loading} className="w-full h-full">
          {timeseriesData.length > 0 ? (
            <TimeseriesChart
              timeseriesData={timeseriesData}
              timeRange={timeRange}
            />
          ) : (
            <Empty
              description="暂无数据"
              className="h-[500px] flex flex-col justify-center items-center"
            />
          )}
        </Spin>
      </div>
    </Modal>
  );
};

export default TimeseriesChartModal;
