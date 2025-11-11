# @modules 目录架构规范批量修复命令

> **生成时间**: 2025-11-11
> **用途**: 批量检查和修复目录组织问题

---

## 🔍 检查命令（全局扫描）

### 1. 查找所有 UI 内的 hooks

```bash
cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

echo "=== 查找 UI 目录内的 hooks 目录 ==="
find apps/veaiops/src/modules -type d -name "hooks" -path "*/ui/*" | \
  while read dir; do
    echo "❌ $dir"
    ls -la "$dir" | grep -E "\.ts$|\.tsx$" | awk '{print "   - " $NF}'
  done
```

### 2. 查找嵌套深度超过3层的目录

```bash
echo "=== 查找嵌套深度超过3层的目录 ==="
find apps/veaiops/src/modules -type d | \
  awk -F/ 'NF > 12 {print NF-8 "层: " $0}' | \
  sort -rn | head -20
```

### 3. 检查同源导入未合并

```bash
echo "=== 检查 react 重复导入 ==="
for module in system event-center oncall threshold auth; do
  echo "--- $module ---"
  cd apps/veaiops/src/modules/$module 2>/dev/null || continue
  grep -rn "^import.*from 'react'" . --include="*.ts" --include="*.tsx" 2>/dev/null | \
    awk -F: '{print $1}' | uniq -c | awk '$1 > 1 {print "  ❌ " $2 " (" $1 " 次导入)"}' | head -10
  cd - > /dev/null
done

echo ""
echo "=== 检查 @arco-design/web-react 重复导入 ==="
for module in system event-center oncall threshold auth; do
  echo "--- $module ---"
  cd apps/veaiops/src/modules/$module 2>/dev/null || continue
  grep -rn "^import.*from '@arco-design/web-react'" . --include="*.ts" --include="*.tsx" 2>/dev/null | \
    awk -F: '{print $1}' | uniq -c | awk '$1 > 1 {print "  ❌ " $2 " (" $1 " 次导入)"}' | head -10
  cd - > /dev/null
done
```

### 4. 检查 hooks 内的 types/lib/utils

```bash
echo "=== 检查 hooks 目录内的 types.ts ==="
find apps/veaiops/src/modules -path "*/hooks/types.ts" -o -path "*/hooks/*/types.ts" | \
  grep -v node_modules

echo ""
echo "=== 检查 hooks 目录内的 lib/ ==="
find apps/veaiops/src/modules -type d -name "lib" -path "*/hooks/*"

echo ""
echo "=== 检查 hooks 目录内的 utils/ ==="
find apps/veaiops/src/modules -type d -name "utils" -path "*/hooks/*"
```

### 5. 检查 UI 内的 utils/types

```bash
echo "=== 检查 UI 组件内的 utils.ts ==="
find apps/veaiops/src/modules -path "*/ui/*/utils.ts" -o -path "*/ui/*/*/utils.ts" | \
  grep -v node_modules | head -20

echo ""
echo "=== 检查 UI 组件内的 types.ts ==="
find apps/veaiops/src/modules -path "*/ui/*/types.ts" -o -path "*/ui/*/*/types.ts" | \
  grep -v node_modules | head -20
```

---

## 🔧 批量修复命令

### 修复 1: 批量合并 react 同源导入

```bash
cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

# 找到所有重复导入 react 的文件
find apps/veaiops/src/modules -name "*.ts" -o -name "*.tsx" | while read file; do
  # 检查是否有多次 react 导入
  react_imports=$(grep -c "^import.*from 'react'" "$file" 2>/dev/null || echo "0")
  if [ "$react_imports" -gt 1 ]; then
    echo "❌ $file (${react_imports}次)"
  fi
done
```

**手动修复模板**：
```typescript
// ❌ 修复前
import type React from 'react';
import { useState, useCallback } from 'react';

// ✅ 修复后
import React, { useState, useCallback } from 'react';
```

### 修复 2: 批量合并 @arco-design/web-react 同源导入

```bash
# 找到所有重复导入 @arco-design/web-react 的文件
find apps/veaiops/src/modules -name "*.ts" -o -name "*.tsx" | while read file; do
  arco_imports=$(grep -c "^import.*from '@arco-design/web-react'" "$file" 2>/dev/null || echo "0")
  if [ "$arco_imports" -gt 1 ]; then
    echo "❌ $file (${arco_imports}次)"
  fi
done
```

