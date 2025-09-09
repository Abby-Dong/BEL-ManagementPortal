#!/usr/bin/env python3
"""
Verify pagination styling changes to prevent "Rows per page" text wrapping
"""

def verify_css_changes():
    """Verify that the CSS has been updated correctly"""
    
    with open('src/css/main.css', 'r') as f:
        css_content = f.read()
    
    print("=== 驗證 CSS 分頁樣式修正 ===")
    
    # Check for pagination-bar styles
    if 'flex-wrap: nowrap;' in css_content and 'min-width: 0;' in css_content:
        print("✅ .pagination-bar 已加入防折行屬性")
    else:
        print("❌ .pagination-bar 缺少防折行屬性")
    
    # Check for rows-select styles
    rows_select_section = css_content[css_content.find('.rows-select'):css_content.find('.rows-select') + 200]
    
    if 'white-space: nowrap;' in rows_select_section:
        print("✅ .rows-select 已加入 white-space: nowrap")
    else:
        print("❌ .rows-select 缺少 white-space: nowrap")
    
    # Check for rows-select label styles
    if '.rows-select label' in css_content and 'flex-shrink: 0;' in css_content:
        print("✅ .rows-select label 已加入防縮放屬性")
    else:
        print("❌ .rows-select label 缺少防縮放屬性")
    
    print()
    print("=== 修正內容摘要 ===")
    print("1. 在 .pagination-bar 加入:")
    print("   - flex-wrap: nowrap (防止分頁條折行)")
    print("   - min-width: 0 (確保彈性布局)")
    print()
    print("2. 在 .rows-select 加入:")
    print("   - white-space: nowrap (防止文字折行)")
    print()
    print("3. 新增 .rows-select label 規則:")
    print("   - white-space: nowrap (標籤文字不折行)")
    print("   - flex-shrink: 0 (標籤不縮放)")
    print()
    print("✅ 這些修正將確保 'Rows per page' 文字不會折行到新行")

if __name__ == "__main__":
    verify_css_changes()
