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

import { Button } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import React from "react";

/**
 * Bot管理页面配置
 */
export const BOT_MANAGEMENT_CONFIG = {
  // 页面标题
  title: "群聊机器人管理",

  // 表格配置
  table: {
    scroll: { x: 1200 },
    pagination: {
      pageSize: 10,
      showTotal: (total: number) => `共 ${total} 条记录`,
      sizeCanChange: true,
      sizeOptions: [10, 20, 50] as number[],
    },
  },

  // 操作按钮配置
  actions: {
    add: {
      text: "新增Bot",
      type: "primary" as const,
      icon: IconPlus,
    },
  },

  // 表单配置
  form: {
    layout: "vertical" as const,
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  },

  // 消息配置
  messages: {
    create: {
      success: "机器人创建成功",
      error: "创建失败，请重试",
    },
    update: {
      success: "机器人更新成功",
      error: "更新失败，请重试",
    },
    delete: {
      success: "机器人删除成功",
      error: "删除失败，请重试",
    },
    load: {
      error: "加载机器人列表失败，请重试",
    },
    validation: {
      botIdRequired: "App ID 不能为空",
    },
  },
} as const;

/**
 * 消息常量导出（方便其他文件导入使用）
 */
export const BOT_MESSAGES = BOT_MANAGEMENT_CONFIG.messages;

/**
 * 创建操作按钮配置
 */
export const createActionButtons = (onAdd: () => void): React.ReactNode[] => [
  <Button
    key="add"
    type={BOT_MANAGEMENT_CONFIG.actions.add.type}
    icon={<BOT_MANAGEMENT_CONFIG.actions.add.icon />}
    onClick={onAdd}
  >
    {BOT_MANAGEMENT_CONFIG.actions.add.text}
  </Button>,
];

/**
 * 获取表格属性配置
 */
export const getTableProps = () => ({
  ...BOT_MANAGEMENT_CONFIG.table,
});

/**
 * 火山引擎 TOS 区域选项
 */
export const TOS_REGION_OPTIONS = [
  { label: '华北（北京）', value: 'cn-beijing' as const },
  { label: '华东（上海）', value: 'cn-shanghai' as const },
  { label: '华南（广州）', value: 'cn-guangzhou' as const },
  { label: '亚太东南（新加坡）', value: 'ap-singapore-1' as const },
  { label: '亚太东南（柔佛）', value: 'ap-southeast-1' as const },
  { label: '亚太东南（雅加达）', value: 'ap-southeast-3' as const },
] as const;

/**
 * 网络类型选项
 */
export const NETWORK_TYPE_OPTIONS = [
  { label: '内网（服务部署于火山引擎）', value: 'internal' },
  { label: '公网（服务未部署于火山引擎）', value: 'public' },
] as const;
