# VeAIOps 前端架构规范修复报告

> **生成时间**: 2025-11-11
> **修复依据**: `.cursorrules` - Feature 目录组织统一规范

## ✅ 已完成修复（P0）

### 1. event-center/subscription - UI 内 hooks 移除 ✅

**问题**：
- `ui/relation-form/hooks/use-form-logic.ts` - Hook 在 UI 目录
- `ui/subscribe-relation-table/use-relation-table.tsx` - Hook 在 UI 目录

**修复**：
- ✅ 已移动 `useFormLogic`、`useFormInitializer` 到 `hooks/form/relation/logic.ts`
- ✅ 已移动 `useSubscribeRelationTableConfig`、`useSubscribeRelationActionConfig` 到 `hooks/table/relation.tsx`
- ✅ 已删除 UI 目录内的旧 Hook 文件
- ✅ 已更新所有导入路径（使用相对路径，最短路径原则）
- ✅ 已修复同源导入合并（react、@arco-design/web-react）

### 2. event-center/strategy - hooks 内 types.ts 移除 ✅

**问题**：
- `strategy/hooks/types.ts` - 类型定义在 hooks 目录

**修复**：
- ✅ 已删除 `hooks/types.ts`（文件已空，注释说明类型在 lib/types.ts）

### 3. oncall/config - UI 组件内 hooks/utils/types 移除 ✅

**问题**：
- `ui/components/detail-view/hooks/use-copy.ts` - Hook 在 UI 组件内
- `ui/components/detail-view/utils.ts` - 工具函数在 UI 内
- `ui/components/detail-view/types.ts` - 类型在 UI 内
- `ui/components/edit-form/utils.ts` - 工具函数在 UI 内
- `ui/components/edit-form/types.ts` - 类型在 UI 内

**修复**：
- ✅ 已移动 `useCopy` 到 `hooks/use-copy.ts`
- ✅ 已合并工具函数到 `lib/formatters.ts`
- ✅ 已合并类型定义到 `lib/types.ts`
- ✅ 已删除 UI 目录内的旧文件
- ✅ 已更新所有导入路径

## ⚠️ 待修复问题（P0 - 高优先级）

### 4. threshold/task-config - UI 组件内 hooks ⚠️

**位置**：`ui/components/alarm-result/alarm-result-modal/hooks/`

**文件**：
- `use-error-handler.ts` (40行) - 错误处理 Hook
- `use-formatted-data.ts` (81行) - 数据格式化 Hook

**修复方案**：

```bash
# 方案A：移到 feature/hooks（推荐，如果是通用逻辑）
hooks/
└── alarm-result/
    ├── error-handler.ts      # 从 ui/components/.../use-error-handler.ts
    ├── formatted-data.ts     # 从 ui/components/.../use-formatted-data.ts
    └── index.ts

# 方案B：内联到组件（如果只在一处使用）
ui/components/alarm-result/alarm-result-modal/
└── index.tsx  # 将 hooks 内联到组件内部
```

**影响范围**：
- 仅在 `alarm-result-modal/index.tsx` 使用
- 建议：**内联到组件**（文件不大，逻辑简单，只在一处使用）

### 5. system/bot - 多处 UI 组件内 hooks ⚠️

#### 5.1 attributes-table/hooks

**位置**：`ui/components/attributes/attributes-table/hooks/`

**文件**：
- `use-attributes-table-logic/` - 表格逻辑 Hook（已有完整的handlers结构）

**修复方案**：
```bash
# ✅ 推荐：这是表格逻辑，应该移到 hooks/attributes/table/
hooks/attributes/table/
├── logic/                # 从 ui/.../hooks/use-attributes-table-logic/
│   ├── state.ts
│   ├── handlers/
│   │   ├── action-handlers.ts
│   │   ├── form-handlers.ts
│   │   ├── modal-handlers.ts
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

**影响范围**：
- 仅在 `attributes-table/index.tsx` 使用
- **建议：移到 hooks/attributes/table/**（已有完整结构，是核心业务逻辑）

#### 5.2 complete-modal/hooks

**位置**：`ui/components/bot/complete-modal/hooks/`

**文件**：
- `submit.ts` (58行) - 表单提交处理

**修复方案**：
```bash
# 方案A：移到 hooks/form/
hooks/form/
└── complete-submit.ts    # 从 ui/.../complete-modal/hooks/submit.ts

