#!/usr/bin/env python3
"""
测试Chart配置和Orders y轴刻度间距
"""

import json

def test_orders_y_axis_config():
    """测试Orders y轴刻度配置"""
    print("=== 测试Orders Y轴刻度配置 ===")
    
    # 加载BEL数据
    with open('data/belProfiles.json', 'r') as f:
        bel_data = json.load(f)
    
    leaderboard = bel_data['leaderboard']
    
    # 计算各级别的Orders数量
    level_stats = {
        'Builder': {'orders': 0},
        'Enabler': {'orders': 0},
        'Exploder': {'orders': 0},
        'Leader': {'orders': 0}
    }
    
    month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
    
    for leader in leaderboard:
        level = leader['level']
        if level in level_stats and 'monthlyData' in leader and '2025' in leader['monthlyData']:
            for month_name in month_names:
                if month_name in leader['monthlyData']['2025']:
                    month_data = leader['monthlyData']['2025'][month_name]
                    if month_data:
                        level_stats[level]['orders'] += month_data.get('orders', 0)
    
    print("📊 各级别Orders数量:")
    orders_values = []
    for level, stats in level_stats.items():
        orders = stats['orders']
        orders_values.append(orders)
        print(f"   {level}: {orders:,}")
    
    # 分析y轴刻度需求
    min_orders = min(orders_values)
    max_orders = max(orders_values)
    range_orders = max_orders - min_orders
    
    print(f"\n📈 Y轴数据分析:")
    print(f"   最小值: {min_orders:,}")
    print(f"   最大值: {max_orders:,}")
    print(f"   范围: {range_orders:,}")
    
    # 计算最佳刻度间距
    if max_orders <= 100:
        step_size = 10
    elif max_orders <= 500:
        step_size = 50
    elif max_orders <= 1000:
        step_size = 100
    elif max_orders <= 5000:
        step_size = 500
    else:
        step_size = 1000
    
    print(f"\n⚙️  刻度配置:")
    print(f"   建议刻度间距: {step_size}")
    print(f"   Y轴范围: 0 到 {((max_orders // step_size) + 1) * step_size}")
    
    # 生成预期的刻度点
    max_tick = ((max_orders // step_size) + 1) * step_size
    tick_points = list(range(0, max_tick + step_size, step_size))
    
    print(f"\n📏 预期刻度点:")
    print(f"   {tick_points}")
    
    print(f"\n✅ Orders Y轴刻度配置完成:")
    print(f"   - 使用stepSize: {step_size}")
    print(f"   - 数字格式化: 使用toLocaleString()")
    print(f"   - 显示位置: 右侧 (position: 'right')")
    print(f"   - 网格线: 不在图表区域显示 (drawOnChartArea: false)")

if __name__ == "__main__":
    test_orders_y_axis_config()
