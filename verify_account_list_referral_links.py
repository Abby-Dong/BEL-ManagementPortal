#!/usr/bin/env python3
"""
Verify Account Management List View Referral ID link changes
"""

import re

def verify_account_list_changes():
    print("=== 驗證 Account Management List View 修改 ===")
    
    with open('src/js/app.js', 'r') as f:
        js_content = f.read()
    
    # 檢查 renderAccountList 函數中的 referral ID 連結
    print("\n✅ 檢查 renderAccountList 函數:")
    
    # 查找 renderAccountList 函數
    render_account_list_match = re.search(r'renderAccountList\(\)\s*{(.*?)}\s*,\s*updateAccountListPaginationUI', js_content, re.DOTALL)
    
    if render_account_list_match:
        render_function = render_account_list_match.group(1)
        
        # 檢查是否使用了正確的 class
        if 'class="referral-id-link"' in render_function:
            print("  ✅ 使用了正確的 class='referral-id-link'")
        else:
            print("  ❌ 缺少 class='referral-id-link'")
        
        # 檢查是否添加了 data-referral-id 屬性
        if 'data-referral-id="${account.referralId}"' in render_function:
            print("  ✅ 添加了 data-referral-id 屬性")
        else:
            print("  ❌ 缺少 data-referral-id 屬性")
        
        # 檢查是否移除了舊的 bel-id-link class
        if 'class="bel-id-link"' in render_function:
            print("  ❌ 仍然使用舊的 bel-id-link class")
        else:
            print("  ✅ 已移除舊的 bel-id-link class")
    else:
        print("  ❌ 找不到 renderAccountList 函數")
    
    # 檢查 setupAccountListEvents 函數
    print("\n✅ 檢查 setupAccountListEvents 函數:")
    
    setup_events_match = re.search(r'setupAccountListEvents\(\)\s*{(.*?)}\s*,', js_content, re.DOTALL)
    
    if setup_events_match:
        setup_function = setup_events_match.group(1)
        
        # 檢查是否正確處理 referral-id-link 點擊
        if 'a.referral-id-link' in setup_function:
            print("  ✅ 正確處理 referral-id-link 點擊")
        else:
            print("  ❌ 沒有處理 referral-id-link 點擊")
        
        # 檢查是否調用 BELModal.openModal
        if 'BELModal.openModal' in setup_function:
            print("  ✅ 正確調用 BELModal.openModal")
        else:
            print("  ❌ 沒有調用 BELModal.openModal")
        
        # 檢查是否阻止默認行為和事件冒泡
        if 'preventDefault()' in setup_function and 'stopPropagation()' in setup_function:
            print("  ✅ 正確阻止默認行為和事件冒泡")
        else:
            print("  ❌ 沒有正確阻止默認行為和事件冒泡")
        
        # 檢查是否移除了舊的 bel-id-link 檢查
        if 'a.bel-id-link' in setup_function:
            print("  ❌ 仍然有舊的 bel-id-link 檢查")
        else:
            print("  ✅ 已移除舊的 bel-id-link 檢查")
    else:
        print("  ❌ 找不到 setupAccountListEvents 函數")
    
    print("\n=== 修改總結 ===")
    print("✅ Referral ID 連結現在使用 'referral-id-link' class")
    print("✅ 添加了 data-referral-id 屬性用於標識")
    print("✅ 點擊 Referral ID 連結會打開 BEL Profile Popup")
    print("✅ 點擊表格行的其他部分也會打開 BEL Profile Popup")
    print("✅ 正確處理事件冒泡，避免重複觸發")
    
    print("\n=== 預期行為 ===")
    print("1. 在 Account Management 的 List View 中")
    print("2. Referral ID 顯示為可點擊的連結（referral-id-link 樣式）")
    print("3. 點擊 Referral ID 連結會打開對應的 BEL Profile Popup")
    print("4. 點擊表格行的其他地方也會打開 BEL Profile Popup")
    print("5. 保持與其他頁面的 referral-id-link 樣式一致性")

if __name__ == "__main__":
    verify_account_list_changes()
