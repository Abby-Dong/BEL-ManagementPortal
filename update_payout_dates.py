#!/usr/bin/env python3
"""
更新 payouts.json 中的所有日期，將每月5號改為每月12號
"""
import json
import re

def update_payout_dates():
    print("=== 更新 Payout 日期：從每月5號改為每月12號 ===")
    
    # 讀取 payouts.json
    with open('data/payouts.json', 'r', encoding='utf-8') as f:
        payout_data = json.load(f)
    
    total_updated = 0
    
    # 遍歷所有 BEL 的 payout 記錄
    for bel_payout in payout_data['belPayoutHistory']:
        for payout in bel_payout['payoutHistory']:
            old_date = payout['date']
            # 將 -05 改為 -12
            if '-05' in old_date:
                new_date = old_date.replace('-05', '-12')
                payout['date'] = new_date
                total_updated += 1
                
                # 打印前幾個更新示例
                if total_updated <= 5:
                    print(f"  {old_date} → {new_date}")
    
    print(f"\n✅ 總共更新了 {total_updated} 筆 payout 記錄")
    
    # 寫回文件
    with open('data/payouts.json', 'w', encoding='utf-8') as f:
        json.dump(payout_data, f, indent=2, ensure_ascii=False)
    
    print("✅ payouts.json 已成功更新")
    
    # 驗證更新結果
    print("\n=== 驗證更新結果 ===")
    with open('data/payouts.json', 'r', encoding='utf-8') as f:
        content = f.read()
    
    count_05 = content.count('-05"')
    count_12 = content.count('-12"')
    
    print(f"剩餘 -05 日期: {count_05}")
    print(f"新增 -12 日期: {count_12}")
    
    if count_05 == 0:
        print("🎉 所有 payout 日期已成功更新為每月12號！")
    else:
        print("⚠️  仍有部分 -05 日期未更新")

if __name__ == "__main__":
    update_payout_dates()
