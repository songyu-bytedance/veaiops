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

import { Button } from '@arco-design/web-react';
import type { SyncAlarmRulesResponse } from 'api-generate';
import { type React, useState } from 'react';
import { AlarmResultModal } from './alarm-result-modal';

/**
 * 告警结果弹窗演示组件
 * 用于展示新的视觉设计效果
 */
export const AlarmResultDemo: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // 模拟数据
  const mockData: SyncAlarmRulesResponse = {
    total: 4,
    created: 1,
    updated: 1,
    deleted: 0,
    failed: 2,
    rule_operations: [
      {
        action: 'create',
        rule_id: 'rule_001',
        rule_name: 'CPU使用率告警规则',
        status: 'success',
      },
      {
        action: 'update',
        rule_id: 'rule_002',
        rule_name: '内存使用率告警规则',
        status: 'success',
      },
      {
        action: 'update',
        rule_id: null,
        rule_name: 'Volcengine实例磁盘使用率_small_DiskUsageUtilization',
        status: 'failed',
        error:
          "(400)\nReason: Bad Request\nHTTP response headers:\nServer: 'Tengine'\nContent-Type: 'application/json; charset=utf-8'\nDate: 'Sat, 25 Oct 2025 05:23:59 GMT'\nX-Tt-Logid: '20251025052359A1234567890'\nServer-Timing: 'intid;desc=\"1234567890\"'\nX-Tt-Trace-Host: 'trace-host-001'",
      },
      {
        action: 'create',
        rule_id: null,
        rule_name: '网络流量告警规则',
        status: 'failed',
        error: 'Network timeout after 30 seconds',
      },
    ],
  };

  return (
    <div className="p-5">
      <h2>告警规则创建详情弹窗演示</h2>
      <p>点击按钮查看新的视觉设计效果：</p>

      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '500',
        }}
      >
        🚨 查看告警创建结果
      </Button>

      <AlarmResultModal
        visible={visible}
        data={mockData}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default AlarmResultDemo;
