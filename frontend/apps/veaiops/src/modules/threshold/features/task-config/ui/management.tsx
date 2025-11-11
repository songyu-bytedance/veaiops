import { logger } from '@veaiops/utils';
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
import type {
  IntelligentThresholdTask,
  MetricThresholdResult,
} from 'api-generate';
import { type React, useCallback, useEffect, useRef, useState } from 'react';
import {
  useDatasourceDetail,
  useTaskManagementLogic,
  useUrlParams,
} from '../hooks';
import { AlarmDrawer } from './alarm';
import { DatasourceDetailDrawer } from './components/drawers';
import { BatchRerunModal, TimeseriesChartModal } from './components/modals';
import { TaskDrawer, TaskTable, type TaskTableRef } from './task';

/**
 * 智能阈值任务管理页面
 * 提供任务的增删改查功能 - 使用 CustomTable 和业务逻辑分离
 *
 * 架构特点：
 * - 使用自定义Hook封装业务逻辑
 * - 组件职责单一，易于维护
 * - 状态管理与UI渲染分离
 * - 支持配置化和扩展
 * - 使用CustomTable提供高级表格功能
 */
const TaskManagement: React.FC = () => {
  // 表格引用，用于调用刷新方法
  const tableRef = useRef<TaskTableRef>(null);

  // URL 参数管理
  const { getParam } = useUrlParams();

  // 🔍 记录页面加载时的状态
  useEffect(() => {
    logger.info({
      message: '[TaskManagement] ========== 页面加载/刷新 ==========',
      data: {
        windowLocationHref:
          typeof window !== 'undefined' ? window.location.href : 'N/A',
        windowLocationSearch:
          typeof window !== 'undefined' ? window.location.search : 'N/A',
        windowLocationPathname:
          typeof window !== 'undefined' ? window.location.pathname : 'N/A',
        // 解析 URL 参数
        urlParams:
          typeof window !== 'undefined'
            ? (() => {
                const params = new URLSearchParams(window.location.search);
                const result: Record<string, string> = {};
                for (const [key, value] of params.entries()) {
                  result[key] = value;
                }
                return result;
              })()
            : {},
        urlParamsDatasourceType:
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('datasource_type')
            : undefined,
        timestamp: new Date().toISOString(),
      },
      source: 'TaskManagement',
      component: 'useEffect_pageLoad',
    });
  }, []);

  // 时序图模态框状态
  const [timeseriesModalVisible, setTimeseriesModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] =
    useState<MetricThresholdResult | null>(null);
  const [selectedTaskForTimeseries, setSelectedTaskForTimeseries] =
    useState<IntelligentThresholdTask | null>(null);

  interface HandleViewTimeSeriesParams {
    record: MetricThresholdResult;
    task?: IntelligentThresholdTask;
  }

  // 处理查看时序图（内部使用对象参数）
  const handleViewTimeSeriesInternal = ({
    record,
    task,
  }: HandleViewTimeSeriesParams) => {
    setSelectedMetric(record);
    setSelectedTaskForTimeseries(task || null);
    setTimeseriesModalVisible(true);
  };

  // 适配外部接口的位置参数格式（注意：第三方库回调必须使用位置参数）
  const handleViewTimeSeries = (
    record: MetricThresholdResult,
    task?: IntelligentThresholdTask,
  ) => {
    handleViewTimeSeriesInternal({ record, task });
  };

  // 🎯 创建稳定的刷新函数引用
  const refreshTable = useCallback(async () => {
    if (tableRef.current?.refresh) {
      return await tableRef.current.refresh();
    }
    return { success: false, error: new Error('表格刷新函数未准备就绪') };
  }, []);

  // 🎯 使用自定义Hook获取所有业务逻辑，传入稳定的刷新函数用于新增和编辑操作后刷新
  const {
    // 状态
    drawerVisible,
    alarmDrawerVisible,
    batchRerunModalVisible,
    setBatchRerunModalVisible,
    editingTask,
    operationType,
    selectedTasks,
    loading,
    form,
    taskList,

    // 事件处理器
    handleAdd,
    handleRerun,
    handleViewVersions,
    handleCreateAlarm,
    handleCopy,
    handleBatchRerun,
    handleDelete,
    handleCancel,
    handleSubmit,
    handleAlarmSubmit,
    handleTaskDetail,
    // 选择处理
    setSelectedTasks,
  } = useTaskManagementLogic(
    // ✅ 传入稳定的刷新函数，用于新增和编辑操作成功后刷新表格
    refreshTable,
  );

  // 占位符处理器 - edit通过详情处理
  const handleEdit = (task: IntelligentThresholdTask) => {
    handleTaskDetail(task);
  };

  // 处理 URL 参数中的 taskName，自动打开对应任务的详情抽屉
  useEffect(() => {
    const taskNameFromUrl = getParam('taskName');
    if (taskNameFromUrl && taskList.length > 0 && !drawerVisible) {
      // 根据 taskName 查找对应的任务
      const targetTask = taskList.find(
        (task) => task.task_name === taskNameFromUrl,
      );
      if (targetTask) {
        handleTaskDetail(targetTask);
      }
    }
  }, [getParam, taskList, drawerVisible, handleTaskDetail]);

  // 数据源详情管理
  const {
    datasource,
    loading: datasourceLoading,
    visible: datasourceDrawerVisible,
    fetchDatasourceDetail,
    handleClose: handleCloseDatasourceDrawer,
  } = useDatasourceDetail();

  // 处理查看数据源详情
  const handleViewDatasource = useCallback(
    (task: IntelligentThresholdTask) => {
      if (!task.datasource_id) {
        logger.warn({
          message: '任务缺少数据源ID',
          data: { taskId: task._id, taskName: task.task_name },
          source: 'TaskManagement',
          component: 'handleViewDatasource',
        });
        return;
      }

      // 数据源类型映射：任务的 datasource_type 到 API 需要的类型
      const datasourceType = task.datasource_type as
        | 'Volcengine'
        | 'Aliyun'
        | 'Zabbix';

      fetchDatasourceDetail({
        datasourceId: task.datasource_id,
        datasourceType,
      });
    },
    [fetchDatasourceDetail],
  );

  // 批量重新执行成功后的回调
  const handleBatchRerunSuccess = async () => {
    setSelectedTasks([]);
    // 🎯 批量操作成功后，手动调用表格刷新
    if (tableRef.current) {
      const refreshResult = await tableRef.current.refresh();
      if (!refreshResult.success && refreshResult.error) {
        logger.warn({
          message: '批量操作后刷新表格失败',
          data: {
            error: refreshResult.error.message,
            stack: refreshResult.error.stack,
            errorObj: refreshResult.error,
          },
          source: 'TaskManagement',
          component: 'handleBatchRerunSuccess',
        });
      }
    }
  };

  return (
    <>
      {/* 任务表格组件 - 使用CustomTable */}
      <TaskTable
        ref={tableRef}
        onEdit={handleEdit}
        onRerun={handleRerun}
        onViewVersions={handleViewVersions}
        onCreateAlarm={handleCreateAlarm}
        onCopy={handleCopy}
        onAdd={handleAdd}
        onBatchRerun={handleBatchRerun}
        onDelete={handleDelete}
        selectedTasks={selectedTasks}
        onSelectedTasksChange={setSelectedTasks}
        handleTaskDetail={handleTaskDetail}
        onViewDatasource={handleViewDatasource}
      />

      {/* 任务抽屉组件 */}
      <TaskDrawer
        visible={drawerVisible}
        operationType={operationType}
        editingTask={editingTask || null}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        form={form}
        loading={loading}
        onViewTimeSeries={handleViewTimeSeries}
      />

      {/* 告警规则创建抽屉 */}
      <AlarmDrawer
        visible={alarmDrawerVisible}
        task={editingTask || null}
        onCancel={handleCancel}
        onSubmit={async (payload) => {
          // payload 类型是 SyncAlarmRulesPayload，直接传递即可
          return await handleAlarmSubmit(payload);
        }}
        loading={loading}
      />

      {/* 时序图模态框 */}
      <TimeseriesChartModal
        visible={timeseriesModalVisible}
        onClose={() => {
          setTimeseriesModalVisible(false);
          setSelectedMetric(null);
          setSelectedTaskForTimeseries(null);
        }}
        metric={selectedMetric}
        task={selectedTaskForTimeseries}
      />

      {/* 批量重新执行确认弹窗 */}
      <BatchRerunModal
        visible={batchRerunModalVisible}
        taskIds={selectedTasks}
        onClose={() => setBatchRerunModalVisible(false)}
        onSuccess={handleBatchRerunSuccess}
      />

      {/* 数据源详情抽屉 */}
      <DatasourceDetailDrawer
        visible={datasourceDrawerVisible}
        datasource={datasource}
        loading={datasourceLoading}
        onClose={handleCloseDatasourceDrawer}
      />
    </>
  );
};

export { TaskManagement };
export default TaskManagement;
