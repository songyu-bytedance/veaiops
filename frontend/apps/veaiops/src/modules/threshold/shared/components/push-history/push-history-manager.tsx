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

import { HistoryDetailDrawer } from '@/modules/event-center/features/history/ui';
import { detectModuleTypeFromPath } from '@/types/module';
import { useLocation } from '@modern-js/runtime/router';
import type { Event } from 'api-generate';
import { type React, useCallback, useMemo, useState } from 'react';
import { PushHistoryTable } from './push-history-table';
import type { PushHistoryManagerProps, PushHistoryRecord } from './types';

/**
 * 通用推送历史管理组件
 * @description 提供推送历史的查看和管理功能，支持根据模块类型进行过滤
 *
 * 重构说明：
 * - 使用 shared 目录下的 PushHistoryTable 组件
 * - 使用正确的 Hook 和配置
 * - 提供完整的事件详情查看功能
 */
const PushHistoryManager: React.FC<PushHistoryManagerProps> = ({
  moduleType,
  showModuleTypeColumn = true,
  customActions,
}) => {
  const location = useLocation();
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Event | null>(null);

  // 根据路由自动判断模块类型
  const detectedModuleType = useMemo(() => {
    if (moduleType) {
      return moduleType;
    }

    return detectModuleTypeFromPath(location.pathname);
  }, [moduleType, location.pathname]);

  /**
   * 将推送历史记录转换为事件详情组件可处理的格式
   */
  const transformPushRecordToEvent = useCallback(
    (pushRecord: PushHistoryRecord) => {
      return {
        event_id:
          pushRecord._id ||
          ((pushRecord as Record<string, unknown>).id as string) ||
          '',
        agent_type: pushRecord.agent_type || 'unknown',
        event_level: pushRecord.event_level || 'P2',
        status: pushRecord.status === 3 ? 1 : 0, // 3表示成功，其他表示失败
        raw_data: pushRecord.raw_data || pushRecord,
        created_at: pushRecord.created_at,
        updated_at: pushRecord.updated_at,
        datasource_type: pushRecord.datasource_type || pushRecord.agent_type,
        region: pushRecord.region || [],
        project: pushRecord.project || [],
        product: pushRecord.product || [],
        customer: pushRecord.customer || [],
        channel_msg: pushRecord.channel_msg || null,
      };
    },
    [],
  );

  /**
   * 查看详情
   * 🔧 使用 useCallback 避免每次渲染都创建新函数
   */
  const handleViewDetail = useCallback(
    (record: PushHistoryRecord) => {
      const transformedRecord = transformPushRecordToEvent(record);
      setSelectedRecord(transformedRecord as Event);
      setDetailDrawerVisible(true);
    },
    [transformPushRecordToEvent],
  );

  /**
   * 关闭详情抽屉
   * 🔧 使用 useCallback 避免每次渲染都创建新函数
   */
  const handleCloseDetail = useCallback(() => {
    setDetailDrawerVisible(false);
    setSelectedRecord(null);
  }, []);

  return (
    <>
      {/* 推送历史表格 */}
      <PushHistoryTable
        moduleType={detectedModuleType}
        title="历史事件"
        showModuleTypeColumn={showModuleTypeColumn}
        customActions={customActions}
        onViewDetail={handleViewDetail}
      />

      {/* 事件详情抽屉 */}
      <HistoryDetailDrawer
        visible={detailDrawerVisible}
        selectedRecord={selectedRecord}
        onClose={handleCloseDetail}
      />
    </>
  );
};

export { PushHistoryManager };
