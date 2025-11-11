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

import { Button, Popconfirm, Tooltip } from '@arco-design/web-react';
import { IconDelete } from '@arco-design/web-react/icon';
import type { GetProjectTableColumnsParams } from '@project/types';
import { CellRender, type ModernTableColumnProps } from '@veaiops/components';
import type { Project } from 'api-generate';

/**
 * Get project table column configuration
 */
export const getProjectTableColumns = ({
  onEdit: _onEdit,
  onDelete,
  onToggleStatus: _onToggleStatus,
}: GetProjectTableColumnsParams): ModernTableColumnProps<Project>[] => [
  {
    title: '项目ID',
    dataIndex: 'project_id',
    key: 'project_id',
    width: 150,
    render: (projectId: string) => (
      <CellRender.CopyableText text={projectId || ''} />
    ),
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    width: 180,
    ellipsis: true,
    render: (name: string) => <CellRender.Ellipsis text={name || ''} />,
  },
  {
    title: '负责人',
    dataIndex: 'owner',
    key: 'owner',
    width: 120,
    render: (owner: string) => <CellRender.Ellipsis text={owner || '-'} />,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => (
      <CellRender.OutlineTag
        text={status || 'active'}
        color={
          status === 'completed' ? 'green' :
          status === 'active' ? 'blue' :
          status === 'suspended' ? 'orange' :
          status === 'cancelled' ? 'red' :
          'gray'
        }
      />
    ),
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    render: (priority: string) => (
      <CellRender.OutlineTag
        text={priority || 'medium'}
        color={
          priority === 'urgent' ? 'red' :
          priority === 'high' ? 'orange' :
          priority === 'medium' ? 'blue' :
          'green'
        }
      />
    ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right' as const,
    render: (_: unknown, record: Project) => {
      if (!onDelete) {
        return null;
      }

      return (
        <Popconfirm
          title="确认删除"
          content={`确定要删除项目"${record.name}"吗？此操作不可恢复。`}
          onOk={() => onDelete(record.project_id || '')}
          okText="删除"
          cancelText="取消"
          okButtonProps={{ status: 'danger' }}
        >
          <Tooltip content="删除项目">
            <Button type="text" size="small" icon={<IconDelete />} status="danger" />
          </Tooltip>
        </Popconfirm>
      );
    },
  },
];
