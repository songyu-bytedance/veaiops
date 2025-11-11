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

import { useSearchParams } from '@modern-js/runtime/router';
import { logger } from '@veaiops/utils';
import type { DataSource } from '@veaiops/api-client';
import { useCallback, useEffect } from 'react';

interface UseUrlParamHandlersProps {
  connectionDrawerVisible: boolean;
  wizardVisible: boolean;
  handleOpenConnectionManager: () => void;
  handleCloseConnectionManager: () => void;
  handleAdd: () => void;
  handleEditDataSource: (dataSource: DataSource) => void;
  setWizardVisible: (visible: boolean) => void;
}

/**
 * URL 参数管理 Hook
 * 职责：管理 URL 参数与抽屉/向导状态的同步
 */
export const useUrlParamHandlers = ({
  connectionDrawerVisible,
  wizardVisible,
  handleOpenConnectionManager,
  handleCloseConnectionManager,
  handleAdd,
  handleEditDataSource,
  setWizardVisible,
}: UseUrlParamHandlersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 监听 URL 参数 connectDrawerShow，自动打开连接管理抽屉
  useEffect(() => {
    const connectDrawerShow = searchParams.get('connectDrawerShow');
    logger.info({
      message: `[MonitorAccess] 监听 connectDrawerShow 参数`,
      data: {
        connectDrawerShow,
        connectionDrawerVisible,
        currentUrl: window.location.href,
        searchParams: searchParams.toString(),
      },
      source: 'MonitorAccess',
      component: 'useEffect-connectDrawerShow',
    });

    if (connectDrawerShow === 'true' && !connectionDrawerVisible) {
      logger.info({
        message: `[MonitorAccess] 触发打开连接管理抽屉`,
        data: {
          connectDrawerShow,
          connectionDrawerVisible,
          willOpenDrawer: true,
        },
        source: 'MonitorAccess',
        component: 'useEffect-connectDrawerShow',
      });

      handleOpenConnectionManager();

      logger.info({
        message: `[MonitorAccess] 保持 connectDrawerShow 参数，等待抽屉关闭时清除`,
        data: {
          currentParams: searchParams.toString(),
          reason: '参数将在抽屉关闭时清除',
        },
        source: 'MonitorAccess',
        component: 'useEffect-connectDrawerShow',
      });
    }
  }, [
    searchParams,
    connectionDrawerVisible,
    handleOpenConnectionManager,
    handleCloseConnectionManager,
  ]);

  // 监听 URL 参数 dataSourceWizardShow，自动打开数据源向导
  useEffect(() => {
    const dataSourceWizardShow = searchParams.get('dataSourceWizardShow');
    logger.info({
      message: `[MonitorAccess] 监听 dataSourceWizardShow 参数`,
      data: {
        dataSourceWizardShow,
        wizardVisible,
        currentUrl: window.location.href,
        searchParams: searchParams.toString(),
      },
      source: 'MonitorAccess',
      component: 'useEffect-dataSourceWizardShow',
    });

    if (dataSourceWizardShow === 'true' && !wizardVisible) {
      logger.info({
        message: `[MonitorAccess] 触发打开数据源向导`,
        data: {
          dataSourceWizardShow,
          wizardVisible,
          willOpenWizard: true,
        },
        source: 'MonitorAccess',
        component: 'useEffect-dataSourceWizardShow',
      });

      setWizardVisible(true);

      logger.info({
        message: `[MonitorAccess] 保持 dataSourceWizardShow 参数，等待向导关闭时清除`,
        data: {
          currentParams: searchParams.toString(),
          reason: '参数将在向导关闭时清除',
        },
        source: 'MonitorAccess',
        component: 'useEffect-dataSourceWizardShow',
      });
    }
  }, [searchParams, wizardVisible, setWizardVisible]);

  // 包装打开连接管理抽屉的函数，同时清除数据源向导的 URL 参数（互斥）
  const wrappedHandleOpenConnectionManager = useCallback(() => {
    logger.info({
      message: '🔗 wrappedHandleOpenConnectionManager called',
      data: {
        currentUrl: window.location.href,
        searchParams: searchParams.toString(),
      },
      source: 'ManagementPage',
      component: 'wrappedHandleOpenConnectionManager',
    });

    const newParams = new URLSearchParams(searchParams);
    if (newParams.has('dataSourceWizardShow')) {
      logger.info({
        message: '⚠️ 【互斥】清除 dataSourceWizardShow URL 参数',
        data: {
          originalParams: searchParams.toString(),
        },
        source: 'ManagementPage',
        component: 'wrappedHandleOpenConnectionManager-mutex',
      });
      newParams.delete('dataSourceWizardShow');
      setSearchParams(newParams);
    }

    handleOpenConnectionManager();
  }, [handleOpenConnectionManager, searchParams, setSearchParams]);

  // 包装关闭连接管理抽屉的函数，同时清除 URL 参数
  const wrappedHandleCloseConnectionManager = useCallback(() => {
    logger.info({
      message: '🔗 wrappedHandleCloseConnectionManager called',
      data: {},
      source: 'ManagementPage',
      component: 'wrappedHandleCloseConnectionManager',
    });
    logger.info({
      message: `[MonitorAccess] 关闭连接管理抽屉`,
      data: {
        currentUrl: window.location.href,
        searchParams: searchParams.toString(),
        willCloseDrawer: true,
      },
      source: 'MonitorAccess',
      component: 'wrappedHandleCloseConnectionManager',
    });

    handleCloseConnectionManager();

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('connectDrawerShow');

    logger.info({
      message: `[MonitorAccess] 清除 connectDrawerShow 参数（关闭抽屉）`,
      data: {
        originalParams: searchParams.toString(),
        newParams: newParams.toString(),
        willUpdateUrl: true,
      },
      source: 'MonitorAccess',
      component: 'wrappedHandleCloseConnectionManager',
    });

    setSearchParams(newParams);
  }, [handleCloseConnectionManager, searchParams, setSearchParams]);

  // 包装打开数据源向导的函数，同时清除连接管理的 URL 参数（互斥）
  const wrappedHandleAdd = useCallback(() => {
    logger.info({
      message: '➕ wrappedHandleAdd called',
      data: {
        currentUrl: window.location.href,
        searchParams: searchParams.toString(),
      },
      source: 'ManagementPage',
      component: 'wrappedHandleAdd',
    });

    const newParams = new URLSearchParams(searchParams);
    if (newParams.has('connectDrawerShow')) {
      logger.info({
        message: '⚠️ 【互斥】清除 connectDrawerShow URL 参数',
        data: {
          originalParams: searchParams.toString(),
        },
        source: 'ManagementPage',
        component: 'wrappedHandleAdd-mutex',
      });
      newParams.delete('connectDrawerShow');
      setSearchParams(newParams);
    }

    handleAdd();
  }, [handleAdd, searchParams, setSearchParams]);

  // 包装编辑数据源的函数，同时清除连接管理的 URL 参数（互斥）
  const wrappedHandleEditDataSource = useCallback(
    (dataSource: DataSource) => {
      logger.info({
        message: '✏️ wrappedHandleEditDataSource called',
        data: {
          currentUrl: window.location.href,
          searchParams: searchParams.toString(),
        },
        source: 'ManagementPage',
        component: 'wrappedHandleEditDataSource',
      });

      const newParams = new URLSearchParams(searchParams);
      if (newParams.has('connectDrawerShow')) {
        logger.info({
          message: '⚠️ 【互斥】清除 connectDrawerShow URL 参数',
          data: {
            originalParams: searchParams.toString(),
          },
          source: 'ManagementPage',
          component: 'wrappedHandleEditDataSource-mutex',
        });
        newParams.delete('connectDrawerShow');
        setSearchParams(newParams);
      }

      handleEditDataSource(dataSource);
    },
    [handleEditDataSource, searchParams, setSearchParams],
  );

  // 包装关闭数据源向导的函数，同时清除 URL 参数
  const wrappedSetWizardVisible = useCallback(
    (visible: boolean) => {
      logger.info({
        message: '📝 wrappedSetWizardVisible called',
        data: { visible },
        source: 'ManagementPage',
        component: 'wrappedSetWizardVisible',
      });
      logger.info({
        message: `[MonitorAccess] 设置数据源向导可见性`,
        data: {
          visible,
          currentUrl: window.location.href,
          searchParams: searchParams.toString(),
          willCloseWizard: !visible,
        },
        source: 'MonitorAccess',
        component: 'wrappedSetWizardVisible',
      });

      setWizardVisible(visible);

      if (!visible) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('dataSourceWizardShow');

        logger.info({
          message: `[MonitorAccess] 清除 dataSourceWizardShow 参数（关闭向导）`,
          data: {
            originalParams: searchParams.toString(),
            newParams: newParams.toString(),
            willUpdateUrl: true,
          },
          source: 'MonitorAccess',
          component: 'wrappedSetWizardVisible',
        });

        setSearchParams(newParams);
      }
    },
    [setWizardVisible, searchParams, setSearchParams],
  );

  return {
    wrappedHandleOpenConnectionManager,
    wrappedHandleCloseConnectionManager,
    wrappedHandleAdd,
    wrappedHandleEditDataSource,
    wrappedSetWizardVisible,
  };
};
