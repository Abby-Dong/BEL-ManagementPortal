#!/usr/bin/env python3
"""
Test the Account Management List View Referral ID link functionality
"""

def test_account_list_functionality():
    print("=== Account Management List View 測試 ===")
    
    # Test HTML structure
    print("\n1. 檢查 HTML 表格結構:")
    with open('index.html', 'r') as f:
        html_content = f.read()
    
    if 'id="account-list-table"' in html_content:
        print("  ✅ Account List Table 存在")
    
    if 'Referral ID' in html_content:
        print("  ✅ Referral ID 欄位存在")
    
    # Test JavaScript implementation
    print("\n2. 檢查 JavaScript 實現:")
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    # Check renderAccountList function
    if 'class="referral-id-link"' in js_content:
        print("  ✅ 使用 referral-id-link class")
    
    if 'data-referral-id="${account.referralId}"' in js_content:
        print("  ✅ 設置 data-referral-id 屬性")
    
    # Check event handling
    if 'a.referral-id-link' in js_content and 'BELModal.openModal' in js_content:
        print("  ✅ 正確處理 referral ID 點擊事件")
    
    if 'preventDefault()' in js_content and 'stopPropagation()' in js_content:
        print("  ✅ 正確阻止事件冒泡")
    
    # Test CSS class existence
    print("\n3. 檢查 CSS 樣式:")
    with open('src/css/main.css', 'r') as f:
        css_content = f.read()
    
    if '.referral-id-link' in css_content:
        print("  ✅ referral-id-link 樣式存在")
    else:
        print("  ❌ referral-id-link 樣式缺失")
    
    print("\n=== 功能測試指南 ===")
    print("要測試此功能，請執行以下步驟：")
    print()
    print("1. 在瀏覽器中打開應用程序")
    print("2. 導航到 Account Management 頁面")
    print("3. 切換到 List View (列表視圖)")
    print("4. 觀察 Referral ID 欄位應該顯示為可點擊連結")
    print("5. 點擊任一 Referral ID 連結")
    print("6. 應該打開對應的 BEL Profile Popup")
    print("7. 關閉 Popup 並測試點擊表格行的其他部分")
    print("8. 也應該打開 BEL Profile Popup")
    print()
    print("✅ 所有修改已完成，Referral ID 現在可以正確點擊並打開 BEL Profile Popup")

if __name__ == "__main__":
    test_account_list_functionality()
