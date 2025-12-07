#!/usr/bin/env python3
"""
性能基准测试脚本
用于比较优化前后的性能差异
"""

import time
import os
import sys
import json
import numpy as np

# 添加上级目录到sys.path，以便能够导入上级目录的模块
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from performance_utils import PerformanceMonitor, check_system_resources
from cs2_gen_preresult import (
    load_external_config, TEAMS, simulate_full_swiss,
    calculate_winrate
)

def benchmark_winrate_calculations():
    """测试胜率计算性能"""
    print("\n=== 胜率计算性能测试 ===")
    
    # 生成测试数据
    test_cases = [(np.random.randint(1000, 3000), np.random.randint(1000, 3000)) 
                  for _ in range(10000)]
    
    # 测试优化版
    monitor = PerformanceMonitor()
    monitor.start_monitoring()
    
    for score_a, score_b in test_cases:
        calculate_winrate(score_a, score_b)
    
    optimized_time = time.time() - monitor.start_time
    print(f"优化版胜率计算: {optimized_time:.4f}秒")
    print(f"平均每次计算: {(optimized_time/len(test_cases)*1000):.4f}毫秒")

def benchmark_simulation():
    """测试模拟性能"""
    print("\n=== 模拟性能测试 ===")
    
    # 加载配置
    load_external_config()
    
    # 模拟评分
    test_ratings = {team: 1000 + np.random.randint(-200, 200) for team in TEAMS}
    
    # 测试少量模拟
    num_simulations = 1000
    
    monitor = PerformanceMonitor()
    monitor.start_monitoring()
    
    for _ in range(num_simulations):
        simulate_full_swiss(test_ratings, 1)  # 每次只模拟一次
    
    elapsed_time = time.time() - monitor.start_time
    sims_per_second = num_simulations / elapsed_time
    
    print(f"模拟性能: {elapsed_time:.2f}秒完成{num_simulations}次模拟")
    print(f"模拟速度: {sims_per_second:.0f}次/秒")
    
    # 预估完整运行时间
    target_sims = 100000
    estimated_time = target_sims / sims_per_second / 60  # 分钟
    print(f"预估{target_sims:,}次模拟需要: {estimated_time:.1f}分钟")

def memory_usage_test():
    """内存使用测试"""
    print("\n=== 内存使用测试 ===")
    
    resources = check_system_resources()
    print(f"当前可用内存: {resources['available_memory_gb']:.2f}GB")
    
    # 模拟数据结构内存占用
    import sys
    
    # 测试队伍字典大小
    test_dict = {team: [0, 0, 0] for team in TEAMS}
    dict_size = sys.getsizeof(test_dict)
    print(f"基础数据结构大小: {dict_size / 1024:.2f}KB")
    
    # 测试模拟结果内存占用
    from collections import defaultdict
    team_results = defaultdict(lambda: {'3-0': 0, 'qualified': 0, '0-3': 0, 'total': 0})
    results_size = sys.getsizeof(team_results)
    print(f"结果统计结构大小: {results_size / 1024:.2f}KB")

def run_full_benchmark():
    """运行完整基准测试"""
    print("=" * 60)
    print("CS2 Major 瑞士轮预测系统 - 性能基准测试")
    print("=" * 60)
    
    # 系统信息
    resources = check_system_resources()
    print(f"系统配置: {resources['cpu_count']}核心, {resources['total_memory_gb']:.1f}GB内存")
    print(f"当前内存使用: {resources['memory_usage_percent']:.1f}%")
    
    try:
        benchmark_winrate_calculations()
        benchmark_simulation()
        memory_usage_test()
        
        print("\n=== 测试完成 ===")
        print("优化建议:")
        print("1. 如果性能提升不明显，考虑启用GPU加速")
        print("2. 对于大数据集，建议使用更少的模拟次数")
        print("3. 考虑使用分布式处理进行大规模模拟")
        
    except Exception as e:
        print(f"\n测试过程中出现错误: {e}")
        print("请确保所有依赖模块都已正确安装")

if __name__ == "__main__":
    run_full_benchmark()