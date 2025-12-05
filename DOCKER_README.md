# Docker部署说明

本项目支持通过Docker容器化部署，以便在任何环境中轻松运行CS2瑞士轮预测系统。

## 目录结构

项目根目录下包含以下Docker相关文件：
- `Dockerfile`: 定义了容器镜像的构建过程
- `docker-compose.yaml`: 定义了容器的部署配置
- `DOCKER_README.md`: 本说明文件

## 构建和部署

### 前提条件

1. 安装Docker Engine
2. 安装NVIDIA驱动程序（用于GPU加速）
3. 安装NVIDIA Container Toolkit（用于Docker中的GPU支持）

### 构建镜像

```bash
docker-compose build
```

### 运行容器

```bash
docker-compose up
```

这将启动容器并自动执行两个步骤：
1. 运行`cs2_gen_preresult.py`生成模拟数据
2. 运行`cs2_gen_final.py`执行Pick'Em优化

### 后台运行

```bash
docker-compose up -d
```

### 查看日志

```bash
docker-compose logs -f
```

## 配置说明

### GPU支持

docker-compose.yaml配置已启用NVIDIA GPU支持：
- 使用`deploy.resources.reservations.devices`声明GPU资源
- 设置`NVIDIA_VISIBLE_DEVICES=all`环境变量

### 数据挂载

容器内挂载了以下目录和文件：
- `./batchsize.yaml` → `/app/batchsize.yaml`：性能配置文件
- `./data` → `/app/data`：数据目录（包含配置文件、比赛数据和战队评分）
- `./output` → `/app/output`：输出目录（持久化存储结果）

### 配置文件

#### batchsize.yaml
可以通过修改`batchsize.yaml`来调整程序性能：
- `num_simulations`: 蒙特卡洛模拟次数
- `eval_batch_size`: GPU批处理大小（根据显存调整）
- `use_gpu`: 是否启用GPU加速（默认true）
- `gpu_id`: GPU设备ID（默认0）

#### data/config.json
可以通过修改`data/config.json`来调整队伍、对局和ELO系统配置：
- `teams`: 参赛队伍列表（按种子顺序排列）
- `round1_matchups`: 第一轮对局配对
- `elo_params`: ELO系统参数
  - `base_elo`: 基础ELO分数（默认1000）
  - `base_k_factor`: 基础K因子（默认40）
  - `time_decay_days`: 时间衰减天数（默认50）

## 输出结果

程序运行完成后，结果将保存在`./output`目录中：
- `intermediate_sim_data.json`: 中间模拟数据
- `final_prediction.json`: 最终预测结果

## 故障排除

### GPU不可用

如果遇到GPU相关问题，请确认：
1. 系统已安装NVIDIA驱动
2. 已安装NVIDIA Container Toolkit
3. Docker服务已重启

### 权限问题

如果遇到权限问题，请确认：
1. 当前用户属于docker组
2. 或者使用sudo运行docker-compose命令

### 显存不足

如果出现CUDA Out of Memory错误，请：
1. 减小`batchsize.yaml`中的`eval_batch_size`值
2. 重启容器