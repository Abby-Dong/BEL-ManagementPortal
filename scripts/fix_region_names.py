#!/usr/bin/env python3
"""
Fix region names to match the getRegionFromCountry function definitions in app.js.
Update region assignments to use the correct region names.
"""

import json
from pathlib import Path

# Corrected country code to region mapping (matching app.js definitions)
COUNTRY_TO_REGION = {
    # North America
    'US': 'North America',
    'CA': 'North America',
    'MX': 'North America',
    
    # Europe
    'GB': 'Europe',
    'DE': 'Europe', 
    'FR': 'Europe',
    'IT': 'Europe',
    'ES': 'Europe',
    'NL': 'Europe',
    'SE': 'Europe',
    'NO': 'Europe',
    'DK': 'Europe',
    'FI': 'Europe',
    'CH': 'Europe',
    'AT': 'Europe',
    'BE': 'Europe',
    'PT': 'Europe',
    'IE': 'Europe',
    'PL': 'Europe',
    'CZ': 'Europe',
    'HU': 'Europe',
    'GR': 'Europe',
    
    # Japan (separate region)
    'JP': 'Japan',
    
    # Korea (separate region)  
    'KR': 'Korea',
    
    # China (separate region)
    'CN': 'China',
    
    # Taiwan (separate region)
    'TW': 'Taiwan',
    
    # AAU / NZ (Australia & New Zealand)
    'AU': 'AAU / NZ',
    'NZ': 'AAU / NZ',
    
    # ASEAN (Southeast Asia)
    'TH': 'ASEAN',
    'VN': 'ASEAN',
    'PH': 'ASEAN',
    'ID': 'ASEAN',
    'MY': 'ASEAN',
    'SG': 'ASEAN',
    'MM': 'ASEAN',
    'KH': 'ASEAN',
    'LA': 'ASEAN',
    'BN': 'ASEAN',
    
    # India (separate region)
    'IN': 'India',
    
    # LATAM (Latin America)
    'BR': 'LATAM',
    'AR': 'LATAM',
    'CL': 'LATAM',
    'CO': 'LATAM',
    'PE': 'LATAM',
    'UY': 'LATAM',
    'EC': 'LATAM',
    'BO': 'LATAM',
    'PY': 'LATAM',
    'VE': 'LATAM',
    
    # ME&A (Middle East & Africa)
    'AE': 'ME&A',
    'SA': 'ME&A',
    'IL': 'ME&A',
    'TR': 'ME&A',
    'EG': 'ME&A',
    'ZA': 'ME&A',
    'NG': 'ME&A',
    'KE': 'ME&A',
    'MA': 'ME&A',
    'TN': 'ME&A',
    'GH': 'ME&A',
    'ET': 'ME&A',
    
    # Russia & CIS
    'RU': 'Russia & CIS',
    'BY': 'Russia & CIS',
    'KZ': 'Russia & CIS',
    'KG': 'Russia & CIS',
    'TJ': 'Russia & CIS',
    'TM': 'Russia & CIS',
    'UZ': 'Russia & CIS',
    'AM': 'Russia & CIS',
    'AZ': 'Russia & CIS',
    'GE': 'Russia & CIS',
    'MD': 'Russia & CIS',
    'UA': 'Russia & CIS',
}

def extract_country_code(bel_id):
    """Extract country code from BEL ID (positions 1-2)."""
    if len(bel_id) >= 3:
        return bel_id[1:3].upper()
    return None

def fix_region_names(data_path):
    """Fix region names to match app.js definitions."""
    
    # Load existing data
    print(f"Loading BEL profiles from {data_path}")
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create backup
    backup_path = data_path.with_suffix('.json.backup3')
    print(f"Creating backup at {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Update regions to match app.js definitions
    total_users = len(data['leaderboard'])
    print(f"Fixing region names for {total_users} BEL users...")
    
    region_counts = {}
    country_stats = {}
    fixed_count = 0
    
    for i, user in enumerate(data['leaderboard']):
        bel_id = user['id']
        country_code = extract_country_code(bel_id)
        
        if country_code and country_code in COUNTRY_TO_REGION:
            new_region = COUNTRY_TO_REGION[country_code]
            old_region = user.get('region', 'Unknown')
            
            if old_region != new_region:
                print(f"  {user['name']}: {old_region} -> {new_region}")
                fixed_count += 1
            
            user['region'] = new_region
            user['countryCode'] = country_code
            
            # Count regions and countries
            region_counts[new_region] = region_counts.get(new_region, 0) + 1
            country_stats[country_code] = country_stats.get(country_code, 0) + 1
            
        else:
            # Default to Others for unknown country codes
            user['region'] = 'Others'
            user['countryCode'] = country_code or 'UNKNOWN'
            region_counts['Others'] = region_counts.get('Others', 0) + 1
        
        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{total_users} users...")
    
    # Display statistics
    print(f"\n=== Fixed Region Distribution ===")
    for region, count in sorted(region_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_users) * 100
        print(f"  {region}: {count} users ({percentage:.1f}%)")
    
    print(f"\n=== Changes Summary ===")
    print(f"  Users with region names fixed: {fixed_count}")
    print(f"  Total regions: {len(region_counts)}")
    
    # Save updated data
    print(f"\nSaving updated data to {data_path}")
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Region names fixed to match app.js definitions!")
    return region_counts

def main():
    """Main function."""
    # Path to BEL profiles
    script_dir = Path(__file__).parent
    data_path = script_dir.parent / 'data' / 'belProfiles.json'
    
    if not data_path.exists():
        print(f"❌ Error: BEL profiles file not found at {data_path}")
        return
    
    try:
        region_counts = fix_region_names(data_path)
        
        print(f"\n🎉 Successfully fixed region names!")
        print(f"📊 Total regions: {len(region_counts)}")
        print(f"📁 Backup created: {data_path.with_suffix('.json.backup3')}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
