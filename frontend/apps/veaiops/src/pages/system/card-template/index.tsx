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

import { CardTemplateManagement } from '@/modules/system/features/card-template';

/**
 * 卡片模版管理页面 - 路由入口
 * @description 提供消息卡片模版的创建、管理和配置功能
 *
 * ✅ 使用 CardTemplateManagement（正确使用 {...customTableProps}，支持自动刷新）
 */
export default function CardTemplatePage() {
  return <CardTemplateManagement />;
}
