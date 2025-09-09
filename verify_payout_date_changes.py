#!/usr/bin/env python3
"""
驗證 Payout 日期更改：確保所有相關文件都已更新為每月12號
"""
import json
import re

def verify_payout_date_changes():
    print("=== 驗證 Payout 日期更改（每月12號）===")
    
    # 1. 驗證 payouts.json 中的所有日期
    print("\n1. 檢查 payouts.json 中的日期...")
    with open('data/payouts.json', 'r') as f:
        payout_data = json.load(f)
    
    all_dates = []
    for bel_payout in payout_data['belPayoutHistory']:
        for payout in bel_payout['payoutHistory']:
            all_dates.append(payout['date'])
    
    # 檢查是否所有日期都是12號
    dates_12th = [date for date in all_dates if '-12' in date]
    dates_other = [date for date in all_dates if '-12' not in date]
    
    print(f"  總日期數: {len(all_dates)}")
    print(f"  12號日期: {len(dates_12th)}")
    print(f"  其他日期: {len(dates_other)}")
    
    if len(dates_other) == 0:
        print("  ✅ 所有 payout 日期都已更新為每月12號")
    else:
        print(f"  ❌ 仍有 {len(dates_other)} 個非12號日期:")
        for date in dates_other[:5]:  # 顯示前5個
            print(f"    {date}")
    
    # 2. 驗證 app.js 中的顯示文字
    print("\n2. 檢查 app.js 中的顯示文字...")
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    if 'Monthly payout on 12th' in js_content:
        print("  ✅ app.js 中的顯示文字已更新為 '12th'")
    else:
        print("  ❌ app.js 中的顯示文字尚未更新")
    
    if 'Monthly payout on 5th' in js_content:
        print("  ⚠️  app.js 中仍有 '5th' 的舊文字")
    
    # 3. 驗證 README.md 中的說明
    print("\n3. 檢查 README.md 中的說明...")
    with open('README.md', 'r') as f:
        readme_content = f.read()
    
    if 'Payout Day: 12th of each month' in readme_content:
        print("  ✅ README.md 中的說明已更新為 '12th of each month'")
    else:
        print("  ❌ README.md 中的說明尚未更新")
    
    if 'Payout Day: 5th of each month' in readme_content:
        print("  ⚠️  README.md 中仍有 '5th of each month' 的舊文字")
    
    # 4. 抽樣檢查實際日期格式
    print("\n4. 抽樣檢查日期格式...")
    sample_dates = all_dates[:10]
    print("  前10個日期樣本:")
    for i, date in enumerate(sample_dates, 1):
        print(f"    {i:2d}. {date}")
    
    # 5. 統計各年度的日期分布
    print("\n5. 各年度日期統計...")
    year_stats = {}
    for date in all_dates:
        year = date[:4]
        if year not in year_stats:
            year_stats[year] = 0
        year_stats[year] += 1
    
    for year in sorted(year_stats.keys()):
        print(f"  {year}: {year_stats[year]} 筆記錄")
    
    print("\n=== 驗證結果總結 ===")
    
    success_count = 0
    total_checks = 3
    
    if len(dates_other) == 0:
        success_count += 1
        print("✅ payouts.json 日期更新完成")
    else:
        print("❌ payouts.json 日期更新未完成")
    
    if 'Monthly payout on 12th' in js_content and 'Monthly payout on 5th' not in js_content:
        success_count += 1
        print("✅ app.js 顯示文字更新完成")
    else:
        print("❌ app.js 顯示文字更新未完成")
    
    if 'Payout Day: 12th of each month' in readme_content and 'Payout Day: 5th of each month' not in readme_content:
        success_count += 1
        print("✅ README.md 說明更新完成")
    else:
        print("❌ README.md 說明更新未完成")
    
    print(f"\n🎯 完成度: {success_count}/{total_checks} ({success_count/total_checks*100:.0f}%)")
    
    if success_count == total_checks:
        print("🎉 所有 Payout 日期相關更改都已完成！現在 Payout 記錄改為每月12號。")
    else:
        print("⚠️  仍有部分更改未完成，請檢查上述問題。")

if __name__ == "__main__":
    verify_payout_date_changes()
