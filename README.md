# 智能种植方舱三维可视化管理系统原型

技术栈：

- 前端：Vue 3 + TypeScript + Three.js + GLTFLoader + ECharts
- 后端：Node.js NestJS
- 实时通信：WebSocket / Socket.IO
- 数据库预留：MySQL + InfluxDB，第一版使用模拟内存数据
- 缓存/消息预留：Redis + MQTT，第一版暂不连接外部服务

## 启动

Windows 上 npm 在中文路径下可能出现依赖解包失败。本机已经准备了一个可运行副本：

```text
C:\codex-work\plant-cabin-prototype
```

建议在该目录运行开发服务：

```bash
npm install
npm run dev:backend
npm run dev:frontend
```

默认地址：

- 前端：http://localhost:5173
- 后端：http://localhost:3001

## 三维模型预留

将真实方舱 GLTF 模型放到：

```text
frontend/public/models/cabin.gltf
```

系统会优先加载该模型；如果模型不存在，会自动使用程序生成的简化方舱模型。
