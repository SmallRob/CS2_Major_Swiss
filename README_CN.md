# CS2 Major 瑞士轮预测 (性能优化版)

[English](README.md) | 中文

本项目是用 ELO + Monte Carlo 模拟 + Valve 官方 Buchholz 配对规则预测 CS2 Major 瑞士轮结果。

其实就是跑10万次瑞士轮模拟,然后暴力搜索1000万种 Pick'Em 组合,找出最优预测方案。基于历史比赛数据计算队伍评分。

**v2.0 支持 GPU 加速**: 比 v1.0 的 16 核 CPU 快了几十倍 (感谢**[Tenzray](https://github.com/Tenzray)** 大佬的PR)。

**v2.1 性能优化版**: 新增多项性能优化，包括内存管理、向量化计算、智能批处理等，进一步提升运行效率。

## 数据格式(必须按照下面这种格式改场次和队伍数据)

### `data/cs2_cleaned_matches.csv`

无表头的 CSV 文件,7 列：

```
date,team1,score1,score2,team2,tournament,format
2025-11-21,Team A,2,1,Team B,Example Tournament,bo3
2025-11-20,Team C,16,14,Team D,Example League,bo1
```

- `date`: YYYY-MM-DD 格式
- `team1`, `team2`: 队伍名（必须和代码里的 TEAMS 列表一致）
- `score1`, `score2`: 比赛分数
- `tournament`: 赛事名（随便写,只是标记用）
- `format`: `bo1`、`bo3` 或 `bo5`

### `data/战队属性.txt`（可选）

带表头的 CSV,HLTV 评分：

```csv
team,Maps,KD_diff,KD,Rating
Team A,120,+250,1.08,1.09
Team B,95,+180,1.06,1.07
```

只有 `team` 和 `Rating` 这两列有用。想要更准确的初始评分可以去 HLTV.org 抓最新数据。

## 使用方法

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

**注意：** 如果要用 GPU 加速，确保已安装 CUDA。PyTorch 会自动检测并使用 GPU。

**v2.1 新增性能监控依赖**：新增了 `psutil`、`memory-profiler`、`joblib` 等性能优化相关包。

### 2. 配置模拟参数

编辑 `data/config.json` 调整性能：

```json
{
  "simulation_params": {
    "num_simulations": 50000
  },
  "performance_params": {
    "eval_batch_size": 5000,
    "save_every": 1000000
  },
  "device_params": {
    "use_gpu": true,
    "gpu_id": 0
  }
}
```

### 3. 编辑队伍数据

编辑 `cs2_gen_preresult.py` (目前里面的队伍名只是举例，按照实际情况改)：

```python
TEAMS = [
    "FURIA", "Natus Vincere", "Vitality", "FaZe", 
    "Falcons", "B8", "The MongolZ", "Imperial",
    # ... 一共 16 支队伍
]

ROUND1_MATCHUPS = [
    ("FURIA", "Natus Vincere"),
    ("Vitality", "FaZe"),
    # ... 一共 8 场对局
]
```

手动输入 stage X 的参赛队伍以及第一轮谁打谁。一定要注意顺序！ROUND1_MATCHUPS 的顺序决定了 Buchholz 配对的初始种子。

### 4. 运行两步流程

**第一步：生成模拟数据 (优化版)**

```bash
python cs2_gen_preresult.py
```

会生成：
- `output/intermediate_sim_data.pkl` - 高效二进制格式 (推荐)
- `output/intermediate_sim_data.json` - 兼容JSON格式
- 包含 10 万次瑞士轮模拟结果

**新增功能**：
- 自动系统资源检测和性能调优
- 实时内存监控和垃圾回收
- 智能批次大小调整
- 性能统计报告

**可选：运行性能基准测试**

```bash
python benchmark.py
```

用于测试系统性能和优化效果。

**第二步：GPU 加速的 Pick'Em 优化**

```bash
python cs2_gen_final.py
```

## 核心逻辑

### ELO 评分系统

标准 ELO 改进了一些：

- 时间衰减（50 天半衰期）- 老比赛权重更低
- 格式权重：BO1=1.0, BO3=1.2, BO5=1.5  （理论上应该没毛）
- 自适应 K 因子：一开始 K=50 快速调整,30 场后降到 K=30
- HLTV 评分和历史数据混合（历史数据越多,HLTV 权重越低）

胜率公式：`P = 1 / (1 + 10^((rating2-rating1)/400))`

### Buchholz 瑞士轮配对

参照 [Valve 官方规则](https://github.com/ValveSoftware/counter-strike_rules_and_regs/blob/main/major-supplemental-rulebook.md)

### Pick'Em 搜索

暴力枚举所有合法组合：

- 2 支 3-0 队伍
- 6 支 3-1 或 3-2 队伍
- 2 支 0-3 队伍

总共：C(16,6) × C(10,2) × C(8,2) = 10,090,080 种组合

选出在 10 万次模拟里成功率最高（至少命中 5 个）的方案。

**v2.0 GPU 优化：** 使用 PyTorch 张量和矩阵乘法进行批量评估，在 NVIDIA GPU 上实现 24 倍加速。

### 最终输出

**生成的文件：**

- `output/final_prediction.json` - 完整结果，包含最佳 Pick'Em 组合
- `output/optimized_report.txt` - 人类可读的推荐方案
- `output/intermediate_sim_data.json` - 缓存的模拟数据（来自第一步）
- `gpu_checkpoint.json` - 自动保存的进度（可断点续传）

**注意事项：**

- 每支队伍至少需要 10 场历史比赛才能得到可靠的预测
- 如果想从头开始优化，删除 `gpu_checkpoint.json` 即可
- 两步设计允许你修改配置后重跑第二步，无需重新生成模拟数据
- 旧版 v1.0 单文件版本保留为 `cs2_swiss_predictor_old.py`

## v2.1 性能优化详情

### 🚀 主要优化点

1. **向量化计算优化**
   - 使用 NumPy 替代循环，提升数学运算效率
   - 优化 ELO 评分计算的向量化操作
   - 改进胜率计算算法，使用更高效的 `tanh` 函数

2. **内存管理优化**
   - 实现智能垃圾回收机制
   - 批量处理减少内存碎片
   - 使用二进制格式 (pickle) 存储，节省空间和加载时间

3. **算法结构优化**
   - 预计算配对优先级表，避免重复创建
   - 优化配对算法的时间复杂度
   - 使用集合 (Set) 替代列表进行快速查找

4. **系统资源管理**
   - 实时监控 CPU 和内存使用情况
   - 根据可用资源动态调整批次大小
   - 提供性能优化建议

### 📊 性能提升预期

- **内存使用**: 减少 20-40%
- **计算速度**: 提升 30-50%
- **I/O 性能**: 二进制格式提升 3-5 倍加载速度

### 🔧 配置文件

新增 `data/config_performance.json` 用于性能调优：

```json
{
  "performance": {
    "auto_adjust_batch_size": true,
    "memory_check_interval": 1000,
    "enable_gc_optimization": true
  }
}
```

### 📈 性能监控

使用装饰器自动监控关键函数：
- 执行时间统计
- 内存使用跟踪
- 峰值内存监控
- 系统资源使用率

### ⚡ 使用建议

1. **低配置系统** (<4GB RAM)
   - 设置 `num_simulations: 30000`
   - 启用 `enable_gc_optimization`
   - 使用较小的批次大小

2. **高配置系统** (>8GB RAM)
   - 可以设置 `num_simulations: 200000`
   - 考虑启用 GPU 加速
   - 使用更大的批次提升效率

3. **生产环境**
   - 使用二进制格式存储
   - 启用性能监控
   - 定期运行基准测试

---

最后，本项目参考了 [claabs/cs-buchholz-simulator](https://github.com/claabs/cs-buchholz-simulator)
