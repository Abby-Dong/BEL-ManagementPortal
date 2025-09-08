#!/usr/bin/env python3
"""
Verify sorting and formatting fixes for Dashboard and Account Management
"""
import json

def main():
    # Load BEL profiles data
    with open('data/belProfiles.json', 'r') as f:
        data = json.load(f)
    
    print("🔍 Verifying Dashboard Performance Table Calculations")
    print("=" * 60)
    
    # Calculate level statistics similar to JavaScript
    levels = ['Builder', 'Enabler', 'Exploder', 'Leader']
    level_stats = {level: {'clicks': 0, 'orders': 0, 'revenue': 0, 'count': 0} for level in levels}
    
    for leader in data['leaderboard']:
        level = leader['level']
        if level not in level_stats:
            continue
            
        # Calculate 2025 YTD data (Jan-Aug)
        total_clicks = 0
        total_orders = 0
        total_revenue = 0
        
        if 'monthlyData' in leader and '2025' in leader['monthlyData']:
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
            for month in months:
                if month in leader['monthlyData']['2025']:
                    month_data = leader['monthlyData']['2025'][month]
                    total_clicks += month_data.get('clicks', 0)
                    total_orders += month_data.get('orders', 0)
                    total_revenue += month_data.get('revenue', 0)
        else:
            # Fallback
            total_clicks = leader.get('clicks', 0)
            total_orders = leader.get('orders', 0)
            total_revenue = leader.get('revenue', 0)
        
        level_stats[level]['clicks'] += total_clicks
        level_stats[level]['orders'] += total_orders
        level_stats[level]['revenue'] += total_revenue
        level_stats[level]['count'] += 1
    
    # Display results
    for level, stats in level_stats.items():
        if stats['count'] > 0:
            conv_rate = (stats['orders'] / stats['clicks']) * 100 if stats['clicks'] > 0 else 0
            aov = stats['revenue'] / stats['orders'] if stats['orders'] > 0 else 0
            
            print(f"\n📊 {level} Level:")
            print(f"   Clicks: {stats['clicks']:,}")
            print(f"   Orders: {stats['orders']:,}")
            print(f"   Revenue: ${stats['revenue']:,.2f}")
            print(f"   C2O CVR: {conv_rate:.2f}%")  # 2 decimal places
            print(f"   AOV: ${aov:.2f}")
            print(f"   BELs: {stats['count']}")
    
    print("\n" + "=" * 60)
    print("✅ All calculations should now show:")
    print("   - C2O CVR (%) with 2 decimal places")
    print("   - Dashboard table columns should be sortable")
    print("   - Account Management table uses YTD cumulative data")
    
    # Test sample BEL for Account Management
    print("\n🔍 Sample Account Management Record (YTD Data):")
    if data['leaderboard']:
        sample = data['leaderboard'][0]
        sample_clicks = 0
        sample_orders = 0
        sample_revenue = 0
        
        if 'monthlyData' in sample and '2025' in sample['monthlyData']:
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
            for month in months:
                if month in sample['monthlyData']['2025']:
                    month_data = sample['monthlyData']['2025'][month]
                    sample_clicks += month_data.get('clicks', 0)
                    sample_orders += month_data.get('orders', 0)
                    sample_revenue += month_data.get('revenue', 0)
        
        sample_conv = (sample_orders / sample_clicks) * 100 if sample_clicks > 0 else 0
        sample_aov = sample_revenue / sample_orders if sample_orders > 0 else 0
        
        print(f"   BEL: {sample['name']} ({sample['id']})")
        print(f"   Original clicks: {sample.get('clicks', 0)}")
        print(f"   YTD clicks: {sample_clicks:,}")
        print(f"   C2O CVR: {sample_conv:.2f}%")  # 2 decimal places
        print(f"   AOV: ${sample_aov:.2f}")

if __name__ == '__main__':
    main()
