# Metalens 前后端一体化开发任务

## 后端 API 开发
- [x] 实现 Follow / Unfollow API
- [x] 实现 Notification 后端存储与 API
- [x] 扩展 Community API 支持 Likes 统计与状态

### 4. 前端集成 (Integration)
- [x] 重构 `AuthContext` 对接真实后端
- [x] 重构 `DataContext` 对接全量异步数据流
- [x] 联动 `FavoritesContext` 与后端 Likes API
- [x] 修复 `Profile` 页面异步加载与关注交互
- [x] 修复 `CreateAlbum` 异步导航与重复提交 Bug
- [x] 修复 `UploadDetails` 接口字段映射与 ID 转换 Bug
- [x] 修复 Supabase 图片存储物理上传链路 (FormData 模式)
- [x] 修复他人主页访问黑屏 (兼容 UUID / 用户名)
- [x] 重构 `UserList.tsx` 异步加载逻辑，防止页面崩溃
- [x] 修复并升级消息通知系统 (支持头像、作品预览、防止黑屏)
- [x] 实现 Supabase Storage 物理文件同步清理 (删除照片/相册时)
    - [x] [FIX] 增加 `onDelete: Cascade` 解决点赞关联导致的删除失败

### 5. 验证与优化 (Verification)
- [x] 验证后端自动封面更新逻辑 (First photo -> Album cover)
- [x] 验证 CORS 配置支持策展海报生成
- [x] 验证多用户社交闭环 (Follow/Like/Notification)
- [x] 整体逻辑与产品需求说明书一致性核对

### 6. UI 体验优化 (UI/UX)
- [x] 统一全站页面容器为 `max-w-md mx-auto` (手机 APP 风格)
    - [x] 适配 `CreateAlbum.tsx` 与 `UploadDetails.tsx` (包含底部固定按钮居中)
    - [x] 适配 `Favorites.tsx`, `Notifications.tsx`, `UserList.tsx` (包含 header 居中与阴影)
    - [x] 适配 `PosterCollage.tsx`, `PosterGrid.tsx`, `PosterBook.tsx` (移除边框，统一 header 与控制按钮)
- [x] 修复因 UI 适配引入的语法错误
- [x] 优化 `BottomNav` 居中逻辑与 `App.tsx` 全局背景
- [x] 完成全站 UI 一致性自核
- [x] 修复相册删除导致的登录失效问题
    - [x] [MODIFY] 后端 `AuthGuard` 的异常处理与依赖注入
    - [x] [MODIFY] 数据库 `schema.prisma` 的级联删除支持
    - [x] [MODIFY] 前端 `AuthContext.tsx` 的精细化错误提示
- [x] 社区分类重命名与过滤修复
    - [x] [MODIFY] 后端 `CommunityService` 的分类映射 (插画 -> 绘画艺术)
    - [x] [MODIFY] 前端 `Community.tsx` 的过滤标签 (插画 -> 绘画艺术)
    - [x] 验证公开作品在“绘画艺术”分类下的显示情况

### 7. 数据一致性修复 (Data Consistency) [NEW]
- [x] 修复社区列表 `getFeed` 分页导致的 `ImageDetail` 本地数据缺失问题
    - [x] [FE] `ImageDetail` 增加远程数据兜底 fetch 逻辑
    - [x] [FE] 即使本地无数据，也能通过 ID 从后端获取完整详情
- [x] 修复 `Follow` 按钮状态不同步问题
    - [x] [FE] 修正 `toggleFollow` 传参错误 (Name -> ID)
    - [x] [FE] 统一 UI 数据源为 `activeItem`
- [x] 修复 `Notification` 列表显示失效问题
    - [x] [BE] 诊断确认后端数据完整
    - [x] [FE] 数据源修复后，点击通知可正常进入详情
