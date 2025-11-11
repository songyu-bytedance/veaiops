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

import type { SelectOption } from '../../../types/interface';
import type { DataFetcherPlugin, PluginContext } from '../../../types/plugin';

/**
 * 粘贴数据获取器
 */
export class PasteDataFetcher {
  constructor(private context: PluginContext) {}

  /**
   * 粘贴后触发数据获取，确保新粘贴的值能被搜索到
   */
  async triggerDataFetchForPastedValues(
    pastedValues: (string | number)[],
  ): Promise<void> {
    // 🔧 防御性检查：确保context存在
    if (!this.context) {
      return;
    }

    const { props } = this.context;

    // 检查是否有数据源配置
    if (!props.dataSource || typeof props.dataSource !== 'object') {
      return;
    }

    try {
      // 获取数据获取器插件
      const dataFetcher = this.context.getPlugin?.(
        'data-fetcher',
      ) as DataFetcherPlugin;
      if (!dataFetcher || typeof dataFetcher.fetchData !== 'function') {
        return;
      }

      // 构造搜索参数：将粘贴的值作为搜索条件
      const searchParams: Record<string, any> = {
        // 优先使用pasteValueKey，其次使用searchKey或remoteSearchKey
        ...(props.pasteValueKey && { [props.pasteValueKey]: pastedValues }),

        // 如果没有pasteValueKey，则使用传统的搜索字段
        ...(!props.pasteValueKey &&
          props.searchKey && { [props.searchKey]: pastedValues.join(',') }),
        ...(!props.pasteValueKey &&
          props.remoteSearchKey && {
            [props.remoteSearchKey]: pastedValues.join(','),
          }),

        // 构造正确的分页参数
        pageReq: {
          skip: 0,
          limit: Math.max(50, pastedValues.length * 2),
        },
      };

      const fetchedOptions = await dataFetcher.fetchData(
        props.dataSource,
        searchParams,
      );

      // 更新状态中的选项
      if (fetchedOptions && fetchedOptions.length > 0) {
        // 获取当前状态中的选项
        const currentOptions = this.context.state?.fetchOptions || [];

        // 合并新获取的选项，去重
        const mergedOptions = this.mergeAndDeduplicateOptions(
          currentOptions,
          fetchedOptions,
        );

        // 🔧 批量更新状态，包含stateVersion强制重新渲染
        const currentState = this.context.state;
        this.context.setState({
          fetchOptions: mergedOptions,
          // 🔧 强制重新渲染：更新stateVersion确保React立即响应状态变化
          stateVersion: (currentState?.stateVersion || 0) + 1,
        });
      }
    } catch (error) {
      // 不显示错误消息，因为这是后台操作
    }
  }

  /**
   * 合并并去重选项
   */
  private mergeAndDeduplicateOptions(
    currentOptions: SelectOption[],
    newOptions: SelectOption[],
  ): SelectOption[] {
    const optionMap = new Map<string | number, SelectOption>();

    // 先添加当前选项
    currentOptions.forEach((option) => {
      optionMap.set(option.value, option);
    });

    // 再添加新选项（会覆盖重复的）
    newOptions.forEach((option) => {
      optionMap.set(option.value, option);
    });

    return Array.from(optionMap.values());
  }
}
