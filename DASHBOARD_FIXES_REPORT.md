# Dashboard & Account Management 資料修正報告

## 修正日期: 2025年9月8日

## 修正內容

### 1. 資料計算基準調整
**問題**: Top 10 BEL Performance Leaderboard 表格和 Account Management 卡片使用的是單月資料，與 BEL profile popup modal 不一致。

**解決方案**: 
- 在 `AccountManagement.generateBelData()` 中新增 `calculateYearlyData()` 函數
- 計算 2025 年 1-8 月的累積資料 (因為目前是 9 月 8 日)
- 所有表格現在顯示年度累積資料 (YTD - Year To Date)

**修改檔案**: `src/js/app.js`
- 新增 `AccountManagement.calculateYearlyData()` 函數
- 修改 `AccountManagement.generateBelData()` 使用年度累積資料
- 新增 `Dashboard.calculatePerformanceByLevel()` 函數
- 修改 `Dashboard.renderPerformanceTable()` 使用動態計算

### 2. Dashboard 排序功能修復
**問題**: Dashboard performance table 的 C2O CVR (%) 和 AOV 欄位無法正確排序。

**解決方案**:
- 修改 `Dashboard.calculatePerformanceByLevel()` 返回原始數值和格式化版本
- 在 HTML 中使用 `data-sort-value` 屬性存放原始數值
- 更新 `TableUtils.makeTableSortable()` 支援 `data-sort-value` 屬性排序

**修改檔案**: `src/js/app.js`
- 更新 `Dashboard.calculatePerformanceByLevel()` 
- 更新 `Dashboard.renderPerformanceTable()`
- 更新 `TableUtils.makeTableSortable()`

### 3. 百分比格式統一
**問題**: Dashboard 和 Account Management 的 C2O CVR (%) 只顯示 1 位小數。

**解決方案**:
- 修改 `utils.formatPercent()` 從 `toFixed(1)` 改為 `toFixed(2)`
- 修改 Dashboard performance table 的 C2O CVR 計算從 `toFixed(1)` 改為 `toFixed(2)`

**修改檔案**: `src/js/app.js`

## 驗證結果

### 測試案例 1: 資料一致性
- **Maxwell Walker (KTWADVANT)**
  - 原始單月資料: 714 clicks
  - 2025 YTD 累積: 5,559 clicks
  - C2O CVR: 2.91% (2位小數)

### 測試案例 2: Dashboard Performance Table
- **Builder Level**: 14,430 clicks, C2O CVR 1.98%
- **Enabler Level**: 12,529 clicks, C2O CVR 2.39%  
- **Exploder Level**: 16,766 clicks, C2O CVR 2.86%
- **Leader Level**: 7,129 clicks, C2O CVR 3.66%

### 測試案例 3: 排序功能
- ✅ C2O CVR (%) 欄位可正確排序 (使用 data-sort-value)
- ✅ AOV 欄位可正確排序 (使用 data-sort-value)
- ✅ 其他數值欄位維持正常排序功能

## 技術實作細節

### 年度累積資料計算邏輯
```javascript
// 計算 2025 年 1-8 月累積資料
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
monthNames.forEach(monthName => {
    const monthData = record.monthlyData[year][monthName];
    if (monthData) {
        cumulativeClicks += monthData.clicks || 0;
        cumulativeOrders += monthData.orders || 0;
        cumulativeRevenue += monthData.revenue || 0;
    }
});
```

### 排序功能改進
```javascript
// 支援 data-sort-value 屬性
let valA = cellA.getAttribute('data-sort-value') || cellA.textContent.trim();
let valB = cellB.getAttribute('data-sort-value') || cellB.textContent.trim();

// HTML 使用方式
<td data-sort-value="${detail.convRate}">${detail.convRateFormatted}</td>
```

### 百分比格式統一
```javascript
// 統一使用 2 位小數
formatPercent: (decimal) => `${(decimal * 100).toFixed(2)}%`
convRateFormatted: `${convRate.toFixed(2)}%`
```

## 影響範圍

1. **Dashboard 頁面**
   - Performance table 顯示年度累積資料
   - C2O CVR 和 AOV 欄位可正確排序
   - C2O CVR 顯示 2 位小數

2. **Account Management 頁面**
   - 表格顯示年度累積資料  
   - 卡片顯示年度累積資料
   - C2O CVR 顯示 2 位小數

3. **BEL Profile Modal**
   - 保持原有年度累積邏輯不變
   - 與其他頁面資料現在一致

## 向後相容性

- ✅ 保持所有現有功能正常運作
- ✅ 不影響其他頁面和功能
- ✅ 資料格式向下相容 (支援無 monthlyData 的 fallback)