**手动修复模板**：
```typescript
// ❌ 修复前
import { Button, Form } from '@arco-design/web-react';
import type { FormInstance } from '@arco-design/web-react';

// ✅ 修复后
import { Button, Form, type FormInstance } from '@arco-design/web-react';

// ⚠️ 注意：icon 子包保持独立
import { Button } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';  // ✅ 保持独立
```

---

## 🚀 快速修复脚本（自动化）

### 脚本 1: 自动合并 react 导入

```bash
#!/bin/bash
# auto-merge-react-imports.sh

cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

# 注意：此脚本需要人工审查后执行

find apps/veaiops/src/modules -name "*.tsx" -o -name "*.ts" | while read file; do
  # 检查是否有 "import type React" 和 "import { ... } from 'react'"
  if grep -q "^import type React from 'react'" "$file" && \
     grep -q "^import {.*} from 'react'" "$file"; then
    echo "处理: $file"
    # 需要使用 sed 或手动处理
  fi
done
```

### 脚本 2: 检查导入统计

```bash
#!/bin/bash
# check-import-stats.sh

cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

echo "=== 导入统计分析 ==="
echo ""

for module in system event-center oncall threshold auth; do
  echo "📦 模块: $module"
  module_path="apps/veaiops/src/modules/$module"

  if [ ! -d "$module_path" ]; then
    echo "  ⚠️ 目录不存在"
    continue
  fi

  # 统计 react 导入
  react_files=$(find "$module_path" -name "*.ts" -o -name "*.tsx" | \
    xargs grep -l "^import.*from 'react'" 2>/dev/null | wc -l)
  react_dup=$(find "$module_path" -name "*.ts" -o -name "*.tsx" | while read f; do
    grep -c "^import.*from 'react'" "$f" 2>/dev/null || echo "0"
  done | awk '$1 > 1' | wc -l)

  # 统计 @arco-design 导入
  arco_files=$(find "$module_path" -name "*.ts" -o -name "*.tsx" | \
    xargs grep -l "^import.*from '@arco-design/web-react'" 2>/dev/null | wc -l)
  arco_dup=$(find "$module_path" -name "*.ts" -o -name "*.tsx" | while read f; do
    grep -c "^import.*from '@arco-design/web-react'" "$f" 2>/dev/null || echo "0"
  done | awk '$1 > 1' | wc -l)

  echo "  react 导入: $react_files 个文件"
  if [ "$react_dup" -gt 0 ]; then
    echo "  ❌ 重复导入: $react_dup 个文件"
  else
    echo "  ✅ 无重复导入"
  fi

  echo "  @arco 导入: $arco_files 个文件"
  if [ "$arco_dup" -gt 0 ]; then
    echo "  ❌ 重复导入: $arco_dup 个文件"
  else
    echo "  ✅ 无重复导入"
  fi
  echo ""
done
```

---

## 📝 修复进度追踪

### P0 任务（必须修复）- 5/5 完成 ✅

- [x] **subscription**: UI 内 hooks 移除
- [x] **strategy**: hooks 内 types.ts 移除
- [x] **oncall**: UI 组件内 hooks/utils/types 移除
- [x] **threshold**: UI 内 hooks 检查
- [x] **bot**: UI 内 hooks 识别和报告生成

### P1 任务（建议修复）- 0/2 完成

- [ ] **bot**: 减少嵌套层级
  - [ ] table/handlers/crud/update-handler/ (305行，4个文件) → 第3层
  - [ ] form/create-form/main-logic/ (242行，4个文件) → 第3层

- [ ] **datasource**: 减少嵌套层级
  - [ ] lib/columns/monitor/utils/ → lib/utils/
  - [ ] lib/columns/monitor/fields/ → lib/utils/

### P2 任务（可选优化）

- [ ] 全局同源导入合并（预计 100+ 处）
- [ ] 文件名简化（移除冗余前缀）

---

## 🎯 修复决策建议

### bot/hooks 嵌套层级（P1）

**update-handler (305行，4个文件)**：

```bash
# 选项 A: 合并为单文件（推荐，如果逻辑连贯）
hooks/table/handlers/
└── update-handler.ts      # 合并所有逻辑（305行可接受）

# 选项 B: 保留拆分，但提升到第3层
hooks/table/
└── update-handler/        # 第3层
    ├── logic.ts
    ├── validation.ts
    └── error-handler.ts
```