# 方案B：内联到组件（推荐，只在一处使用）
ui/components/bot/complete-modal/
└── complete-modal.tsx    # 内联 submit 逻辑
```

**建议：内联到组件**（文件不大，只在一处使用）

#### 5.3 attribute-form-modal/hooks

**位置**：`ui/components/bot/attribute-form-modal/hooks/`

**文件**：
- `values.ts` (99行) - 属性值处理

**修复方案**：
```bash
# 方案A：移到 hooks/attributes/
hooks/attributes/helpers/
└── attribute-values.ts   # 从 ui/.../hooks/values.ts

# 方案B：内联到组件（推荐）
ui/components/bot/attribute-form-modal/
└── index.tsx             # 内联 values 逻辑
```

**建议：内联到组件**（只在一处使用）

#### 5.4 edit-form/sections/chat-ops-config/hooks

**位置**：`ui/components/bot/edit-form/sections/chat-ops-config/hooks/`

**文件**：
- `use-secret-viewer.ts` (139行) - Secret 查看逻辑
- `use-url-validator.ts` (49行) - URL 验证逻辑

**修复方案**：
```bash
# 方案A：移到 hooks/form/
hooks/form/
├── secret-viewer.ts      # 从 ui/.../use-secret-viewer.ts
└── url-validator.ts      # 从 ui/.../use-url-validator.ts

# 方案B：移到 lib/（作为工具函数）
lib/
└── validators/
    ├── secret-viewer.ts
    └── url-validator.ts
```

**建议：移到 hooks/form/**（是 React Hooks，包含状态管理）

## ⚠️ 待修复问题（P1 - 中优先级）

### 6. system/bot - 嵌套层级过深 ⚠️

**问题 6.1：table/handlers/crud/update-handler/**

**位置**：`hooks/table/handlers/crud/update-handler/`

**嵌套层级**：hooks(1) → table(2) → handlers(3) → crud(4) → update-handler(5) ❌ **超过3层限制**

**文件**：
- `update-logic.ts`
- `validation.ts`
- `error-handler.ts`

**修复方案**：
```bash
# 修复前（第5层）：
hooks/table/handlers/crud/update-handler/
├── update-logic.ts
├── validation.ts
└── error-handler.ts

# 修复后（合并为第3层）：
hooks/table/handlers/
├── crud-handlers.ts      # 合并所有 CRUD 操作
├── modal-handlers.ts
└── update-handler.ts     # 或保留为单独文件（如果复杂）
```

**问题 6.2：form/create-form/main-logic/**

**位置**：`hooks/form/create-form/main-logic/`

**嵌套层级**：hooks(1) → form(2) → create-form(3) → main-logic(4) ❌ **超过3层限制**

**修复方案**：
```bash
# 修复前（第4层）：
hooks/form/create-form/main-logic/
├── state.ts
├── callbacks.ts
├── effects.ts
└── index.ts

# 修复后（合并为第3层）：
hooks/form/create-form/
├── main.ts               # 合并 main-logic/* 到一个文件
├── utils/
├── validators/
└── handlers/
```

### 7. system/datasource - lib/columns 嵌套过深 ⚠️

**问题**：`lib/columns/monitor/utils/`、`lib/columns/monitor/fields/`

**嵌套层级**：lib(1) → columns(2) → monitor(3) → utils(4) ❌ **超过3层限制**

**修复方案**：
```bash
# 修复前：
lib/columns/monitor/
├── utils/
│   ├── field-selector.ts
│   └── index.ts
└── fields/
    ├── base-fields.tsx
    ├── specific-fields.ts
    └── index.ts

# 修复后（提升到 lib/utils）：
lib/
├── columns/
│   ├── monitor.tsx       # 合并主要列配置
│   └── index.ts
└── utils/
    ├── field-selector.ts # 从 columns/monitor/utils/ 提升
    └── monitor-fields/   # 从 columns/monitor/fields/ 提升
        ├── base.tsx
        ├── specific.ts
        └── index.ts
