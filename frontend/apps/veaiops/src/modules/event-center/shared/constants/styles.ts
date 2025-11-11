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
 * 事件中心样式常量
 * 用于统一管理组件中的样式配置
 *
 * ✅ 合并来自 history/lib/constants.ts 和其他模块的样式常量
 * - 单一数据源：所有样式常量在此定义
 */
export const STYLES = {
  /** 卡片阴影 */
  CARD_SHADOW: '0 2px 8px rgba(0, 0, 0, 0.06)',
  /** 卡片边框 */
  CARD_BORDER: '1px solid #E5E6EB',
  /** 卡片圆角 */
  CARD_BORDER_RADIUS: '12px',
  /** 章节圆角 */
  SECTION_BORDER_RADIUS: '8px',
  /** 信息卡片圆角 */
  INFO_BORDER_RADIUS: '6px',
  /** 浅色背景 */
  BACKGROUND_LIGHT: '#F7F8FA',
  /** 页面背景 */
  BACKGROUND_PAGE: '#FAFBFC',
  /** 主要文本颜色 */
  TEXT_PRIMARY: '#1D2129',
  /** 次要文本颜色 */
  TEXT_SECONDARY: '#86909C',
  /** 禁用文本颜色 */
  TEXT_DISABLED: '#C9CDD4',
  /** 边框颜色 */
  BORDER_COLOR: 'var(--color-border)',
  /** 背景颜色 */
  BG_COLOR: 'var(--color-bg-2)',
} as const;
