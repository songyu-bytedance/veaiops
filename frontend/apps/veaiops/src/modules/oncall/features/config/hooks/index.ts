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

export {
  useRulesTable,
  type UseRulesTableProps,
} from './use-rules-table';
export {
  useRulesData,
  type UseRulesDataProps,
} from './use-rules-data';
export { useRuleDrawer } from './use-rule-drawer';
// ✅ 修复：从 ui/components/detail-view/hooks/ 移动到 hooks/
export { useCopy, type UseCopyParams, type UseCopyReturn } from './use-copy';
export type {
  UseRuleDrawerOptions,
  UseRuleDrawerReturn,
} from './use-rule-drawer';
