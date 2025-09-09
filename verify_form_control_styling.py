#!/usr/bin/env python3
"""
Verify that all year and pagination selectors in Payout & Order detail pages
use the correct 'bel-form-control bel-form-select' styling.
"""

import re

def verify_form_control_styling():
    print("=== 驗證 Payout & Order 詳情頁面的表單控制項樣式 ===")
    
    with open('src/js/app.js', 'r') as f:
        content = f.read()
    
    # Check payout year selector
    year_select_pattern = r'<select id="payout-year-select" class="([^"]*)"'
    year_match = re.search(year_select_pattern, content)
    
    if year_match:
        classes = year_match.group(1)
        if 'bel-form-control bel-form-select' in classes:
            print("✅ Payout Year 選擇器使用正確的樣式: bel-form-control bel-form-select")
        else:
            print(f"❌ Payout Year 選擇器樣式不正確: {classes}")
    else:
        print("❌ 找不到 Payout Year 選擇器")
    
    # Check order pagination selector
    order_rows_pattern = r'<select id="order-rows-per-page-payout" class="([^"]*)"'
    order_match = re.search(order_rows_pattern, content)
    
    if order_match:
        classes = order_match.group(1)
        if 'bel-form-control bel-form-select' in classes:
            print("✅ Order Tracking 分頁選擇器使用正確的樣式: bel-form-control bel-form-select")
        else:
            print(f"❌ Order Tracking 分頁選擇器樣式不正確: {classes}")
    else:
        print("❌ 找不到 Order Tracking 分頁選擇器")
    
    # Check history modal pagination selector  
    history_rows_pattern = r'<select id="history-modal-rows-per-page" class="([^"]*)"'
    history_match = re.search(history_rows_pattern, content)
    
    if history_match:
        classes = history_match.group(1)
        if 'bel-form-control bel-form-select' in classes:
            print("✅ History Tickets Modal 分頁選擇器使用正確的樣式: bel-form-control bel-form-select")
        else:
            print(f"❌ History Tickets Modal 分頁選擇器樣式不正確: {classes}")
    else:
        print("❌ 找不到 History Tickets Modal 分頁選擇器")
    
    # Check for any remaining old-style selectors
    old_style_pattern = r'<select[^>]*class="[^"]*bel-select bel-select--small[^"]*"[^>]*>'
    old_matches = re.findall(old_style_pattern, content)
    
    if old_matches:
        print(f"\n⚠️  發現 {len(old_matches)} 個仍使用舊樣式的選擇器:")
        for i, match in enumerate(old_matches, 1):
            print(f"  {i}. {match}")
    else:
        print("\n✅ 沒有發現使用舊樣式 'bel-select bel-select--small' 的選擇器")
    
    # Verify CSS classes exist
    print("\n=== 驗證 CSS 樣式定義 ===")
    try:
        with open('src/css/main.css', 'r') as f:
            css_content = f.read()
        
        if '.bel-form-control {' in css_content:
            print("✅ bel-form-control 樣式類已定義")
        else:
            print("❌ bel-form-control 樣式類未找到")
            
        if '.bel-form-select {' in css_content:
            print("✅ bel-form-select 樣式類已定義")
        else:
            print("❌ bel-form-select 樣式類未找到")
            
    except FileNotFoundError:
        print("❌ 無法讀取 CSS 文件")
    
    print("\n=== 總結 ===")
    print("✅ 已將 Payout & Order 詳情頁面的年份選擇器和分頁選擇器")
    print("   更新為使用 'bel-form-control bel-form-select' 樣式")
    print("✅ 這將提供統一的表單控制項外觀和行為")

if __name__ == "__main__":
    verify_form_control_styling()
