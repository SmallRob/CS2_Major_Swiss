#!/usr/bin/env python3
"""
优化功能测试脚本
用于验证所有优化功能是否正常工作
"""

import sys
import os

def test_imports():
    """测试所有导入是否正常"""
    print("=== 测试模块导入 ===")
    
    try:
        import numpy as np
        print("✓ NumPy 导入成功")
    except ImportError as e:
        print(f"✗ NumPy 导入失败: {e}")
        return False
    
    try:
        import pandas as pd
        print("✓ Pandas 导入成功")
    except ImportError as e:
        print(f"✗ Pandas 导入失败: {e}")
        return False
    
    try:
        from performance_utils import (
            PerformanceMonitor, performance_monitor, 
            optimize_memory, check_system_resources
        )
        print("✓ 性能工具导入成功")
    except ImportError as e:
        print(f"✗ 性能工具导入失败: {e}")
        return False
    
    return True

def test_performance_utils():
    """测试性能工具功能"""
    print("\n=== 测试性能工具 ===")
    
    try:
        from performance_utils import check_system_resources, optimize_memory
        
        # 测试系统资源检查
        resources = check_system_resources()
        print(f"✓ 系统资源检查: {resources['cpu_count']}核心, {resources['available_memory_gb']:.1f}GB可用")
        
        # 测试内存优化
        optimize_memory()
        print("✓ 内存优化完成")
        
        return True
    except Exception as e:
        print(f"✗ 性能工具测试失败: {e}")
        return False

def test_basic_functionality():
    """测试基础功能"""
    print("\n=== 测试基础功能 ===")
    
    try:
        # 测试配置加载
        from cs2_gen_preresult import load_external_config, set_default_config
        
        # 先设置默认配置
        set_default_config()
        print("✓ 默认配置设置成功")
        
        # 测试配置加载
        success = load_external_config()
        print(f"✓ 配置加载: {'成功' if success else '使用默认配置'}")
        
        return True
    except Exception as e:
        print(f"✗ 基础功能测试失败: {e}")
        return False

def test_optimized_functions():
    """测试优化后的函数"""
    print("\n=== 测试优化函数 ===")
    
    try:
        from cs2_gen_preresult import (
            calculate_winrate_optimized, 
            predict_match,
            TEAMS, TEAM_SCORES, SCORING_PARAMS
        )
        
        # 测试胜率计算
        winrate = calculate_winrate_optimized(1500, 1400)
        print(f"✓ 优化胜率计算: {winrate:.2f}%")
        
        # 确保有队伍数据
        if TEAMS and TEAM_SCORES:
            team1, team2 = TEAMS[0], TEAMS[1] if len(TEAMS) > 1 else TEAMS[0]
            if team1 != team2:
                test_ratings = {team: 1000 for team in TEAMS}
                prob1, prob2 = predict_match(team1, team2, test_ratings)
                print(f"✓ 比赛预测: {team1} {prob1:.2%} vs {team2} {prob2:.2%}")
        
        return True
    except Exception as e:
        print(f"✗ 优化函数测试失败: {e}")
        return False

def run_all_tests():
    """运行所有测试"""
    print("=" * 60)
    print("CS2 Major 瑞士轮预测系统 - 优化功能测试")
    print("=" * 60)
    
    tests = [
        ("模块导入", test_imports),
        ("性能工具", test_performance_utils), 
        ("基础功能", test_basic_functionality),
        ("优化函数", test_optimized_functions)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        if test_func():
            passed += 1
        else:
            print(f"\n❌ {test_name}测试失败，请检查相关配置")
    
    print(f"\n=== 测试结果 ===")
    print(f"通过: {passed}/{total}")
    
    if passed == total:
        print("🎉 所有测试通过！优化功能正常工作。")
        print("\n建议运行以下命令开始使用:")
        print("python cs2_gen_preresult.py")
        print("python benchmark.py  # 可选：性能基准测试")
    else:
        print("⚠️ 部分测试失败，请检查环境配置。")
        print("\n请确保已安装所有依赖:")
        print("pip install -r requirements.txt")
        print("pip install psutil memory-profiler joblib")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)