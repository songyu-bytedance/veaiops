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
 * 路由性能分析器
 * 用于监控和分析路由加载性能，提供优化建议
 */

interface RoutePerformanceMetrics {
  /** 路由路径 */
  path: string;
  /** 组件名称 */
  componentName: string;
  /** 加载开始时间 */
  loadStartTime: number;
  /** 加载结束时间 */
  loadEndTime: number;
  /** 总加载时间 */
  loadDuration: number;
  /** 组件大小（字节） */
  bundleSize?: number;
  /** 是否使用了预加载 */
  preloaded: boolean;
  /** 错误信息 */
  error?: string;
}

interface PerformanceThresholds {
  /** 加载时间警告阈值（毫秒） */
  loadTimeWarning: number;
  /** 加载时间错误阈值（毫秒） */
  loadTimeError: number;
  /** 包大小警告阈值（字节） */
  bundleSizeWarning: number;
  /** 包大小错误阈值（字节） */
  bundleSizeError: number;
}

class RoutePerformanceAnalyzer {
  private metrics: Map<string, RoutePerformanceMetrics[]> = new Map();
  private thresholds: PerformanceThresholds = {
    loadTimeWarning: 1000, // 1秒
    loadTimeError: 3000, // 3秒
    bundleSizeWarning: 500 * 1024, // 500KB
    bundleSizeError: 1024 * 1024, // 1MB
  };