**main-logic (242行，4个文件)**：

```bash
# 选项 A: 合并为单文件（推荐）
hooks/form/create-form/
└── main.ts                # 合并所有逻辑（242行可接受）

# 选项 B: 保留关键拆分
hooks/form/create-form/
├── main.ts                # 合并 state + callbacks（155行）
└── effects.ts             # 保留（70行）
```

### datasource/lib/columns 嵌套层级（P1）

```bash
# 推荐方案：提升到 lib/utils/
lib/
├── columns/
│   ├── monitor.tsx        # 合并主列配置
│   └── index.ts
└── utils/
    ├── field-selector.ts  # 从 columns/monitor/utils/ 提升
    └── monitor-fields/    # 从 columns/monitor/fields/ 提升
        ├── base.tsx
        ├── specific.ts
        └── index.ts
```

---

## ⚡ 一键检查脚本

```bash
#!/bin/bash
# quick-arch-check.sh - 快速架构规范检查

cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

echo "========================================="
echo "  @modules 目录架构规范快速检查"
echo "========================================="
echo ""

# 1. UI 内 hooks
echo "🔍 1. 检查 UI 内 hooks 目录..."
ui_hooks=$(find apps/veaiops/src/modules -type d -name "hooks" -path "*/ui/*" | wc -l)
if [ "$ui_hooks" -gt 0 ]; then
  echo "❌ 发现 $ui_hooks 处 UI 内 hooks"
  find apps/veaiops/src/modules -type d -name "hooks" -path "*/ui/*"
else
  echo "✅ 无 UI 内 hooks"
fi
echo ""

# 2. hooks 内 types.ts
echo "🔍 2. 检查 hooks 内 types.ts..."
hooks_types=$(find apps/veaiops/src/modules -path "*/hooks/types.ts" | wc -l)
if [ "$hooks_types" -gt 0 ]; then
  echo "❌ 发现 $hooks_types 处 hooks 内 types.ts"
  find apps/veaiops/src/modules -path "*/hooks/types.ts"
else
  echo "✅ 无 hooks 内 types.ts"
fi
echo ""

# 3. 嵌套深度
echo "🔍 3. 检查嵌套深度（> 3层）..."
deep_dirs=$(find apps/veaiops/src/modules -type d | awk -F/ 'NF > 12' | wc -l)
if [ "$deep_dirs" -gt 0 ]; then
  echo "❌ 发现 $deep_dirs 处超过3层嵌套"
  find apps/veaiops/src/modules -type d | awk -F/ 'NF > 12 {print "  " NF-8 "层: " $0}' | head -10
else
  echo "✅ 嵌套深度合规"
fi
echo ""

# 4. 同源导入统计
echo "🔍 4. 检查同源导入合并..."
total_files=$(find apps/veaiops/src/modules -name "*.tsx" -o -name "*.ts" | wc -l)
react_dup=0
arco_dup=0

for file in $(find apps/veaiops/src/modules -name "*.tsx" -o -name "*.ts"); do
  r_count=$(grep -c "^import.*from 'react'" "$file" 2>/dev/null || echo "0")
  [ "$r_count" -gt 1 ] && react_dup=$((react_dup + 1))

  a_count=$(grep -c "^import.*from '@arco-design/web-react'" "$file" 2>/dev/null || echo "0")
  [ "$a_count" -gt 1 ] && arco_dup=$((arco_dup + 1))
done

echo "  总文件数: $total_files"
if [ "$react_dup" -gt 0 ]; then
  echo "  ❌ react 重复导入: $react_dup 个文件"
else
  echo "  ✅ react 导入合规"
fi

if [ "$arco_dup" -gt 0 ]; then
  echo "  ❌ @arco 重复导入: $arco_dup 个文件"
else
  echo "  ✅ @arco 导入合规"
fi
echo ""

# 总结
echo "========================================="
echo "  检查总结"
echo "========================================="
total_issues=$((ui_hooks + hooks_types + deep_dirs))
if [ "$total_issues" -eq 0 ] && [ "$react_dup" -eq 0 ] && [ "$arco_dup" -eq 0 ]; then
  echo "✅ 架构规范检查全部通过！"
else
  echo "⚠️  发现 $total_issues 处严重问题"
  echo "⚠️  发现 $((react_dup + arco_dup)) 处导入问题"
  echo ""
  echo "建议运行详细检查命令查看具体位置"
fi
```

