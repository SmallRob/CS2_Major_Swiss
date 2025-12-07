# 使用NVIDIA CUDA基础镜像，包含PyTorch
FROM pytorch/pytorch:2.0.0-cuda11.7-cudnn8-devel

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖（除了PyTorch，因为基础镜像已经包含了）
RUN pip install --no-cache-dir pandas numpy PyYAML tqdm

# 复制项目文件
COPY *.py ./
COPY data ./data
COPY tools ./tools
COPY test ./test
COPY frontend ./frontend
COPY output ./output

# 创建输出目录
RUN mkdir -p output

# 设置默认命令
CMD ["bash"]