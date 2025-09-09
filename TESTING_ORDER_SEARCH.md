# 測試 Order Search Suggestions 功能

## 測試步驟

### 1. 打開主應用
訪問：http://localhost:8000

### 2. 導航到 Payouts & Orders 頁面
- 點擊左側邊欄的 "Payouts & Orders" 連結

### 3. 顯示 Filter Panel
- 在 "Order Tracking" 面板中，點擊 **"Filter"** 按鈕
- Filter Panel 會展開，顯示各種過濾選項

### 4. 測試搜索建議功能
在搜索欄中輸入以下內容來測試不同類型的建議：

#### 測試 Order Number 搜索：
- 輸入: `IMTW` (應該顯示台灣訂單，如 IMTW000234)
- 輸入: `IMUS` (應該顯示美國訂單，如 IMUS000233)
- 輸入: `IMDE` (應該顯示德國訂單，如 IMDE000232)
- 輸入: `000234` (應該顯示特定訂單號)

#### 測試 Referral ID 搜索：
- 輸入: `KTWADVANT` (Maxwell Walker - Taiwan)
- 輸入: `KUSOLVACE` (Olivia Chen - US)
- 輸入: `KDEIMULER` (Liam Müller - Germany)
- 輸入: `KJPTANAKA` (Kenji Tanaka - Japan)

#### 測試 BEL Name 搜索：
- 輸入: `Maxwell` (應該顯示 Maxwell Walker)
- 輸入: `Olivia` (應該顯示 Olivia Chen)
- 輸入: `Liam` (應該顯示 Liam Müller)
- 輸入: `Sophia` (應該顯示 Sophia Dubois)

### 5. 測試鍵盤導航
- 使用 ↑↓ 箭頭鍵選擇建議
- 按 Enter 選擇建議
- 按 Esc 隱藏建議

### 6. 測試點擊選擇
- 點擊任何建議項目來選擇它

## 預期行為

1. **建議顯示**：輸入時應該立即顯示相關建議（最多8個）
2. **高亮匹配**：匹配的文本應該被高亮顯示
3. **多種搜索**：能夠搜索訂單號、推薦ID和BEL名稱
4. **即時過濾**：選擇建議後應該立即過濾訂單列表

## 故障排除

如果功能不工作：

1. **檢查控制台**：打開瀏覽器開發者工具，查看是否有錯誤
2. **檢查 Filter Panel 是否顯示**：確保點擊了 Filter 按鈕
3. **檢查數據加載**：確保 APP_DATA.orders.history 有數據
4. **檢查 CSS**：確保搜索建議的 CSS 樣式正確加載

## 技術細節

搜索建議功能位於：
- **函數**：`setupOrderSearchSuggestions()` in `app.js` (line 2732)
- **調用位置**：`setupOrderFilters()` in `app.js` (line 6128)
- **樣式**：`.search-suggestions` in `main.css` (lines 1057-1134)
