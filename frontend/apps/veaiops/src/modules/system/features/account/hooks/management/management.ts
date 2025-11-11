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

import { useAccountCrud } from './crud';
import { useAccountFormHandlers } from './form-handlers';
import { useAccountModalState } from './modal-state';

/**
 * 账号管理Hook参数接口
 */
export interface UseAccountManagementParams {
  refreshTable?: () => Promise<boolean>;
}

/**
 * 账号管理逻辑Hook
 *
 * 提供账号管理页面的所有业务逻辑，包括：
 * - CRUD 操作
 * - Modal 状态管理
 * - 表单处理
 *
 * ✅ 符合规范：使用对象解构参数（保持一致性）
 */
export const useAccountManagement = ({
  refreshTable,
}: UseAccountManagementParams = {}) => {
  // CRUD 操作
  const { createUser, updateUser, deleteUser } = useAccountCrud();

  // Modal 状态
  const {
    form,
    editingUser,
    modalVisible,
    setModalVisible,
    setEditingUser,
    handleEdit,
    handleAdd,
    handleCancel,
  } = useAccountModalState();

  // 表单处理器
  const { handleDelete, handleSubmit } = useAccountFormHandlers({
    form,
    editingUser,
    setEditingUser,
    setModalVisible,
    createUser,
    updateUser,
    deleteUser,
    refreshTable,
  });

  return {
    // 状态
    modalVisible,
    editingUser,
    form,

    // 事件处理器
    handleEdit,
    handleAdd,
    handleCancel,
    handleSubmit,
    handleDelete,
  };
};
