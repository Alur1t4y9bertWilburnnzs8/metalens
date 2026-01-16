# 社交功能与稳定性回归修复计划

## 目标
1. 修复访问他人主页（如 `jade`）时的渲染崩溃。
2. 修复消息通知页面无法显示发起人信息及作品缩略图的问题。
3. 修复关注状态不同步及通知失效问题。

## 已完成变更

### 1. 数据库级联删除修复 (Prisma)
- 为 `Like`, `Follow` 模型增加了 `onDelete: Cascade`，防止因外键约束导致的删除失败。
- 已执行 `prisma db push` 同步。

### 2. 前端 ID 比较逻辑鲁棒化
- 统一使用 `String()` 进行 ID 比较，解决了数字/字符串类型不一致导致的删除 Bug。

### 3. 数据一致性修复 (Critical)
#### [MODIFY] [ImageDetail.tsx](file:///d:/桌面/metalens/pages/ImageDetail.tsx)
- **Problem**: 从通知或深链接进入详情页时，因本地 Feed 分页缺失数据，导致回退到 Placeholder (Jane Doe) 显示，进而导致关注状态错误。
- **Fix**: 引入 `useEffect` 和 `remoteItem` 状态。当本地数据不足时，自动请求 `/api/photos/:id` 获取最新数据。
- **Fix**: 修正 `toggleFollow` 参数，从传递 `authorName` 改为正确的 `authorId`。
- **Fix**: 全面替换渲染源 `initialItem` -> `activeItem`，确保 UI 响应数据变化。

### 4. 诊断与验证
- 创建后端脚本 `debug_issue.js` 验证了数据库中 Notification, Like, Follow 数据是完整且正确的。
- 确认主要问题在于前端数据获取与同步机制，现已修复。
