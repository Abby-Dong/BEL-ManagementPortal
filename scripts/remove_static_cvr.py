#!/usr/bin/env python3
"""
移除 belProfiles.json 中所有靜態的 c2oCvr 字段
讓 C2O 轉換率完全動態計算 (orders / clicks * 100)
"""

import json
import os

def remove_static_cvr():
    """移除所有月度數據中的靜態 c2oCvr 字段"""
    
    # 讀取原始數據
    json_path = 'data/belProfiles.json'
    backup_path = 'data/belProfiles.json.backup'
    
    print(f"🔄 正在處理 {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 創建備份
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ 備份已創建: {backup_path}")
    
    # 統計處理的記錄
    total_records = 0
    total_months = 0
    cvr_fields_removed = 0
    
    # 處理每個 BEL 記錄
    for bel in data['leaderboard']:
        total_records += 1
        
        if 'monthlyData' in bel:
            for year, months in bel['monthlyData'].items():
                for month, month_data in months.items():
                    if isinstance(month_data, dict):
                        total_months += 1
                        
                        # 移除 c2oCvr 字段
                        if 'c2oCvr' in month_data:
                            del month_data['c2oCvr']
                            cvr_fields_removed += 1
                            
                        # 驗證必要字段存在
                        clicks = month_data.get('clicks', 0)
                        orders = month_data.get('orders', 0)
                        
                        # 動態計算 CVR (僅用於驗證，不儲存)
                        if clicks > 0:
                            calculated_cvr = (orders / clicks) * 100
                            print(f"  {bel['name']} {year}/{month}: {orders}/{clicks} = {calculated_cvr:.2f}%")
    
    # 儲存清理後的數據
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n📊 清理完成:")
    print(f"- 處理了 {total_records} 個 BEL 記錄")
    print(f"- 處理了 {total_months} 個月份數據")
    print(f"- 移除了 {cvr_fields_removed} 個靜態 c2oCvr 字段")
    print(f"- 現在 C2O 轉換率將完全動態計算")
    
    return data

def verify_calculation():
    """驗證動態計算邏輯"""
    print("\n🔍 驗證動態計算:")
    
    with open('data/belProfiles.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 測試前3個BEL的計算
    for i, bel in enumerate(data['leaderboard'][:3]):
        print(f"\n{i+1}. {bel['name']} (ID: {bel['id']})")
        
        # 計算2025年的總體數據
        total_clicks = 0
        total_orders = 0
        month_count = 0
        
        if 'monthlyData' in bel and '2025' in bel['monthlyData']:
            months_2025 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
            
            for month in months_2025:
                if month in bel['monthlyData']['2025']:
                    month_data = bel['monthlyData']['2025'][month]
                    if month_data:
                        clicks = month_data.get('clicks', 0)
                        orders = month_data.get('orders', 0)
                        total_clicks += clicks
                        total_orders += orders
                        month_count += 1
                        
                        # 每月 CVR
                        if clicks > 0:
                            monthly_cvr = (orders / clicks) * 100
                            print(f"   {month}: {orders}/{clicks} = {monthly_cvr:.2f}%")
            
            # 總體 CVR
            if total_clicks > 0:
                overall_cvr = (total_orders / total_clicks) * 100
                print(f"   2025 總計: {total_orders}/{total_clicks} = {overall_cvr:.2f}%")

if __name__ == "__main__":
    print("🚀 開始移除靜態 c2oCvr 字段...")
    
    # 改變到項目根目錄
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)
    
    # 執行清理
    remove_static_cvr()
    
    # 驗證計算
    verify_calculation()
    
    print("\n✅ 完成！現在所有 C2O 轉換率都將動態計算。")
