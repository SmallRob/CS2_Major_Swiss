# 前端Docker部署说明

本文档说明如何使用Docker容器化部署CS2瑞士轮预测系统的前端应用。

## 目录结构

项目frontend目录下包含以下Docker相关文件：
- `Dockerfile`: 生产环境的容器镜像构建文件
- `Dockerfile.dev`: 开发环境的容器镜像构建文件
- `docker-compose.yaml`: 生产环境的容器部署配置
- `docker-compose.dev.yaml`: 开发环境的容器部署配置
- `DOCKER_DEPLOY.md`: 本说明文件

## 构建和部署

### 生产环境部署

1. 构建镜像：
```bash
docker-compose build
```

2. 运行容器：
```bash
docker-compose up
```

3. 后台运行：
```bash
docker-compose up -d
```

4. 查看日志：
```bash
docker-compose logs -f
```

### 开发环境部署

1. 构建开发环境镜像：
```bash
docker-compose -f docker-compose.dev.yaml build
```

2. 运行开发环境容器：
```bash
docker-compose -f docker-compose.dev.yaml up
```

3. 后台运行开发环境：
```bash
docker-compose -f docker-compose.dev.yaml up -d
```

## 数据挂载说明

### 生产环境
- `./public/data` → `/app/build/data`：挂载前端所需的JSON数据文件

### 开发环境
- `./src` → `/app/src`：挂载源代码以支持热重载
- `./public` → `/app/public`：挂载公共资源文件
- `./public/data` → `/app/public/data`：挂载前端所需的JSON数据文件
- `../data` → `/app/data`：挂载项目根目录的数据文件（与后端共享）

## 访问应用

运行容器后，可通过以下地址访问前端应用：
- http://localhost:3001

## 停止容器

```bash
# 停止生产环境容器
docker-compose down

# 停止开发环境容器
docker-compose -f docker-compose.dev.yaml down
```

## 注意事项

1. 确保Docker Engine已正确安装
2. 如果端口3001已被占用，请修改docker-compose文件中的端口映射
3. 在开发环境中，源代码的修改会实时反映在容器中
4. 数据文件的修改也会实时同步到容器中