#!/usr/bin/env python3
import json

with open('data/belProfiles.json', 'r') as f:
    data = json.load(f)

print('📊 數據驗證報告：')
print('================')

for user in data['leaderboard'][:3]:  # 只顯示前3個用戶
    print(f"\n{user['name']} ({user['level']}):")
    
    # 檢查2025年9月的數據
    sep_2025 = user['monthlyData']['2025']['September']
    print(f"  2025年9月: 點擊{sep_2025['clicks']}, 訂單{sep_2025['orders']}, 營收${sep_2025['revenue']}, CVR{sep_2025['c2oCvr']}%")
    
    # 檢查2025年8月的數據
    aug_2025 = user['monthlyData']['2025']['August']
    aov = aug_2025['revenue'] / aug_2025['orders'] if aug_2025['orders'] > 0 else 0
    print(f"  2025年8月: 點擊{aug_2025['clicks']}, 訂單{aug_2025['orders']}, 營收${aug_2025['revenue']}, CVR{aug_2025['c2oCvr']}%, AOV${aov:.0f}")

print('\n📈 級別對比 (2025年8月):')
level_stats = {}
for user in data['leaderboard']:
    level = user['level']
    aug_data = user['monthlyData']['2025']['August']
    if level not in level_stats:
        level_stats[level] = []
    level_stats[level].append(aug_data['orders'])

for level in ['Exploder', 'Builder', 'Enabler', 'Leader']:
    if level in level_stats:
        avg_orders = sum(level_stats[level]) / len(level_stats[level])
        print(f'  {level}: 平均 {avg_orders:.1f} 單/月')

print('\n🎯 成長趨勢檢查 (Builder級別示例):')
olivia = next(user for user in data['leaderboard'] if user['name'] == 'Olivia Chen')
print(f"Olivia Chen (Builder) 2025年成長趨勢:")
for i, month in enumerate(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']):
    month_data = olivia['monthlyData']['2025'][month]
    print(f"  {i+1}月: {month_data['orders']}單, ${month_data['revenue']}")
