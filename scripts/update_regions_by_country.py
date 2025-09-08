#!/usr/bin/env python3
"""
Update BEL profiles to use country codes from ID for region assignment.
Extract country code from position 1-2 (0-indexed) of the BEL ID.
"""

import json
from pathlib import Path

# Country code to region mapping
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
    
    # Asia Pacific
    'JP': 'Asia Pacific',
    'KR': 'Asia Pacific',
    'CN': 'Asia Pacific',
    'TW': 'Asia Pacific',
    'HK': 'Asia Pacific',
    'SG': 'Asia Pacific',
    'MY': 'Asia Pacific',
    'TH': 'Asia Pacific',
    'VN': 'Asia Pacific',
    'PH': 'Asia Pacific',
    'ID': 'Asia Pacific',
    'IN': 'Asia Pacific',
    
    # Australia & New Zealand
    'AU': 'Australia & New Zealand',
    'NZ': 'Australia & New Zealand',
    
    # Latin America
    'BR': 'Latin America',
    'AR': 'Latin America',
    'CL': 'Latin America',
    'CO': 'Latin America',
    'PE': 'Latin America',
    'UY': 'Latin America',
    'EC': 'Latin America',
    'BO': 'Latin America',
    'PY': 'Latin America',
    'VE': 'Latin America',
    
    # Middle East & Africa
    'AE': 'Middle East & Africa',
    'SA': 'Middle East & Africa',
    'IL': 'Middle East & Africa',
    'TR': 'Middle East & Africa',
    'EG': 'Middle East & Africa',
    'ZA': 'Middle East & Africa',
    'NG': 'Middle East & Africa',
    'KE': 'Middle East & Africa',
    'MA': 'Middle East & Africa',
    'TN': 'Middle East & Africa',
    'GH': 'Middle East & Africa',
    'ET': 'Middle East & Africa',
    
    # Southeast Asia (separate from Asia Pacific if needed)
    'TH': 'Southeast Asia',
    'VN': 'Southeast Asia',
    'PH': 'Southeast Asia',
    'ID': 'Southeast Asia',
    'MY': 'Southeast Asia',
    'SG': 'Southeast Asia',
    'MM': 'Southeast Asia',
    'KH': 'Southeast Asia',
    'LA': 'Southeast Asia',
    'BN': 'Southeast Asia',
}

def extract_country_code(bel_id):
    """Extract country code from BEL ID (positions 1-2)."""
    if len(bel_id) >= 3:
        return bel_id[1:3].upper()
    return None

def update_regions_by_country_code(data_path):
    """Update region information based on country codes in BEL IDs."""
    
    # Load existing data
    print(f"Loading BEL profiles from {data_path}")
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create backup
    backup_path = data_path.with_suffix('.json.backup2')
    print(f"Creating backup at {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Update regions based on country codes
    total_users = len(data['leaderboard'])
    print(f"Updating regions for {total_users} BEL users based on country codes...")
    
    region_counts = {}
    country_stats = {}
    unknown_countries = set()
    
    for i, user in enumerate(data['leaderboard']):
        bel_id = user['id']
        country_code = extract_country_code(bel_id)
        
        if country_code and country_code in COUNTRY_TO_REGION:
            region = COUNTRY_TO_REGION[country_code]
            user['region'] = region
            user['countryCode'] = country_code  # Add country code field for reference
            
            # Count regions and countries
            region_counts[region] = region_counts.get(region, 0) + 1
            country_stats[country_code] = country_stats.get(country_code, 0) + 1
            
        else:
            # Default to a generic region for unknown country codes
            user['region'] = 'Other'
            user['countryCode'] = country_code or 'UNKNOWN'
            region_counts['Other'] = region_counts.get('Other', 0) + 1
            if country_code:
                unknown_countries.add(country_code)
        
        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{total_users} users...")
    
    # Display statistics
    print(f"\n=== Region Distribution ===")
    for region, count in sorted(region_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_users) * 100
        print(f"  {region}: {count} users ({percentage:.1f}%)")
    
    print(f"\n=== Country Code Distribution ===")
    for country, count in sorted(country_stats.items(), key=lambda x: x[1], reverse=True):
        region = COUNTRY_TO_REGION.get(country, 'Other')
        print(f"  {country} ({region}): {count} users")
    
    if unknown_countries:
        print(f"\n⚠️  Unknown Country Codes: {sorted(unknown_countries)}")
    
    # Save updated data
    print(f"\nSaving updated data to {data_path}")
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Region data updated based on country codes!")
    return region_counts, country_stats

def main():
    """Main function."""
    # Path to BEL profiles
    script_dir = Path(__file__).parent
    data_path = script_dir.parent / 'data' / 'belProfiles.json'
    
    if not data_path.exists():
        print(f"❌ Error: BEL profiles file not found at {data_path}")
        return
    
    try:
        region_counts, country_stats = update_regions_by_country_code(data_path)
        
        print(f"\n🎉 Successfully updated region data based on country codes!")
        print(f"📊 Total regions: {len(region_counts)}")
        print(f"🌍 Total countries: {len(country_stats)}")
        print(f"📁 Backup created: {data_path.with_suffix('.json.backup2')}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