  /**
   * 开始监控路由加载
   */
  startRouteLoad({
    path,
    componentName,
  }: {
    path: string;
    componentName: string;
  }): string {
    const loadId = `${path}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const startTime = performance.now();

    // 存储开始时间
    if (!this.metrics.has(path)) {
      this.metrics.set(path, []);
    }

    const metric: RoutePerformanceMetrics = {
      path,
      componentName,
      loadStartTime: startTime,
      loadEndTime: 0,
      loadDuration: 0,
      preloaded: false,
    };

    this.metrics.get(path)!.push(metric);

    return loadId;
  }

  /**
   * 结束路由加载监控
   */
  endRouteLoad({
    path,
    options,
  }: {
    path: string;
    options?: {
      error?: string;
      bundleSize?: number;
      preloaded?: boolean;
    };
  }): void {
    const pathMetrics = this.metrics.get(path);
    if (!pathMetrics || pathMetrics.length === 0) {
      return;
    }

    const latestMetric = pathMetrics[pathMetrics.length - 1];
    const endTime = performance.now();

    latestMetric.loadEndTime = endTime;
    latestMetric.loadDuration = endTime - latestMetric.loadStartTime;
    latestMetric.bundleSize = options?.bundleSize;
    latestMetric.preloaded = options?.preloaded || false;
    latestMetric.error = options?.error;

    // 分析性能并输出建议
    this.analyzePerformance(latestMetric);
  }

  /**
   * 分析单个路由性能
   */
  private analyzePerformance(metric: RoutePerformanceMetrics): void {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 检查加载时间
    if (metric.loadDuration > this.thresholds.loadTimeError) {
      issues.push(`加载时间过长: ${metric.loadDuration.toFixed(2)}ms`);
      suggestions.push('考虑进一步拆分组件或使用预加载');
    } else if (metric.loadDuration > this.thresholds.loadTimeWarning) {
      issues.push(`加载时间较长: ${metric.loadDuration.toFixed(2)}ms`);
      suggestions.push('考虑使用预加载或优化组件大小');
    }

    // 检查包大小
    if (metric.bundleSize) {
      if (metric.bundleSize > this.thresholds.bundleSizeError) {
        issues.push(`包大小过大: ${(metric.bundleSize / 1024).toFixed(2)}KB`);
        suggestions.push('考虑代码分割或移除不必要的依赖');
      } else if (metric.bundleSize > this.thresholds.bundleSizeWarning) {
        issues.push(`包大小较大: ${(metric.bundleSize / 1024).toFixed(2)}KB`);
        suggestions.push('考虑优化依赖或使用动态导入');
      }
    }

    // 检查错误
    if (metric.error) {
      issues.push(`加载错误: ${metric.error}`);
      suggestions.push('检查组件代码和依赖是否正确');
    }

    // 输出分析结果
    if (issues.length > 0) {
    } else if (metric.loadDuration > 100) {
      // 加载时间超过100ms但没有性能问题，可以在这里添加警告日志
    }
  }

  /**
   * 获取路由性能统计
   */
  getRouteStats(path: string): {
    averageLoadTime: number;
    minLoadTime: number;
    maxLoadTime: number;
    totalLoads: number;
    errorRate: number;
    preloadRate: number;
  } | null {
    const pathMetrics = this.metrics.get(path);
    if (!pathMetrics || pathMetrics.length === 0) {
      return null;
    }

    const loadTimes = pathMetrics.map((m) => m.loadDuration);
    const errors = pathMetrics.filter((m) => m.error).length;
    const preloads = pathMetrics.filter((m) => m.preloaded).length;

    return {
      averageLoadTime: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length,
      minLoadTime: Math.min(...loadTimes),
      maxLoadTime: Math.max(...loadTimes),
      totalLoads: pathMetrics.length,
      errorRate: errors / pathMetrics.length,
      preloadRate: preloads / pathMetrics.length,
    };
  }

  /**
   * 获取所有路由的性能报告
   */
  getPerformanceReport(): {
    totalRoutes: number;
    averageLoadTime: number;
    slowestRoutes: Array<{ path: string; averageTime: number }>;
    mostErrorProneRoutes: Array<{ path: string; errorRate: number }>;
    recommendations: string[];
  } {
    const allPaths = Array.from(this.metrics.keys());
    const allStats = allPaths
      .map((path) => ({
        path,
        stats: this.getRouteStats(path)!,
      }))
      .filter((item) => item.stats);

    const totalLoadTime = allStats.reduce(
      (sum, item) => sum + item.stats.averageLoadTime,
      0,
    );
    const averageLoadTime = totalLoadTime / allStats.length;

    const slowestRoutes = allStats
      .sort((a, b) => b.stats.averageLoadTime - a.stats.averageLoadTime)
      .slice(0, 5)
      .map((item) => ({
        path: item.path,
        averageTime: item.stats.averageLoadTime,
      }));

    const mostErrorProneRoutes = allStats
      .filter((item) => item.stats.errorRate > 0)
      .sort((a, b) => b.stats.errorRate - a.stats.errorRate)
      .slice(0, 5)
      .map((item) => ({
        path: item.path,
        errorRate: item.stats.errorRate,
      }));

    const recommendations: string[] = [];

    if (averageLoadTime > this.thresholds.loadTimeWarning) {
      recommendations.push('整体加载时间偏高，考虑启用更多预加载');
    }

    if (slowestRoutes.length > 0) {
      recommendations.push(`优先优化最慢的路由: ${slowestRoutes[0].path}`);
    }

    if (mostErrorProneRoutes.length > 0) {
      recommendations.push(
        `修复错误率最高的路由: ${mostErrorProneRoutes[0].path}`,
      );
    }

    return {
      totalRoutes: allPaths.length,
      averageLoadTime,
      slowestRoutes,
      mostErrorProneRoutes,
      recommendations,
    };
  }

  /**
   * 清除性能数据
   */
  clearMetrics(path?: string): void {
    if (path) {
      this.metrics.delete(path);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * 设置性能阈值
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * 导出性能数据
   */
  exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      thresholds: this.thresholds,
      metrics: Array.from(this.metrics.entries()).reduce(
        (obj, [key, value]) => {
          obj[key] = value;
          return obj;
        },
        {} as Record<string, any>,
      ),
      report: this.getPerformanceReport(),
    };

    return JSON.stringify(data, null, 2);
  }
}

// 创建全局实例
export const routePerformanceAnalyzer = new RoutePerformanceAnalyzer();

// 开发环境下的性能监控助手
if (process.env.NODE_ENV === 'development') {
  // 添加到全局对象，方便调试
  (window as any).__routePerformanceAnalyzer = routePerformanceAnalyzer;

  // 定期输出性能报告
  setInterval(() => {
    const report = routePerformanceAnalyzer.getPerformanceReport();
    if (report.totalRoutes > 0) {
      // TODO: 处理性能建议 - if (report.recommendations.length > 0) { ... }
    }
  }, 30000); // 每30秒输出一次
}

export default RoutePerformanceAnalyzer;
