#!/usr/bin/env python3
"""
驗證 Payout History 表格中 View Detail 連結的更改
"""
import re

def verify_payout_view_detail_changes():
    print("=== 驗證 Payout History View Detail 連結更改 ===")
    
    # 檢查 JavaScript 代碼
    print("\n1. 檢查 app.js 中的 View Detail 連結...")
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    # 檢查是否使用了 referral-id-link 類別
    if 'class="referral-id-link payout-view-btn"' in js_content:
        print("  ✅ View Detail 連結已改為使用 referral-id-link 類別")
    else:
        print("  ❌ View Detail 連結尚未更新為 referral-id-link 類別")
    
    # 檢查是否還有舊的 button 元素
    old_button_pattern = r'<button class="bel-btn-s secondary payout-view-btn"'
    if re.search(old_button_pattern, js_content):
        print("  ⚠️  仍有舊的 button 元素存在")
    else:
        print("  ✅ 舊的 button 元素已移除")
    
    # 檢查新的 anchor 元素
    new_anchor_pattern = r'<a href="#" class="referral-id-link payout-view-btn"'
    if re.search(new_anchor_pattern, js_content):
        print("  ✅ 新的 anchor 元素已正確添加")
    else:
        print("  ❌ 新的 anchor 元素未找到")
    
    # 檢查 data-payout-month 屬性是否保留
    if 'data-payout-month="${monthData.key}"' in js_content:
        print("  ✅ data-payout-month 屬性已保留")
    else:
        print("  ❌ data-payout-month 屬性丟失")
    
    # 檢查圖示和文字是否保留
    if '<i class="fas fa-eye"></i> View Detail' in js_content:
        print("  ✅ 圖示和文字內容已保留")
    else:
        print("  ❌ 圖示或文字內容丟失")
    
    # 檢查是否在正確的函數中
    renderPayoutHistory_match = re.search(
        r'async renderPayoutHistory.*?tableBody\.innerHTML = monthlyStats\.map.*?referral-id-link payout-view-btn',
        js_content,
        re.DOTALL
    )
    
    if renderPayoutHistory_match:
        print("  ✅ 更改在 renderPayoutHistory 函數中正確實施")
    else:
        print("  ❌ 無法確認更改在正確的函數中")
    
    # 總結
    print("\n=== 驗證結果總結 ===")
    
    checks = [
        ('class="referral-id-link payout-view-btn"' in js_content, "使用 referral-id-link 類別"),
        (not re.search(old_button_pattern, js_content), "移除舊 button 元素"),
        (re.search(new_anchor_pattern, js_content), "添加新 anchor 元素"),
        ('data-payout-month="${monthData.key}"' in js_content, "保留 data-payout-month 屬性"),
        ('<i class="fas fa-eye"></i> View Detail' in js_content, "保留圖示和文字"),
        (renderPayoutHistory_match is not None, "在正確函數中實施")
    ]
    
    passed_checks = sum(1 for check, _ in checks if check)
    total_checks = len(checks)
    
    for check, description in checks:
        status = "✅" if check else "❌"
        print(f"{status} {description}")
    
    print(f"\n🎯 完成度: {passed_checks}/{total_checks} ({passed_checks/total_checks*100:.0f}%)")
    
    if passed_checks == total_checks:
        print("🎉 Payout History View Detail 連結已成功更改！")
        print("📝 現在使用 referral-id-link 樣式而非 button")
        print("🎨 保持了所有原有功能和樣式一致性")
    else:
        print("⚠️  仍有部分更改未完成，請檢查上述問題。")

if __name__ == "__main__":
    verify_payout_view_detail_changes()
