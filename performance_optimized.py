#!/usr/bin/env python3
"""
快速启动脚本 - 运行优化版本的CS2瑞士轮预测
包含基本的错误检查和性能建议
"""

import sys
import os

def main():
    print("=" * 60)
    print("CS2 Major 瑞士轮预测系统 (优化版) 快速启动")
    print("=" * 60)
    
    # 检查Python版本
    if sys.version_info < (3, 8):
        print("❌ 需要Python 3.8或更高版本")
        sys.exit(1)
    
    # 检查必要文件
    required_files = [
        'cs2_gen_preresult.py',
        'performance_utils.py',
        'data/config.json'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 缺少必要文件: {', '.join(missing_files)}")
        sys.exit(1)
    
    # 检查数据文件
    data_files = [
        'data/cs2_cleaned_matches.csv',
        'data/hltv_ratings.csv',
        'data/round1_matches.csv',
        'data/team_scores.csv'
    ]
    
    missing_data = []
    for file in data_files:
        if not os.path.exists(file):
            missing_data.append(file)
    
    if missing_data:
        print(f"⚠️ 缺少数据文件: {', '.join(missing_data)}")
        print("程序可能无法正常运行，请检查数据文件是否存在")
    
    try:
        # 尝试导入核心模块
        from performance_utils import check_system_resources, optimize_memory
        print("✓ 性能工具模块加载成功")
        
        # 检查系统资源
        resources = check_system_resources()
        print(f"✓ 系统资源: {resources['cpu_count']}核心, {resources['available_memory_gb']:.1f}GB可用内存")
        
        # 优化内存
        optimize_memory()
        print("✓ 内存优化完成")
        
        # 给出建议
        if resources['available_memory_gb'] < 4:
            print("💡 建议: 可用内存较少，考虑减少模拟次数")
        elif resources['available_memory_gb'] > 16:
            print("💡 建议: 内存充足，可以增加模拟次数提升精度")
        
        print("\n🚀 启动优化版预测程序...")
        print("-" * 60)
        
        # 导入并运行主程序
        from cs2_gen_preresult import main as optimized_main
        optimized_main()
        
    except ImportError as e:
        print(f"❌ 模块导入失败: {e}")
        print("请确保已安装所有依赖: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 程序运行出错: {e}")
        print("请检查配置文件和数据文件是否正确")
        sys.exit(1)

if __name__ == "__main__":
    main()