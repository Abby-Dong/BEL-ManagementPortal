#!/usr/bin/env python3
"""
AOV格式化驗證腳本
檢查Dashboard和Account Management中的AOV是否正確顯示到小數點後第二位並包含$符號
"""

import json
import re

def check_aov_formatting():
    """檢查JavaScript代碼中的AOV格式化"""
    
    print("🔍 AOV格式化檢查報告")
    print("=" * 60)
    
    # 讀取app.js文件
    with open('src/js/app.js', 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    # 檢查utils.formatMoney函數實現
    format_money_match = re.search(r'formatMoney: \(amount, decimals = (\d+)\) => {([^}]+)}', js_content)
    if format_money_match:
        default_decimals = format_money_match.group(1)
        function_body = format_money_match.group(2)
        print(f"✅ utils.formatMoney 預設小數位數: {default_decimals}")
        if '$' in function_body:
            print("✅ utils.formatMoney 包含 $ 符號")
        else:
            print("❌ utils.formatMoney 缺少 $ 符號")
    
    print("\n📊 AOV 格式化檢查:")
    
    # 檢查所有AOV相關的formatMoney調用
    aov_format_patterns = [
        # Dashboard AOV
        (r'aovFormatted: utils\.formatMoney\(aov(?:, (\d+))?\)', 'Dashboard - aovFormatted'),
        # Account Management AOV
        (r'utils\.formatMoney\(account\.aov(?:, (\d+))?\)', 'Account Management - 表格 AOV'),
        # BEL Modal AOV  
        (r'aovEl\.textContent = utils\.formatMoney\(aov(?:, (\d+))?\)', 'BEL Modal - AOV'),
        # Dashboard 歷史表格 AOV
        (r'utils\.formatMoney\(aov(?:, (\d+))?\)', 'Dashboard 歷史表格 - AOV'),
    ]
    
    for pattern, description in aov_format_patterns:
        matches = re.findall(pattern, js_content)
        print(f"\n{description}:")
        
        if matches:
            for match in matches:
                decimals = match if match else "0 (預設)"
                if match == "2" or (not match and description == 'BEL Modal - AOV'):
                    print(f"  ✅ 小數位數: {decimals}")
                elif match == "":
                    print(f"  ❌ 小數位數: 0 (預設) - 應該是 2")
                else:
                    print(f"  ⚠️  小數位數: {decimals}")
        else:
            print(f"  ❌ 未找到匹配的格式化調用")
    
    print("\n🧮 測試數據計算:")
    
    # 讀取belProfiles.json進行測試
    try:
        with open('data/belProfiles.json', 'r', encoding='utf-8') as f:
            bel_data = json.load(f)
        
        # 取第一個用戶進行測試
        user = bel_data['leaderboard'][0]
        
        # 計算年度數據
        if 'monthlyData' in user and '2025' in user['monthlyData']:
            year_data = user['monthlyData']['2025']
            total_orders = sum(month.get('orders', 0) for month in year_data.values() if isinstance(month, dict))
            total_revenue = sum(month.get('revenue', 0) for month in year_data.values() if isinstance(month, dict))
            
            if total_orders > 0:
                aov = total_revenue / total_orders
                print(f"測試用戶: {user['name']}")
                print(f"年度訂單數: {total_orders:,}")
                print(f"年度收入: ${total_revenue:,.2f}")
                print(f"計算的AOV: ${aov:.2f}")
                print(f"✅ AOV應顯示為: ${aov:.2f}")
            else:
                print("測試用戶沒有訂單數據")
        else:
            print("測試用戶沒有2025年月度數據")
            
    except FileNotFoundError:
        print("❌ 找不到 belProfiles.json 文件")
    except Exception as e:
        print(f"❌ 讀取數據時出錯: {e}")
    
    print("\n" + "=" * 60)
    print("檢查完成！請檢查瀏覽器中的顯示結果。")

if __name__ == "__main__":
    check_aov_formatting()