**使用方法**：
```bash
# 保存脚本
cat > quick-arch-check.sh << 'EOF'
[上面的脚本内容]
EOF

# 添加执行权限
chmod +x quick-arch-check.sh

# 运行检查
./quick-arch-check.sh
```

---

## ✅ 验证命令

```bash
cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

# 1. 清除缓存
echo "🧹 清除缓存..."
pnpm nx reset
rm -rf apps/veaiops/dist

# 2. 代码格式化
echo "🎨 格式化代码..."
pnpm format

# 3. 类型检查
echo "🔍 类型检查..."
pnpm type-check 2>&1 | tee type-check.log

# 4. ESLint 检查
echo "📝 ESLint 检查..."
pnpm eslint 2>&1 | tee eslint.log

# 5. 构建测试
echo "🏗️  构建测试..."
pnpm build 2>&1 | tee build.log

# 6. 查看错误统计
echo ""
echo "========================================="
echo "  验证结果统计"
echo "========================================="
echo "类型错误: $(grep -c "error TS" type-check.log || echo 0)"
echo "ESLint 错误: $(grep -c "error" eslint.log || echo 0)"
echo "构建错误: $(grep -c "ERROR" build.log || echo 0)"
```

---

## 📊 修复效果评估

运行以下命令生成修复效果报告：

```bash
cd /Users/bytedance/Desktop/ve-arch/agent/veaiops/frontend

echo "========================================="
echo "  修复效果评估报告"
echo "========================================="
echo ""

# 职能边界
echo "📁 职能边界检查："
ui_hooks=$(find apps/veaiops/src/modules -type d -name "hooks" -path "*/ui/*" | wc -l)
hooks_lib=$(find apps/veaiops/src/modules -type d -name "lib" -path "*/hooks/*" | wc -l)
hooks_types=$(find apps/veaiops/src/modules -path "*/hooks/types.ts" | wc -l)

echo "  UI 内 hooks: $ui_hooks 处"
echo "  hooks 内 lib: $hooks_lib 处"
echo "  hooks 内 types.ts: $hooks_types 处"

if [ "$ui_hooks" -eq 0 ] && [ "$hooks_lib" -eq 0 ] && [ "$hooks_types" -eq 0 ]; then
  echo "  ✅ 职能边界清晰"
else
  echo "  ❌ 存在职能混淆"
fi
echo ""

# 嵌套深度
echo "📊 嵌套深度检查："
deep_dirs=$(find apps/veaiops/src/modules -type d | awk -F/ 'NF > 12' | wc -l)
echo "  超过3层: $deep_dirs 处"

if [ "$deep_dirs" -eq 0 ]; then
  echo "  ✅ 嵌套深度合规"
else
  echo "  ❌ 存在过深嵌套"
fi
echo ""

# 代码质量
echo "💯 代码质量评分："
total_files=$(find apps/veaiops/src/modules -name "*.tsx" -o -name "*.ts" | wc -l)
echo "  总文件数: $total_files"

# 计算合规文件数
compliant=$((total_files - ui_hooks * 5 - hooks_lib * 3 - hooks_types * 2 - deep_dirs * 2))
percentage=$((compliant * 100 / total_files))

echo "  合规文件: ~$compliant 个"
echo "  合规率: ~$percentage%"
echo ""

if [ "$percentage" -ge 90 ]; then
  echo "🏆 评级: 优秀"
elif [ "$percentage" -ge 80 ]; then
  echo "🥈 评级: 良好"
elif [ "$percentage" -ge 70 ]; then
  echo "🥉 评级: 及格"
else
  echo "⚠️  评级: 需要改进"
fi
```

---

## 🔗 相关文档

- `ARCH_FIXES_REPORT.md` - 详细修复报告
- `ARCH_FIXES_SUMMARY.md` - 完整修复总结
- `.cursorrules` - 项目规范（第4745-5686行：Feature 目录组织统一规范）

---

**最后更新**: 2025-11-11
**修复进度**: P0 任务 5/5 完成 ✅ | P1 任务 0/2 完成
**建议**: 运行 `quick-arch-check.sh` 查看当前状态
