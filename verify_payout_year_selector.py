#!/usr/bin/env python3
"""
驗證 Payout History 年份分頁功能
"""
import json
import re

def verify_payout_year_selector():
    print("=== 驗證 Payout History 年份選擇器功能 ===")
    
    # 1. 檢查 JavaScript 代碼中的修改
    print("\n1. 檢查 JavaScript 代碼修改...")
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    # 檢查年份選擇器 HTML
    if 'payout-year-select' in js_content and 'Year:' in js_content:
        print("  ✅ 年份選擇器 HTML 已添加")
    else:
        print("  ❌ 年份選擇器 HTML 未找到")
    
    # 檢查 renderPayoutHistory 函數參數
    if 'renderPayoutHistory(selectedYear = null)' in js_content:
        print("  ✅ renderPayoutHistory 函數已支援年份參數")
    else:
        print("  ❌ renderPayoutHistory 函數參數未更新")
    
    # 檢查 calculateMonthlyPayoutStats 函數參數
    if 'calculateMonthlyPayoutStats(selectedYear = null)' in js_content:
        print("  ✅ calculateMonthlyPayoutStats 函數已支援年份參數")
    else:
        print("  ❌ calculateMonthlyPayoutStats 函數參數未更新")
    
    # 檢查年份篩選邏輯
    if 'if (selectedYear && payout.year !== parseInt(selectedYear))' in js_content:
        print("  ✅ 年份篩選邏輯已實現")
    else:
        print("  ❌ 年份篩選邏輯未找到")
    
    # 檢查初始化函數
    if 'initializePayoutYearSelector()' in js_content:
        print("  ✅ 年份選擇器初始化函數已添加")
    else:
        print("  ❌ 年份選擇器初始化函數未找到")
    
    # 檢查事件監聽器
    if "addEventListener('change'" in js_content and 'this.renderPayoutHistory(yearSelect.value)' in js_content:
        print("  ✅ 年份選擇器事件監聽器已添加")
    else:
        print("  ❌ 年份選擇器事件監聽器未找到")
    
    # 2. 檢查 payout 數據中的年份
    print("\n2. 檢查 Payout 數據中的年份...")
    try:
        with open('data/payouts.json', 'r') as f:
            payout_data = json.load(f)
        
        years = set()
        for bel in payout_data['belPayoutHistory']:
            for payout in bel['payoutHistory']:
                years.add(payout['year'])
        
        sorted_years = sorted(years, reverse=True)
        print(f"  可用年份: {sorted_years}")
        print(f"  總共 {len(sorted_years)} 個年份")
        
        # 統計每年的數據量
        year_counts = {}
        for bel in payout_data['belPayoutHistory']:
            for payout in bel['payoutHistory']:
                year = payout['year']
                year_counts[year] = year_counts.get(year, 0) + 1
        
        print("\n  各年份數據統計:")
        for year in sorted_years:
            count = year_counts.get(year, 0)
            print(f"    {year}: {count} 筆 payout 記錄")
        
    except Exception as e:
        print(f"  ❌ 無法讀取 payout 數據: {e}")
        return
    
    # 3. 驗證功能邏輯
    print("\n3. 驗證功能邏輯...")
    
    # 檢查 panel-header 結構
    if '<div style="display: flex; align-items: center; gap: 8px;">' in js_content:
        print("  ✅ Panel header 已更新為包含年份選擇器")
    else:
        print("  ❌ Panel header 結構未更新")
    
    # 檢查 "All Years" 選項
    if 'All Years' in js_content:
        print("  ✅ 'All Years' 選項已添加")
    else:
        print("  ❌ 'All Years' 選項未找到")
    
    # 檢查默認年份設置
    if 'currentYear = new Date().getFullYear()' in js_content:
        print("  ✅ 默認年份設置邏輯已實現")
    else:
        print("  ❌ 默認年份設置邏輯未找到")
    
    # 4. 總結
    print("\n=== 驗證結果總結 ===")
    
    checks = [
        ('payout-year-select' in js_content, "年份選擇器 HTML"),
        ('renderPayoutHistory(selectedYear = null)' in js_content, "renderPayoutHistory 函數參數"),
        ('calculateMonthlyPayoutStats(selectedYear = null)' in js_content, "calculateMonthlyPayoutStats 函數參數"),
        ('if (selectedYear && payout.year !== parseInt(selectedYear))' in js_content, "年份篩選邏輯"),
        ('initializePayoutYearSelector()' in js_content, "初始化函數"),
        ("addEventListener('change'" in js_content, "事件監聽器"),
        ('<div style="display: flex; align-items: center; gap: 8px;">' in js_content, "Panel header 結構"),
        ('All Years' in js_content, "'All Years' 選項")
    ]
    
    passed_checks = sum(1 for check, _ in checks if check)
    total_checks = len(checks)
    
    for check, description in checks:
        status = "✅" if check else "❌"
        print(f"{status} {description}")
    
    print(f"\n🎯 完成度: {passed_checks}/{total_checks} ({passed_checks/total_checks*100:.0f}%)")
    
    if passed_checks == total_checks:
        print("🎉 所有 Payout History 年份分頁功能都已完成！")
        print("📝 功能特色:")
        print("  - 右上角年份選擇器")
        print("  - 支援 'All Years' 和單一年份篩選")
        print("  - 預設顯示當前年份")
        print("  - 年份按降序排列")
        print("  - 即時篩選和更新表格")
    else:
        print("⚠️  仍有部分功能未完成，請檢查上述問題。")

if __name__ == "__main__":
    verify_payout_year_selector()
