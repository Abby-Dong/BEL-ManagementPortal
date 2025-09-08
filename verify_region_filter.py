#!/usr/bin/env python3
"""
Verify that the region filtering functionality is working correctly.
This script checks the BEL data and validates the region distribution.
"""

import json
from pathlib import Path
from collections import Counter

def verify_region_data():
    """Verify the region data in BEL profiles."""
    
    script_dir = Path(__file__).parent
    data_path = script_dir / 'data' / 'belProfiles.json'
    
    print("🔍 Verifying Region Filtering Implementation")
    print("=" * 50)
    
    # Load BEL data
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    leaderboard = data['leaderboard']
    total_users = len(leaderboard)
    
    print(f"📊 Total BEL Users: {total_users}")
    
    # Analyze region distribution
    regions = [user.get('region', 'Unknown') for user in leaderboard]
    region_counts = Counter(regions)
    
    print(f"\n🌍 Region Distribution:")
    for region, count in region_counts.most_common():
        percentage = (count / total_users) * 100
        print(f"  • {region}: {count} users ({percentage:.1f}%)")
    
    # Verify each region has data
    print(f"\n✅ Verification Results:")
    print(f"  • Regions found: {len(region_counts)}")
    print(f"  • Users with region data: {sum(1 for user in leaderboard if user.get('region'))}")
    print(f"  • Users without region data: {sum(1 for user in leaderboard if not user.get('region'))}")
    
    # Test filtering logic simulation
    print(f"\n🧪 Filter Testing Simulation:")
    for region_name in region_counts.keys():
        if region_name != 'Unknown':
            filtered_users = [user for user in leaderboard if user.get('region') == region_name]
            print(f"  • Filter by '{region_name}': {len(filtered_users)} users")
            
            # Level distribution for this region
            levels = Counter(user['level'] for user in filtered_users)
            level_str = ', '.join(f"{level}: {count}" for level, count in levels.items())
            print(f"    Levels: {level_str}")
    
    # Generate test cases for JavaScript
    print(f"\n📝 JavaScript Test Cases:")
    print("```javascript")
    print("// Expected region counts for testing:")
    for region, count in region_counts.items():
        if region != 'Unknown':
            safe_name = region.replace(' ', '').replace('&', 'And')
            print(f"const expected{safe_name}Count = {count};")
    
    print("\n// Test filtering function:")
    print("function testRegionFilter(region, expectedCount) {")
    print("  const filtered = belData.leaderboard.filter(user => user.region === region);")
    print("  console.log(`${region}: ${filtered.length} users (expected: ${expectedCount})`);")
    print("  return filtered.length === expectedCount;")
    print("}")
    print("```")
    
    return region_counts

def main():
    """Main function."""
    try:
        region_counts = verify_region_data()
        
        print(f"\n🎉 Region data verification completed!")
        print(f"📈 Ready for region filtering functionality testing.")
        
        # Instructions for manual testing
        print(f"\n📋 Manual Testing Instructions:")
        print(f"1. Open index.html in browser")
        print(f"2. Click the Filter icon in header")
        print(f"3. Select different regions from dropdown")
        print(f"4. Verify dashboard updates with filtered data")
        print(f"5. Check that statistics reflect the selected region")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
