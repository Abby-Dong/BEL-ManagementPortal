#!/usr/bin/env python3
"""
更新BEL檔案為更真實的數據
- 使用2024和2025年
- 2025年只到8月（9月顯示為0）
- 客單價約$800
- Builder/Enabler級別顯示成長趨勢，月單量5單以上
- Leader級別明顯高於Exploder
"""

import json
import random
from datetime import datetime

def calculate_realistic_data():
    # 基礎客單價
    base_aov = 800
    
    # 級別倍數設定（影響點擊數和轉化率）
    level_multipliers = {
        'Exploder': {'clicks_base': 600, 'cvr_range': (1.8, 2.5), 'orders_min': 2},
        'Builder': {'clicks_base': 900, 'cvr_range': (2.2, 3.0), 'orders_min': 5},
        'Enabler': {'clicks_base': 1200, 'cvr_range': (2.5, 3.5), 'orders_min': 8},
        'Leader': {'clicks_base': 1500, 'cvr_range': (3.0, 4.2), 'orders_min': 15}
    }
    
    # 月份成長趨勢（2024年穩定成長，2025年持續成長）
    def get_month_growth_factor(year, month_idx, level):
        if year == '2024':
            # 2024年基礎成長
            base_growth = 1.0 + (month_idx * 0.03)  # 每月3%成長
        else:  # 2025年
            if month_idx >= 8:  # 9月之後為0
                return 0
            # 2025年延續成長趨勢
            base_growth = 1.36 + (month_idx * 0.04)  # 延續2024年末+持續成長
        
        # 級別成長加成
        if level in ['Builder', 'Enabler']:
            base_growth *= 1.1  # 成長型級別額外10%加成
        elif level == 'Leader':
            base_growth *= 1.05  # Leader穩定成長
        
        return base_growth
    
    # 載入現有數據
    with open('data/belProfiles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']
    
    for user in data['leaderboard']:
        level = user['level']
        level_config = level_multipliers[level]
        
        # 初始化monthlyData
        user['monthlyData'] = {'2024': {}, '2025': {}}
        
        for year in ['2024', '2025']:
            for month_idx, month in enumerate(months):
                growth_factor = get_month_growth_factor(year, month_idx, level)
                
                if growth_factor == 0:
                    # 2025年9月後為0
                    user['monthlyData'][year][month] = {
                        'clicks': 0,
                        'orders': 0,
                        'revenue': 0,
                        'c2oCvr': 0
                    }
                else:
                    # 計算基礎點擊數
                    base_clicks = level_config['clicks_base']
                    clicks = int(base_clicks * growth_factor * random.uniform(0.85, 1.15))
                    
                    # 計算轉化率
                    cvr_min, cvr_max = level_config['cvr_range']
                    c2o_cvr = random.uniform(cvr_min, cvr_max)
                    
                    # 計算訂單數（確保最低訂單量）
                    calculated_orders = int(clicks * (c2o_cvr / 100))
                    orders = max(calculated_orders, level_config['orders_min'])
                    
                    # 重新計算實際轉化率
                    actual_c2o_cvr = (orders / clicks) * 100 if clicks > 0 else 0
                    
                    # 計算營收（基於客單價$800 + 隨機變動）
                    aov_variation = random.uniform(0.9, 1.1)
                    revenue = int(orders * base_aov * aov_variation)
                    
                    user['monthlyData'][year][month] = {
                        'clicks': clicks,
                        'orders': orders,
                        'revenue': revenue,
                        'c2oCvr': round(actual_c2o_cvr, 2)
                    }
        
        # 更新主要統計數據為2025年8月的數據
        august_2025 = user['monthlyData']['2025']['August']
        user['clicks'] = august_2025['clicks']
        user['orders'] = august_2025['orders']
        user['revenue'] = august_2025['revenue']
        user['convRate'] = f"{august_2025['c2oCvr']:.2f}%"
        user['aov'] = round(august_2025['revenue'] / august_2025['orders'], 2) if august_2025['orders'] > 0 else 0
    
    # 保存更新的數據
    with open('data/belProfiles.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ belProfiles.json 已更新為更真實的數據！")
    print("\n📊 數據特徵：")
    print("• 使用2024和2025年數據")
    print("• 2025年9月後顯示為0（因為今天是9月8日）")
    print("• 客單價約$800")
    print("• Builder/Enabler顯示明顯成長趨勢")
    print("• Leader級別訂單量明顯高於Exploder")
    print("• 月單量: Exploder(2+), Builder(5+), Enabler(8+), Leader(15+)")
    
    # 顯示統計
    for user in data['leaderboard']:
        level = user['level']
        aug_data = user['monthlyData']['2025']['August']
        print(f"• {user['name']} ({level}): {aug_data['orders']}單/月, CVR: {aug_data['c2oCvr']}%")

if __name__ == "__main__":
    calculate_realistic_data()
