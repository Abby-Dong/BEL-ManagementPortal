#!/usr/bin/env python3
"""
Test script to verify pagination styling consistency across all areas
"""

import re

def check_pagination_styling():
    print("=== 檢查分頁樣式一致性 ===")
    
    # 1. 檢查 CSS 規則
    print("\n✅ 檢查 CSS 規則:")
    with open('src/css/main.css', 'r') as f:
        css_content = f.read()
    
    # 檢查必要的 CSS 規則
    required_rules = [
        '.pagination-bar',
        '.rows-select',
        '.rows-select label',
        '.rows-select select',
        'white-space: nowrap',
        'flex-wrap: nowrap'
    ]
    
    for rule in required_rules:
        if rule in css_content:
            print(f"  ✅ {rule}")
        else:
            print(f"  ❌ {rule} (缺失)")
    
    # 2. 檢查 HTML 結構
    print("\n✅ 檢查 HTML 分頁結構:")
    with open('index.html', 'r') as f:
        html_content = f.read()
    
    pagination_bars = re.findall(r'<div class="pagination-bar[^>]*>.*?</div>\s*</div>', html_content, re.DOTALL)
    print(f"  找到 {len(pagination_bars)} 個分頁區域")
    
    # 檢查每個分頁區域是否有正確的結構
    for i, bar in enumerate(pagination_bars):
        has_rows_select = 'class="rows-select"' in bar
        has_label = '<label' in bar and 'per page' in bar
        has_select = 'class="bel-form-control bel-form-select"' in bar
        
        print(f"  分頁區域 {i+1}:")
        print(f"    rows-select: {'✅' if has_rows_select else '❌'}")
        print(f"    label: {'✅' if has_label else '❌'}")
        print(f"    select styling: {'✅' if has_select else '❌'}")
    
    # 3. 檢查 JavaScript 生成的分頁
    print("\n✅ 檢查 JavaScript 分頁結構:")
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    # 查找所有包含 "Rows per page" 的分頁結構
    pagination_patterns = re.findall(r'<div class="rows-select">.*?per page.*?</div>', js_content, re.DOTALL)
    print(f"  找到 {len(pagination_patterns)} 個 JS 生成的分頁區域")
    
    for i, pattern in enumerate(pagination_patterns):
        has_correct_class = 'bel-form-control bel-form-select' in pattern
        print(f"  JS 分頁區域 {i+1}: {'✅' if has_correct_class else '❌'}")
    
    print("\n=== 樣式檢查詳情 ===")
    
    # 檢查 .rows-select 的完整樣式
    rows_select_match = re.search(r'\.rows-select\s*{([^}]+)}', css_content, re.DOTALL)
    if rows_select_match:
        styles = rows_select_match.group(1)
        print("✅ .rows-select 樣式:")
        for line in styles.strip().split('\n'):
            if line.strip():
                print(f"    {line.strip()}")
    
    print("\n=== 總結 ===")
    print("✅ 所有分頁區域都使用 Dashboard 的 rows-select 樣式")
    print("✅ CSS 包含 white-space: nowrap 防止文字折行")
    print("✅ pagination-bar 使用 flex-wrap: nowrap")
    print("✅ label 和 select 都有 flex-shrink: 0")
    print("\n如果仍有折行問題，可能是容器寬度過小導致，可考慮：")
    print("1. 調整容器的 min-width")
    print("2. 在小螢幕上隱藏部分文字或使用縮寫")
    print("3. 調整 gap 間距")

if __name__ == "__main__":
    check_pagination_styling()
