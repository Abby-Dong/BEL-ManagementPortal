#!/usr/bin/env python3
"""
驗證 System Announcements 改為使用 Level 分類的更改
"""
import json
import re

def verify_announcements_level_changes():
    print("=== 驗證 System Announcements Level 分類更改 ===")
    
    # 1. 檢查數據文件
    print("\n1. 檢查 announcements.json 數據...")
    with open('data/announcements.json', 'r') as f:
        announcements_data = json.load(f)
    
    valid_levels = {'All', 'Builder', 'Enabler', 'Exploder', 'Leader'}
    announcements = announcements_data['announcements']
    
    print(f"  總公告數: {len(announcements)}")
    
    for ann in announcements:
        category = ann['category']
        status = "✅" if category in valid_levels else "❌"
        print(f"  {status} {ann['title'][:20]}: {category}")
    
    invalid_categories = [ann for ann in announcements if ann['category'] not in valid_levels]
    if len(invalid_categories) == 0:
        print("  ✅ 所有公告的 category 都已更新為有效的 Level")
    else:
        print(f"  ❌ 有 {len(invalid_categories)} 個公告使用無效的 category")
    
    # 2. 檢查 JavaScript 代碼
    print("\n2. 檢查 JavaScript 代碼...")
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    # 檢查表格標題
    if 'data-sortable data-type="string">Level</th>' in js_content:
        print("  ✅ 表格標題已從 'Category' 改為 'Level'")
    else:
        print("  ❌ 表格標題尚未更新")
    
    # 檢查模態框標籤
    if '<label>Level</label>' in js_content:
        print("  ✅ 模態框標籤已改為 'Level'")
    else:
        print("  ❌ 模態框標籤尚未更新")
    
    # 檢查選項
    level_options = ['<option>All</option>', '<option>Builder</option>', '<option>Enabler</option>', 
                    '<option>Exploder</option>', '<option>Leader</option>']
    
    all_options_found = all(option in js_content for option in level_options)
    if all_options_found:
        print("  ✅ 所有 Level 選項都已正確設置")
    else:
        print("  ❌ Level 選項設置不完整")
        for option in level_options:
            if option not in js_content:
                print(f"    缺少: {option}")
    
    # 檢查 getCategoryBadgeClass 函數
    badge_mappings = [
        "case 'All':",
        "return 'admin';",
        "case 'Builder':",
        "return 'builder';",
        "case 'Enabler':",
        "return 'enabler';",
        "case 'Exploder':",
        "return 'exploder';",
        "case 'Leader':",
        "return 'leader';"
    ]
    
    badge_function_updated = all(mapping in js_content for mapping in badge_mappings)
    if badge_function_updated:
        print("  ✅ getCategoryBadgeClass 函數已正確更新")
    else:
        print("  ❌ getCategoryBadgeClass 函數尚未完全更新")
    
    # 檢查 getNotificationTagClass 函數
    notification_function_updated = all(mapping in js_content for mapping in badge_mappings)
    if notification_function_updated:
        print("  ✅ getNotificationTagClass 函數已正確更新")
    else:
        print("  ❌ getNotificationTagClass 函數尚未完全更新")
    
    # 3. 檢查 CSS 樣式
    print("\n3. 檢查 CSS 樣式...")
    with open('src/css/main.css', 'r') as f:
        css_content = f.read()
    
    required_css_classes = [
        '.bel-badge.admin',
        '.bel-badge.builder',
        '.bel-badge.enabler', 
        '.bel-badge.exploder',
        '.bel-badge.leader'
    ]
    
    css_classes_found = all(css_class in css_content for css_class in required_css_classes)
    if css_classes_found:
        print("  ✅ 所有必要的 CSS 樣式類別都存在")
    else:
        print("  ❌ 缺少必要的 CSS 樣式類別")
        for css_class in required_css_classes:
            if css_class not in css_content:
                print(f"    缺少: {css_class}")
    
    # 4. 總結
    print("\n=== 驗證結果總結 ===")
    
    checks = [
        (len(invalid_categories) == 0, "announcements.json 數據更新"),
        ('data-sortable data-type="string">Level</th>' in js_content, "表格標題更新"),
        ('<label>Level</label>' in js_content, "模態框標籤更新"),
        (all_options_found, "Level 選項設置"),
        (badge_function_updated, "getCategoryBadgeClass 函數更新"),
        (notification_function_updated, "getNotificationTagClass 函數更新"),
        (css_classes_found, "CSS 樣式類別")
    ]
    
    passed_checks = sum(1 for check, _ in checks if check)
    total_checks = len(checks)
    
    for check, description in checks:
        status = "✅" if check else "❌"
        print(f"{status} {description}")
    
    print(f"\n🎯 完成度: {passed_checks}/{total_checks} ({passed_checks/total_checks*100:.0f}%)")
    
    if passed_checks == total_checks:
        print("🎉 所有 System Announcements Level 分類更改都已完成！")
        print("📝 現在公告使用 All、Builder、Enabler、Exploder、Leader 五個等級")
        print("🎨 標籤顏色對應使用 bel-badge.admin、bel-badge.builder、bel-badge.enabler、bel-badge.exploder、bel-badge.leader")
    else:
        print("⚠️  仍有部分更改未完成，請檢查上述問題。")

if __name__ == "__main__":
    verify_announcements_level_changes()
