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
import type { FormInstance } from '@arco-design/web-react/es/Form';
import type { User } from '@veaiops/api-client';
import { logger } from '@veaiops/utils';
import { useCallback } from 'react';
import type { UpdateUserParams, UserFormData } from '@account/lib';

/**
 * 账号表单处理器Hook参数接口
 */
export interface UseAccountFormHandlersParams {
  form: FormInstance;
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  setModalVisible: (visible: boolean) => void;
  createUser: (data: UserFormData) => Promise<boolean>;
  updateUser: (params: UpdateUserParams) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refreshTable?: () => Promise<boolean>;
}

/**
 * 表单处理器 Hook
 *
 * 注意：此 Hook 依赖于 CRUD 操作和 Modal 状态
 * 建议在 management.ts 中统一组装，而不是独立使用
 */
export const useAccountFormHandlers = ({
  form,
  editingUser,
  setEditingUser,
  setModalVisible,
  createUser,
  updateUser,
  deleteUser,
  refreshTable,
}: UseAccountFormHandlersParams) => {
  // 删除用户
  const handleDelete = useCallback(
    async (userId: string) => {
      try {
        const success = await deleteUser(userId);
        if (success && refreshTable) {
          const refreshResult = await refreshTable();
          if (!refreshResult) {
            logger.warn({
              message: '删除后刷新表格失败',
              data: {},
              source: 'AccountManagement',
              component: 'handleDelete',
            });
          }
          return true;
        }
        return false;
      } catch (error: unknown) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        const errorMessage = errorObj.message || '删除失败，请重试';
        Message.error(errorMessage);
        return false;
      }
    },
    [deleteUser, refreshTable],
  );

  // 创建用户
  const handleCreate = useCallback(
    async (values: UserFormData) => {
      try {
        const success = await createUser(values);
        if (success) {
          setModalVisible(false);
          form.resetFields();
          if (refreshTable) {
            await refreshTable();
          }
          return true;
        }
        return false;
      } catch (error: unknown) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        const errorMessage = errorObj.message || '创建失败，请重试';
        Message.error(errorMessage);
        return false;
      }
    },
    [createUser, form, setModalVisible, refreshTable],
  );

  // 更新用户
  const handleUpdate = useCallback(
    async (values: UserFormData) => {
      if (!editingUser || !editingUser._id) {
        Message.error('用户 ID 不能为空');
        return false;
      }

      try {
        const success = await updateUser({
          userId: editingUser._id,
          updateData: values,
        });
        if (success) {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
          if (refreshTable) {
            await refreshTable();
          }
          return true;
        }
        return false;
      } catch (error: unknown) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        const errorMessage = errorObj.message || '更新失败，请重试';
        Message.error(errorMessage);
        return false;
      }
    },
    [
      editingUser,
      updateUser,
      form,
      setModalVisible,
      setEditingUser,
      refreshTable,
    ],
  );

  // 处理表单提交
  const handleSubmit = useCallback(
    async (values: UserFormData) => {
      if (editingUser) {
        return await handleUpdate(values);
      } else {
        return await handleCreate(values);
      }
    },
    [editingUser, handleUpdate, handleCreate],
  );

  return {
    handleDelete,
    handleSubmit,
  };
};
