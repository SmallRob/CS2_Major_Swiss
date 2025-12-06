"""
性能监控和优化工具模块
用于监控内存使用、执行时间和提供性能优化建议
"""

import time
import os
import gc
from functools import wraps
from typing import Dict, Any, Callable
import traceback

# 尝试导入可选依赖
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False
    print("[警告] psutil未安装，性能监控功能将受限")


class PerformanceMonitor:
    """性能监控器"""
    
    def __init__(self):
        self.start_time = None
        self.start_memory = None
        self.peak_memory = 0
        
    def start_monitoring(self):
        """开始监控"""
        self.start_time = time.time()
        if PSUTIL_AVAILABLE:
            self.start_memory = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024  # MB
        else:
            self.start_memory = 0
        self.peak_memory = self.start_memory
        
    def update_peak_memory(self):
        """更新峰值内存"""
        if PSUTIL_AVAILABLE:
            current_memory = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024
            self.peak_memory = max(self.peak_memory, current_memory)
        
    def get_stats(self) -> Dict[str, Any]:
        """获取性能统计"""
        if PSUTIL_AVAILABLE:
            current_memory = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024
            memory_usage_percent = psutil.virtual_memory().percent
        else:
            current_memory = 0
            memory_usage_percent = 0
            
        elapsed_time = time.time() - self.start_time if self.start_time else 0
        
        return {
            'elapsed_time': elapsed_time,
            'start_memory_mb': self.start_memory,
            'current_memory_mb': current_memory,
            'peak_memory_mb': self.peak_memory,
            'memory_increase_mb': current_memory - self.start_memory,
            'memory_usage_percent': memory_usage_percent
        }
        
    def print_stats(self, operation_name: str = "操作"):
        """打印性能统计"""
        stats = self.get_stats()
        print(f"\n[{operation_name} 性能统计]")
        print(f"执行时间: {stats['elapsed_time']:.2f}秒")
        print(f"内存使用: {stats['start_memory_mb']:.1f}MB → {stats['current_memory_mb']:.1f}MB "
              f"(峰值: {stats['peak_memory_mb']:.1f}MB)")
        print(f"内存增长: {stats['memory_increase_mb']:+.1f}MB")
        print(f"系统内存使用率: {stats['memory_usage_percent']:.1f}%")


def performance_monitor(func: Callable) -> Callable:
    """性能监控装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        monitor = PerformanceMonitor()
        monitor.start_monitoring()
        
        try:
            result = func(*args, **kwargs)
            monitor.update_peak_memory()
            monitor.print_stats(func.__name__)
            return result
        except Exception as e:
            monitor.update_peak_memory()
            monitor.print_stats(f"{func.__name__} (失败)")
            print(f"错误详情: {str(e)}")
            raise
            
    return wrapper


def optimize_memory():
    """内存优化 - 强制垃圾回收"""
    gc.collect()
    # 多次垃圾回收确保清理干净
    for _ in range(3):
        gc.collect()


def memory_efficient_batch_processing(items: list, batch_size: int = 1000, 
                                     process_func: Callable = None) -> list:
    """
    内存高效的批处理函数
    
    Args:
        items: 要处理的项目列表
        batch_size: 批次大小
        process_func: 处理函数
    
    Returns:
        处理结果列表
    """
    results = []
    total_items = len(items)
    
    for i in range(0, total_items, batch_size):
        batch = items[i:i + batch_size]
        
        if process_func:
            batch_results = process_func(batch)
            results.extend(batch_results)
        else:
            results.extend(batch)
        
        # 每处理一批后优化内存
        if i % (batch_size * 10) == 0:
            optimize_memory()
            
        # 进度提示
        if (i + batch_size) % 10000 == 0 or i + batch_size >= total_items:
            processed = min(i + batch_size, total_items)
            print(f"批处理进度: {processed}/{total_items} ({processed/total_items*100:.1f}%)")
    
    return results


def check_system_resources() -> Dict[str, Any]:
    """检查系统资源状况"""
    if PSUTIL_AVAILABLE:
        memory = psutil.virtual_memory()
        cpu_count = psutil.cpu_count()
        cpu_percent = psutil.cpu_percent(interval=0.1)
        
        return {
            'total_memory_gb': memory.total / 1024 / 1024 / 1024,
            'available_memory_gb': memory.available / 1024 / 1024 / 1024,
            'memory_usage_percent': memory.percent,
            'cpu_count': cpu_count,
            'cpu_usage_percent': cpu_percent,
            'recommended_batch_size': min(10000, max(1000, int(memory.available / 1024 / 1024 / 100)))
        }
    else:
        # 降级版本 - 无法获取详细信息
        import multiprocessing
        return {
            'total_memory_gb': 8.0,  # 假设8GB
            'available_memory_gb': 4.0,  # 假设4GB可用
            'memory_usage_percent': 50.0,  # 假设50%
            'cpu_count': multiprocessing.cpu_count(),
            'cpu_usage_percent': 25.0,  # 假设25%
            'recommended_batch_size': 2000  # 默认批次大小
        }


def suggest_optimizations(resource_info: Dict[str, Any]) -> list:
    """根据系统资源状况建议优化策略"""
    suggestions = []
    
    if resource_info['memory_usage_percent'] > 80:
        suggestions.append("内存使用率较高，建议减少批次大小")
        suggestions.append("考虑使用更紧凑的数据结构")
    
    if resource_info['available_memory_gb'] < 2:
        suggestions.append("可用内存不足2GB，建议使用较小的模拟次数")
        suggestions.append("启用更频繁的垃圾回收")
    
    if resource_info['cpu_usage_percent'] > 90:
        suggestions.append("CPU使用率很高，考虑减少并行度")
    
    if resource_info['cpu_count'] >= 8:
        suggestions.append("CPU核心充足，可考虑增加并行处理")
    
    return suggestions


if __name__ == "__main__":
    # 测试性能监控
    print("=== 性能监控工具测试 ===")
    
    # 检查系统资源
    resources = check_system_resources()
    print(f"系统资源状况: {resources}")
    
    # 获取优化建议
    suggestions = suggest_optimizations(resources)
    if suggestions:
        print("优化建议:")
        for i, suggestion in enumerate(suggestions, 1):
            print(f"  {i}. {suggestion}")
    else:
        print("系统资源状况良好，无需特别优化")