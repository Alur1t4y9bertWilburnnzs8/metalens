# Metalens 项目 AI 交接指南 (Handover Guide)

如果你是接手此项目的 AI 助手（Antigravity 或其他），请按照以下步骤快速恢复项目上下文：

## 1. 恢复记忆 (Context Recovery)
请优先读取以下文件以了解项目最新进展和技术细节：
- `.agent/task.md`: 当前任务清单与完成进度。
- `.agent/implementation_plan.md`: 最近一次重大修复/功能的详细设计方案。
- `backend/prisma/schema.prisma`: 数据库核心模型结构。

## 2. 初始化指令 (Prompt for next AI)
你可以直接将以下内容粘贴给 AI 来启动任务：
> "我正在开发一个名为 Metalens 的全栈项目（React + NestJS + Supabase）。项目根目录的 `.agent` 文件夹下存储了之前的开发进度和规划。请读取 `.agent/task.md` 了解我们目前做到了哪一步，并基于此协助我继续开发。"

## 3. 技术概览 (Tech Stack)
- **前端**: React + TypeScript + Vite + Tailwind (手机 APP 风格)。
- **后端**: NestJS + Prisma (部署在云端代理)。
- **数据库/认证**: Supabase。
- **项目结构**: `backend/` 为服务端，根目录其他部分为前端。

## 4. 开发约定
- 所有回复必须使用简体中文。
- 遵循 `.agent/task.md` 中的 UI 适配方案 (max-w-md)。
- 数据库修改后需运行 `npx prisma db push`。

## 5. 待办亮点 (Current Focus)
- 确保消息通知的全面同步。
- 验证生产环境部署后的跨域 (CORS) 与图片物理清理逻辑。
