#!/usr/bin/env python3
"""
測試 Header Region Filter 的功能
"""

import json

def test_region_filtering():
    # Load BEL profiles data
    with open('data/belProfiles.json', 'r') as f:
        data = json.load(f)
    
    leaderboard = data['leaderboard']
    
    print("=== 測試 Region 過濾功能 ===")
    print(f"總用戶數: {len(leaderboard)}")
    print()
    
    # Test different regions
    regions_to_test = ['Taiwan', 'Europe', 'North America', 'Japan', 'Korea', 'China', 'AAU / NZ']
    
    for region in regions_to_test:
        # Apply region filter
        filtered_users = [user for user in leaderboard if user.get('region') == region]
        
        print(f"Region: {region}")
        print(f"  過濾後用戶數: {len(filtered_users)}")
        
        if filtered_users:
            print("  用戶列表:")
            for user in filtered_users:
                # Calculate 2025 year data (mimicking JavaScript logic)
                yearly_clicks = 0
                yearly_orders = 0
                yearly_revenue = 0
                
                if 'monthlyData' in user and '2025' in user['monthlyData']:
                    month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
                    for month in month_names:
                        if month in user['monthlyData']['2025']:
                            month_data = user['monthlyData']['2025'][month]
                            if month_data:
                                yearly_clicks += month_data.get('clicks', 0)
                                yearly_orders += month_data.get('orders', 0)
                                yearly_revenue += month_data.get('revenue', 0)
                
                print(f"    - {user['name']} (ID: {user['id']}, Level: {user['level']})")
                print(f"      2025 數據: Clicks: {yearly_clicks:,}, Orders: {yearly_orders:,}, Revenue: ${yearly_revenue:,.0f}")
        
        print()
    
    # Test 'all' regions (should return all users)
    print("Region: all (應該顯示所有用戶)")
    print(f"  總用戶數: {len(leaderboard)}")
    print()
    
    print("✅ Region 過濾測試完成")

if __name__ == "__main__":
    test_region_filtering()
