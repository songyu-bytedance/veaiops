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

/**
 * 连接管理器主组件
 */

import { useConnections } from '@/hooks/use-connections';
import { Badge, Drawer, Space, Tabs, Typography } from '@arco-design/web-react';
import { logger } from '@veaiops/utils';
import { DataSourceType } from '@veaiops/api-client';
import type React from 'react';
import { useEffect, useState } from 'react';
import { DATA_SOURCE_DISPLAY_NAMES } from '../../lib';
import { ConnectionPanel } from './connection-panel';

const { Title } = Typography;

export interface ConnectionManagerProps {
  visible: boolean;
  onClose: () => void;
  defaultActiveTab?: DataSourceType;
}

/**
 * 连接管理器组件
 */
export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  visible,
  onClose,
  defaultActiveTab = DataSourceType.VOLCENGINE,
}) => {
  logger.info({
    message: '🎨 ConnectionManager component rendering',
    data: { visible, defaultActiveTab },
    source: 'ConnectionManager',
    component: 'render',
  });

  const [activeTab, setActiveTab] = useState<DataSourceType>(defaultActiveTab);

  // 🔥 当弹窗打开时，同步 activeTab 状态
  useEffect(() => {
    if (visible && defaultActiveTab) {
      logger.info({
        message: '🔄 Syncing activeTab with defaultActiveTab when drawer opens',
        data: {
          defaultActiveTab,
        },
        source: 'ConnectionManager',
        component: 'visible-sync-effect',
      });
      setActiveTab(defaultActiveTab);
    }
  }, [visible, defaultActiveTab]);

  // 🔥 监控组件挂载和卸载
  useEffect(() => {
    logger.info({
      message: '✨ ConnectionManager mounted',
      data: {},
      source: 'ConnectionManager',
      component: 'mount',
    });
    return () => {
      logger.info({
        message: '💥 ConnectionManager unmounting',
        data: {},
        source: 'ConnectionManager',
        component: 'unmount',
      });
    };
  }, []);

  // 🔥 监控 visible 属性变化
  useEffect(() => {
    logger.info({
      message: '📊 visible prop changed',
      data: {
        visible,
        timestamp: new Date().toISOString(),
      },
      source: 'ConnectionManager',
      component: 'visible-effect',
    });

    if (visible) {
      logger.info({
        message: '🔓 Drawer is opening',
        data: {},
        source: 'ConnectionManager',
        component: 'visible-effect',
      });
    } else {
      logger.info({
        message: '🔒 Drawer is closing',
        data: {},
        source: 'ConnectionManager',
        component: 'visible-effect',
      });
    }
  }, [visible]);

  // 🔥 监控 activeTab 变化
  useEffect(() => {
    logger.info({
      message: '📑 activeTab changed',
      data: { activeTab },
      source: 'ConnectionManager',
      component: 'activeTab-effect',
    });
  }, [activeTab]);

  // 只获取当前激活标签页的连接信息，避免重复调用
  const { connections: activeConnections } = useConnections(activeTab);

  // 为了显示标签页的连接数量，我们需要一个轻量级的统计方法
  // 这里暂时使用空数组，后续可以考虑添加专门的统计API
  const getConnectionCount = (type: DataSourceType) => {
    return type === activeTab ? activeConnections.length : 0;
  };

  const tabItems = [
    {
      key: DataSourceType.VOLCENGINE,
      title: (
        <Space>
          {DATA_SOURCE_DISPLAY_NAMES[DataSourceType.VOLCENGINE]}
          <Badge count={getConnectionCount(DataSourceType.VOLCENGINE)} />
        </Space>
      ),
    },
    {
      key: DataSourceType.ALIYUN,
      title: (
        <Space>
          {DATA_SOURCE_DISPLAY_NAMES[DataSourceType.ALIYUN]}
          <Badge count={getConnectionCount(DataSourceType.ALIYUN)} />
        </Space>
      ),
    },
    {
      key: DataSourceType.ZABBIX,
      title: (
        <Space>
          {DATA_SOURCE_DISPLAY_NAMES[DataSourceType.ZABBIX]}
          <Badge count={getConnectionCount(DataSourceType.ZABBIX)} />
        </Space>
      ),
    },
  ];

  // 🔥 包装 onClose 以添加日志
  const handleClose = () => {
    logger.info({
      message: '🚪 Drawer onCancel triggered - closing drawer',
      data: {},
      source: 'ConnectionManager',
      component: 'handleClose',
    });
    onClose();
  };

  return (
    <Drawer
      title={
        <Title heading={4} style={{ margin: 0 }}>
          连接管理
        </Title>
      }
      visible={visible}
      onCancel={handleClose}
      width={1400}
      footer={null}
      maskClosable
      unmountOnExit
    >
      <Tabs
        activeTab={activeTab}
        onChange={(key: string) => setActiveTab(key as DataSourceType)}
        size="large"
        type="card-gutter"
      >
        {tabItems.map((item) => (
          <Tabs.TabPane key={item.key} title={item.title}>
            <ConnectionPanel type={item.key} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Drawer>
  );
};

export default ConnectionManager;
