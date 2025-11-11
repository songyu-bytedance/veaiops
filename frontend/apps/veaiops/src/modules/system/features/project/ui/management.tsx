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

import { useProject } from '@project';
import React, { useRef } from 'react';
import { ProjectCreateDrawer } from './create-drawer';
import { ProjectImportDrawer } from './import-drawer';
import { ProjectModal } from './modal';
import { ProjectTable } from './table';

/**
 * 项目管理页面
 * 提供项目的增删改查功能 - 使用 CustomTable 和标准化架构
 *
 * 架构特点：
 * - 使用自定义Hook封装业务逻辑
 * - 组件职责单一，易于维护
 * - 状态管理与UI渲染分离
 * - 支持配置化和扩展
 * - 使用CustomTable提供高级表格功能
 * - 集成真实API服务
 * - 🎯 使用 useBusinessTable 和 operationWrapper 实现自动刷新，无需手动管理 ref
 */
export const ProjectManagement: React.FC = () => {
  // 🎯 创建表格 ref，用于手动刷新表格
  const tableRef = useRef<{ refresh: () => Promise<void> }>(null);

  // 🎯 使用自定义Hook获取所有业务逻辑，传递表格刷新方法
  const {
    // 模态框状态
    modalVisible,
    editingProject,
    form,

    // 导入抽屉状态
    importDrawerVisible,
    uploading,

    // 新建抽屉状态
    createDrawerVisible,
    creating,

    // 事件处理器
    handleCancel,
    handleSubmit,
    handleDelete,
    handleImport,
    handleOpenImportDrawer,
    handleCloseImportDrawer,
    handleCreate,
    handleOpenCreateDrawer,
    handleCloseCreateDrawer,
  } = useProject({ tableRef });

  return (
    <>
      {/* 项目表格组件 - 使用CustomTable，自动刷新 */}
      <ProjectTable
        ref={tableRef}
        onDelete={handleDelete}
        onImport={handleOpenImportDrawer}
        onCreate={handleOpenCreateDrawer}
      />

      {/* 项目弹窗组件 */}
      <ProjectModal
        visible={modalVisible}
        editingProject={editingProject}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        form={form}
      />

      {/* 项目导入抽屉 */}
      <ProjectImportDrawer
        visible={importDrawerVisible}
        onClose={handleCloseImportDrawer}
        onImport={handleImport}
        loading={uploading}
      />

      {/* 新建项目抽屉 */}
      <ProjectCreateDrawer
        visible={createDrawerVisible}
        onClose={handleCloseCreateDrawer}
        onSubmit={handleCreate}
        loading={creating}
      />
    </>
  );
};
