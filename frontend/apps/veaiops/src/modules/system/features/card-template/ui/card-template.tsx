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
import { Message } from '@arco-design/web-react';
import { useCardTemplateTableConfig } from '@card-template';
import { CustomTable } from '@veaiops/components';
import type { AgentTemplate } from 'api-generate';
import { useEffect, useState } from 'react';
import { CardTemplateGuide } from './components/guide';
import CardTemplateDrawer from './components/modal';

/**
 * 事件中心 - 卡片模版管理页面
 * @description 提供消息卡片模版的创建、管理和配置功能
 * 🎯 使用 Hook 聚合模式 + 自动刷新机制

 */
export const CardTemplateManagement: React.FC = () => {
  const [, setData] = useState<AgentTemplate[]>([]);
  const [, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);

  // 🎯 使用内聚的表格配置 Hook（包含所有业务逻辑）
  const {
    // 表格配置
    customTableProps,
    tableRef, // ⭐ 获取 ref，用于传递给 CustomTable
    handleColumns,
    handleFilters,
    renderActions,
    queryFormat,

    // 业务逻辑状态
    modalVisible,
    editingTemplate,
    form,

    // 业务逻辑处理器
    handleCancel,
    handleSubmit,
  } = useCardTemplateTableConfig({});

  // 检查是否需要显示引导页面
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        setLoading(true);
        const response =
          await apiClient.agentTemplate.getApisV1ManagerEventCenterAgentTemplate(
            {
              limit: 10,
              skip: 0,
            },
          );

        if (response.data && response.data.length === 0) {
          setShowGuide(true);
          setGuideVisible(true);
        }
        setData(response.data || []);
      } catch (error) {
        // ✅ 正确：透出实际的错误信息
        const errorMessage =
          error instanceof Error ? error.message : '获取模版列表失败，请重试';
        Message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    checkInitialState();
  }, []);

  // 如果是初始状态且列表为空，显示引导页面
  if (showGuide && guideVisible) {
    return (
      <div className="page-container">
        <CardTemplateGuide
          visible={guideVisible}
          onClose={() => setGuideVisible(false)}
          onComplete={() => {
            setShowGuide(false);
            setGuideVisible(false);
            // 刷新页面数据
            // window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <CustomTable
        ref={tableRef} // ⭐ 必须传递 ref，用于刷新机制
        title="卡片模版管理"
        handleColumns={handleColumns}
        handleFilters={handleFilters}
        actions={renderActions({})}
        isAlertShow={true}
        syncQueryOnSearchParams
        useActiveKeyHook
        queryFormat={queryFormat}
        {...customTableProps}
      />
      <CardTemplateDrawer
        visible={modalVisible}
        editingTemplate={editingTemplate || undefined}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        form={form}
      />
    </div>
  );
};
