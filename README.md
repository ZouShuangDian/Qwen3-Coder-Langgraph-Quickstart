# Qwen3-Coder Quickstart 项目说明文档

## 项目概述

Qwen3-Coder Quickstart 是一个全栈应用程序，结合了 React 前端和由 LangGraph 驱动的后端代理。该代理旨在通过动态生成搜索词、使用 Google Search 查询网络、反思结果以识别知识空白，并迭代优化搜索来对用户查询进行全面研究，直到能够提供有充分支持的答案和引用。

该应用程序展示了如何使用 LangGraph 和 Alibaba 的 Qwen3 模型构建研究增强型对话式 AI。

## 项目架构和组件

### 整体架构
```
项目根目录/
├── backend/           # LangGraph/FastAPI 后端应用
├── frontend/          # React 前端应用 (Vite)
├── Dockerfile         # Docker 构建配置
├── docker-compose.yml # 生产环境部署配置
└── Makefile           # 开发命令快捷方式
```

### 后端组件 (backend/)

1. **核心代理逻辑** (`src/agent/graph.py`):
   - 使用 LangGraph 构建的研究代理
   - 实现了完整的搜索-反思-优化循环
   - 主要节点包括:
     - `generate_query`: 生成初始搜索查询
     - `web_research`: 执行网络搜索
     - `reflection`: 分析结果并识别知识空白
     - `finalize_answer`: 生成最终答案

2. **API 应用** (`src/agent/app.py`):
   - 使用 FastAPI 构建
   - 提供 LangGraph API 端点
   - 为生产环境提供静态前端文件服务

3. **配置管理** (`src/agent/configuration.py`):
   - 定义代理配置参数
   - 支持模型选择、查询数量、循环次数等配置

4. **提示词模板** (`src/agent/prompts.py`):
   - 定义各个代理节点使用的提示词
   - 包括查询生成、网络搜索、反思分析和答案合成的提示词

5. **工具和数据结构** (`src/agent/tools_and_schemas.py`):
   - 定义代理使用的数据结构模型
   - 包括搜索查询列表和反思结果的 Pydantic 模型

6. **实用工具** (`src/agent/utils.py`):
   - 提供各种辅助函数
   - 包括引用处理、URL 解析等功能

### 前端组件 (frontend/)

1. **主应用组件** (`src/App.tsx`):
   - 使用 LangGraph SDK 与后端通信
   - 实现聊天界面和实时活动流显示
   - 处理用户输入和代理状态更新

2. **UI 组件**:
   - `WelcomeScreen`: 欢迎界面
   - `ChatMessagesView`: 聊天消息视图
   - `InputForm`: 用户输入表单
   - `ActivityTimeline`: 代理活动时间线

## 开发环境设置

### 前置要求
- Node.js 和 npm (或 yarn/pnpm)
- Python 3.11+
- Alibaba Qwen3 API 密钥

### 环境配置

1. **获取 Qwen3 API 密钥**:
   - 在 `backend/` 目录下创建 `.env` 文件
   - 添加 `Qwen3_API_KEY="YOUR_ACTUAL_API_KEY"`

2. **安装依赖**:

   **后端**:
   ```bash
   cd backend
   pip install .
   ```

   **前端**:
   ```bash
   cd frontend
   npm install
   ```

### 运行开发服务器

**同时运行前后端**:
```bash
make dev
```

**分别运行**:
- 后端: 在 `backend/` 目录下运行 `langgraph dev`
- 前端: 在 `frontend/` 目录下运行 `npm run dev`

访问前端开发服务器 URL (例如 `http://localhost:5173/app`)

## 部署和生产环境配置

### Docker 部署

1. **构建 Docker 镜像**:
   ```bash
   docker build -t Qwen3-fullstack-langgraph -f Dockerfile .
   ```

2. **运行生产服务器**:
   ```bash
   Qwen3_API_KEY=<your_Qwen3_api_key> LANGSMITH_API_KEY=<your_langsmith_api_key> docker-compose up
   ```

访问 `http://localhost:8123/app/` 查看应用程序

### 依赖服务
- Redis: 用于发布-订阅机制，实现实时流输出
- PostgreSQL: 存储助手、线程、运行状态和长期记忆

### 环境变量
- `Qwen3_API_KEY`: Alibaba Qwen3 API 密钥
- `LANGSMITH_API_KEY`: LangSmith API 密钥 (可选)
- `REDIS_URI`: Redis 连接 URI
- `POSTGRES_URI`: PostgreSQL 连接 URI

## 技术栈和依赖

### 后端技术栈
- **LangGraph**: 构建代理工作流
- **FastAPI**: 后端 API 框架
- **Alibaba Qwen3**: LLM 模型 (查询生成、反思、答案合成)
- **LangChain**: 语言模型集成框架
- **Python 3.11+**: 编程语言

### 前端技术栈
- **React**: 前端 UI 框架
- **Vite**: 构建工具
- **Tailwind CSS**: 样式框架
- **Shadcn UI**: UI 组件库
- **TypeScript**: 类型安全的 JavaScript

### 主要依赖

**后端**:
- `langgraph>=0.2.6`
- `langchain>=0.3.19`
- `langchain-Alibaba-genai`
- `fastapi`
- `python-dotenv>=1.0.1`

**前端**:
- `@langchain/langgraph-sdk`
- `react>=19.0.0`
- `tailwindcss>=4.1.5`
- `@radix-ui/react-*` (UI 组件)

## 代理工作流程

1. **查询生成**: 基于用户输入，生成一组初始搜索查询
2. **网络研究**: 对每个查询执行网络搜索，收集相关信息
3. **反思分析**: 分析搜索结果，确定信息是否充分或存在知识空白
4. **迭代优化**: 如发现空白或信息不足，生成后续查询并重复研究过程
5. **答案合成**: 一旦研究充分，将收集的信息合成为连贯的答案，并包含引用

## CLI 使用

可以通过命令行直接运行代理:

```bash
cd backend
python examples/cli_research.py "What are the latest trends in renewable energy?"
```

支持的参数:
- `--initial-queries`: 初始搜索查询数量 (默认: 3)
- `--max-loops`: 最大研究循环次数 (默认: 2)
- `--reasoning-model`: 用于最终答案的模型 (默认: "Qwen3-2.5-pro")

## 自定义配置

可以通过环境变量或在调用时传递配置来定制代理行为:

- `QUERY_GENERATOR_MODEL`: 查询生成模型 (默认: "Qwen3-2.0-flash")
- `REFLECTION_MODEL`: 反思分析模型 (默认: "Qwen3-2.5-flash")
- `ANSWER_MODEL`: 答案合成模型 (默认: "Qwen3-2.5-pro")
- `NUMBER_OF_INITIAL_QUERIES`: 初始查询数量 (默认: 3)
- `MAX_RESEARCH_LOOPS`: 最大研究循环次数 (默认: 2)