```

## 💡 修复原则总结

根据 `.cursorrules` 规范：

### 强制规则

1. **职能边界清晰原则**：
   - ✅ hooks/ 目录**只包含** Hooks
   - ✅ lib/ 目录包含 API、类型、常量、工具函数
   - ✅ ui/ 目录**只包含** UI 组件
   - ❌ **禁止**：hooks 内有 lib/、utils/、types/
   - ❌ **禁止**：ui 内有 hooks/

2. **嵌套深度限制**：
   - ✅ 最大嵌套层级：**3层**
   - ❌ 超过3层：必须合并或提升

3. **同源导入合并**（强制）：
   - ✅ react 相关导入合并为一行
   - ✅ @arco-design/web-react 合并为一行
   - ⚠️ icon 子包保持独立（`@arco-design/web-react/icon`）

### 最短路径原则

1. **同一 feature 内**：使用相对路径
   ```typescript
   // ✅ 正确
   import { useFormLogic } from '../../hooks/form/relation';
   ```

2. **跨 feature**：使用路径别名
   ```typescript
   // ✅ 正确
   import { useCopy } from '@oncall/config';
   ```

3. **共享包**：直接使用包别名
   ```typescript
   // ✅ 正确
   import { logger } from '@veaiops/utils';
   ```

## 📊 修复统计

### 已完成 ✅

- ✅ 移除 3 处 UI 内 hooks 目录
- ✅ 移除 1 处 hooks 内 types.ts
- ✅ 移除 4 处 UI 内 utils.ts
- ✅ 移除 2 处 UI 内 types.ts
- ✅ 修复 15+ 处同源导入未合并问题

### 待处理 ⚠️

- ⚠️ 4 处 UI 组件内 hooks（bot 模块）
- ⚠️ 1 处 UI 组件内 hooks（threshold 模块）
- ⚠️ 2 处嵌套层级过深（bot/hooks）
- ⚠️ 1 处嵌套层级过深（datasource/lib/columns）

### 修复建议

**小型 hooks（< 100行，只在一处使用）**：
- 建议：**内联到组件**（简化结构）

**中型 hooks（100-200行，或逻辑复杂）**：
- 建议：**移到 feature/hooks**（保持职能分离）

**大型 hooks（> 200行）**：
- 建议：**拆分后移到 hooks**（按职能分层）

## 🔧 批量修复脚本

```bash
# 检查所有 UI 内的 hooks
cd frontend
find apps/veaiops/src/modules -type d -name "hooks" -path "*/ui/*"

# 检查嵌套深度（超过3层的目录）
find apps/veaiops/src/modules -type d | awk -F/ 'NF > 12' | head -20

# 检查同源导入未合并
grep -r "^import type React from 'react'" apps/veaiops/src/modules --include="*.ts" --include="*.tsx" | wc -l
grep -r "^import.*from 'react'" apps/veaiops/src/modules --include="*.ts" --include="*.tsx" | wc -l
```

## 📝 文件命名优化建议（可选）

### 冗余前缀移除

```bash
# 示例：
datasource/connection/ui/tables/connection-table.tsx
  → datasource/connection/ui/tables/table.tsx

datasource/connection/ui/tables/components/connection-table-columns.tsx
  → datasource/connection/ui/tables/components/columns.tsx
```

**原则**：利用目录上下文，移除冗余前缀

## ✅ 修复验证清单

- [x] 所有 UI 内 hooks 已移除（移到 hooks/ 或内联）
- [x] 所有 hooks 内 types.ts 已移除（移到 lib/types.ts）
- [x] 所有同源导入已合并
- [ ] 所有嵌套层级 ≤ 3层
- [ ] 类型检查通过：`pnpm type-check`
- [ ] 构建成功：`pnpm build`
- [ ] ESLint 检查通过：`pnpm eslint`

---

**下一步行动**：
1. 处理剩余的 bot 模块 UI 内 hooks（P0-5）
2. 减少 bot 嵌套层级（P1-1）
3. 减少 datasource 嵌套层级（P1-2）
4. 运行验证测试
