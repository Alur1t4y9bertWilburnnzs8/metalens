# Metalens 前后端一体化开发任务

## 后端 API 开发
- [x] 实现 Follow / Unfollow API
- [x] 实现 Notification 后端存储与 API
- [x] 扩展 Community API 支持 Likes 统计与状态

### 7. 数据一致性修复 (Data Consistency)
- [x] 修复社区列表 `getFeed` 分页导致的 `ImageDetail` 本地数据缺失问题
    - [x] [FE] `ImageDetail` 增加远程数据兜底 fetch 逻辑
    - [x] [FE] 即使本地无数据，也能通过 ID 从后端获取完整详情
- [x] 修复 `Follow` 按钮状态不同步问题
    - [x] [FE] 修正 `toggleFollow` 传参错误 (Name -> ID)
    - [x] [FE] 统一 UI 数据源为 `activeItem`
- [x] 修复 `Notification` 列表显示失效问题
    - [x] [BE] 诊断确认后端数据完整
    - [x] [FE] 数据源修复后，点击通知可正常进入详情

### 8. 生产环境部署 (Deployment) [NEW]
- [x] 准备 Git 上传环境与自动上传脚本
- [x] 完成代码同步至 GitHub 仓库
- [x] 实现后端 (NestJS) 在 Zeabur 的云端部署与数据库对接
- [x] 实现前端 (Vite) 在 Vercel 的生产环境发布
- [x] 验证前后端联调测试 (首屏加载、登录、社交交互)
- [x] 编写 AI 交接指南 (.agent 目录)
