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

import { ModuleType } from '@/types/module';
import { SubscriptionManagement } from '@ec/subscription';
import type React from 'react';

/**
 * Event center subscription page
 *
 * @description Display event subscription management (agent subscription rules)
 *
 * Features:
 * - Filters: name, agent (Interest Agent + Threshold Agent), event level, webhook enabled, projects
 * - Columns: name, agent, start time, end time, event level, webhook status, webhook URL, actions
 * - Default filter: agent = Interest Agent
 */
const EventCenterSubscribeRelation: React.FC = () => {
  return <SubscriptionManagement moduleType={ModuleType.EVENT_CENTER} />;
};

export default EventCenterSubscribeRelation;
