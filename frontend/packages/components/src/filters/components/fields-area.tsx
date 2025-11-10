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

import { logger } from '@veaiops/utils';
import type React from 'react';
import { type FC, Fragment } from 'react';
import { commonClassName } from '../core/constants';
import type { FieldItem } from '../core/types';

interface FieldsAreaProps {
  /** Field configuration list */
  config: FieldItem[];
  /** Field renderer */
  renderFieldItem: (field: FieldItem) => React.ReactNode;
  /** Actions area component */
  actionsArea?: React.ReactNode;
}

/**
 * Fields area component
 * Responsible for rendering all filter fields
 */
const FieldsArea: FC<FieldsAreaProps> = ({
  config,
  renderFieldItem,
  actionsArea,
}) => {
  // 🔧 Add detailed logging: track FieldsArea rendering
  // ⚠️ 修复循环引用问题：避免使用 JSON.stringify(config)，因为 config 中可能包含循环引用的对象（如 apiClient）
  logger.debug({
    message: '[FieldsArea] FieldsArea rendering',
    data: {
      configLength: config.length,
      configTypes: config.map((item) => item.type),
      configFields: config.map((item) => item.field),
      hasActionsArea: Boolean(actionsArea),
    },
    source: 'Filters',
    component: 'FieldsArea',
  });

  return (
    <div className={`${commonClassName} w-full`}>
      {/* Render field list */}
      {config.map((item, index) => {
        // Check field visibility
        if (item.visible === false) {
          return null;
        }

        const fieldKey = item.field || `field-${index}`;
        const fieldWithKey = {
          ...item,
          field: fieldKey,
        };

        // 🔧 Add detailed logging: track each field rendering
        const isSelectType = item.type === 'select' || item.type === 'Select';
        if (isSelectType) {
          const hasOptions =
            item.componentProps && 'options' in item.componentProps;
          const options = hasOptions
            ? (item.componentProps as any).options
            : undefined;

          logger.debug({
            message: '[FieldsArea] Rendering Select field',
            data: {
              index,
              fieldKey,
              type: item.type,
              hasOptions,
              optionsLength: Array.isArray(options) ? options.length : 0,
              // ⚠️ 避免记录 optionsReference，因为可能包含循环引用的对象
            },
            source: 'Filters',
            component: 'FieldsArea',
          });
        }

        return (
          <Fragment key={fieldKey}>{renderFieldItem(fieldWithKey)}</Fragment>
        );
      })}

      {/* Actions area */}
      {actionsArea}
    </div>
  );
};

export { FieldsArea };
export default FieldsArea;
