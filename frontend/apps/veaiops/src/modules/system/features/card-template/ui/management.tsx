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
import { CardTemplateDrawer, CardTemplateGuide } from './components';

/**
 * Event Center - Card Template Management Page
 * @description Provides creation, management and configuration of message card templates
 * 🎯 Uses Hook aggregation pattern + auto-refresh mechanism

 */
export const CardTemplateManagement: React.FC = () => {
  const [, setData] = useState<AgentTemplate[]>([]);
  const [, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);

  // 🎯 Use cohesive Table configuration Hook (contains all Business logic)
  const {
    // Table configuration
    customTableProps,
    tableRef, // ⭐ Get ref, used to pass to CustomTable
    handleColumns,
    handleFilters,
    renderActions,
    queryFormat,

    // Business logic state
    modalVisible,
    editingTemplate,
    form,

    // Business logic handlers
    handleCancel,
    handleSubmit,
  } = useCardTemplateTableConfig({});

  // Check if guide page needs to be displayed
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
        // ✅ Correct: Extract actual error message
        const errorMessage =
          error instanceof Error ? error.message : '获取模版列表失败，请重试';
        Message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    checkInitialState();
  }, []);

  // If it's initial state and list is empty, show guide page
  if (showGuide && guideVisible) {
    return (
      <div className="page-container">
        <CardTemplateGuide
          visible={guideVisible}
          onClose={() => setGuideVisible(false)}
          onComplete={() => {
            setShowGuide(false);
            setGuideVisible(false);
            // Refresh page data
            // window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <CustomTable
        ref={tableRef} // ⭐ Must pass ref, used for refresh mechanism
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
