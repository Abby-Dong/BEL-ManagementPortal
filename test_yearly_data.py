#!/usr/bin/env python3
"""
Test script to verify yearly cumulative data calculation
"""
import json

def load_bel_data():
    with open('data/belProfiles.json', 'r') as f:
        return json.load(f)

def calculate_yearly_data(record, year='2025'):
    """
    Calculate cumulative yearly data from monthly data
    This mimics the JavaScript function in app.js
    """
    cumulative_clicks = 0
    cumulative_orders = 0
    cumulative_revenue = 0
    
    if 'monthlyData' in record and year in record['monthlyData']:
        month_names = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
        
        # For 2025, only sum up to August (since it's September 8, 2025)
        # For other years, sum the full year
        months_to_sum = month_names
        if year == '2025':
            months_to_sum = month_names[:8]  # January to August
        
        for month_name in months_to_sum:
            month_data = record['monthlyData'][year].get(month_name, {})
            if isinstance(month_data, dict):
                cumulative_clicks += month_data.get('clicks', 0)
                cumulative_orders += month_data.get('orders', 0)
                cumulative_revenue += month_data.get('revenue', 0)
    else:
        # Fallback to record's direct values if no monthly data
        cumulative_clicks = record.get('clicks', 0)
        cumulative_orders = record.get('orders', 0)
        cumulative_revenue = record.get('revenue', 0)
    
    return {
        'clicks': cumulative_clicks,
        'orders': cumulative_orders,
        'revenue': cumulative_revenue
    }

def main():
    data = load_bel_data()
    
    print("=== BEL Data Yearly Calculation Test ===\n")
    
    # Test first 5 BEL records
    for i, record in enumerate(data['leaderboard'][:5]):
        print(f"BEL {i+1}: {record['name']} (ID: {record['id']})")
        print("  Original data:")
        print(f"    Clicks: {record.get('clicks', 0):,}")
        print(f"    Orders: {record.get('orders', 0):,}")
        print(f"    Revenue: ${record.get('revenue', 0):,}")
        
        yearly_data = calculate_yearly_data(record)
        print("  2025 YTD (Jan-Aug):")
        print(f"    Clicks: {yearly_data['clicks']:,}")
        print(f"    Orders: {yearly_data['orders']:,}")
        print(f"    Revenue: ${yearly_data['revenue']:,}")
        
        # Calculate metrics
        conv_rate = (yearly_data['orders'] / yearly_data['clicks']) * 100 if yearly_data['clicks'] > 0 else 0
        aov = yearly_data['revenue'] / yearly_data['orders'] if yearly_data['orders'] > 0 else 0
        
        print(f"    C2O CVR: {conv_rate:.2f}%")
        print(f"    AOV: ${aov:.2f}")
        print()

if __name__ == '__main__':
    main()
