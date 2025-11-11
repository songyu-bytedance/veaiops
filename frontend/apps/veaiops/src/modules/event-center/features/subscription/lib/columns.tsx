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

import { Button, Popconfirm, Space } from '@arco-design/web-react';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
// ✅ 修复：从 @ec/shared 导入事件级别常量（单一数据源）
import { EVENT_LEVEL_MAP } from '@ec/shared';
import type { BaseQuery, HandleFilterProps } from '@veaiops/components';
import { CellRender } from '@veaiops/components';
import { AGENT_TYPE_MAP } from '@veaiops/constants';
import type { SubscribeRelationWithAttributes } from 'api-generate';

// 解构CellRender组件，避免重复调用
const { CustomOutlineTag, StampTime } = CellRender;

/**
 * 列配置属性接口
 * 继承 HandleFilterProps，并扩展操作回调函数
 */
interface SubscriptionColumnsProps extends HandleFilterProps<BaseQuery> {
  onEdit?: (record: SubscribeRelationWithAttributes) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onView?: (record: SubscribeRelationWithAttributes) => void;
}

/**
 * 订阅关系列配置函数
 * 按照 CustomTable 最佳实践，提供完整的列配置
 * 🎯 与 origin/feat/web-v2 保持一致
 *
 * @param props - 列配置属性，包含 query、handleChange 以及操作回调函数（onEdit, onDelete, onView）
 */
export const getSubscriptionColumns = (props: SubscriptionColumnsProps) => {
  const { onEdit, onDelete, onView } = props;

  return [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      ellipsis: true,
    },
    {
      title: '智能体',
      dataIndex: 'agent_type',
      key: 'agent_type',
      width: 140,
      render: (agentType: string) => {
        return (
          <CustomOutlineTag>
            {(AGENT_TYPE_MAP as Record<string, { label: string }>)[agentType]
              ?.label || agentType}
          </CustomOutlineTag>
        );
      },
    },
    {
      title: '生效开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 160,
      render: (value: string) => (
        <StampTime time={value} template="YYYY-MM-DD HH:mm" />
      ),
    },
    {
      title: '生效结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 160,
      render: (value: string) => (
        <StampTime time={value} template="YYYY-MM-DD HH:mm" />
      ),
    },
    {
      title: '事件级别',
      dataIndex: 'event_level',
      key: 'event_level',
      width: 160,
      render: (levels: string[]) => {
        if (!levels || levels.length === 0) {
          return <CustomOutlineTag>全部</CustomOutlineTag>;
        }

        return (
          <Space wrap>
            {levels?.map((level) => (
              <CustomOutlineTag key={level}>
                {(EVENT_LEVEL_MAP as Record<string, { label: string }>)[level]
                  ?.label ||
                  level ||
                  '-'}
              </CustomOutlineTag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '是否开启WEBHOOK',
      dataIndex: 'enable_webhook',
      key: 'enable_webhook',
      width: 140,
      render: (enabled: boolean) => (
        <CustomOutlineTag>{enabled ? '已开启' : '未开启'}</CustomOutlineTag>
      ),
    },
    {
      title: 'WEBHOOK地址',
      dataIndex: 'webhook_endpoint',
      key: 'webhook_endpoint',
      width: 300,
      ellipsis: true,
      render: (url: string) => url || '-',
    },
    {
      title: '关注项目',
      dataIndex: 'interest_projects',
      key: 'interest_projects',
      width: 250,
      render: (projectIds: string[]) => {
        if (!projectIds || projectIds.length === 0) {
          return <CustomOutlineTag>全部</CustomOutlineTag>;
        }
        const data = projectIds.map((id) => ({ name: id, value: id }));
        return (
          <CellRender.TagEllipsis
            dataList={data}
            maxCount={3}
            showMode="text"
            editable={false}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: SubscribeRelationWithAttributes) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => onEdit?.(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个订阅吗？"
            onOk={async () => {
              if (record._id) {
                await onDelete?.(record._id);
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
