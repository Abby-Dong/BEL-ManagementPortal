#!/usr/bin/env python3
"""
Add region data to BEL profiles for region filtering functionality.
This script adds geographic region information to each BEL user profile.
"""

import json
import random
from pathlib import Path

# Define realistic regions for BEL users
REGIONS = [
    "North America",
    "Europe", 
    "Asia Pacific",
    "Latin America",
    "Middle East & Africa",
    "Southeast Asia",
    "Australia & New Zealand"
]

# Weight the regions based on realistic BEL distribution
REGION_WEIGHTS = [
    0.35,  # North America
    0.25,  # Europe
    0.20,  # Asia Pacific
    0.08,  # Latin America
    0.05,  # Middle East & Africa
    0.05,  # Southeast Asia
    0.02   # Australia & New Zealand
]

def add_regions_to_profiles(data_path):
    """Add region information to BEL profiles."""
    
    # Load existing data
    print(f"Loading BEL profiles from {data_path}")
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create backup
    backup_path = data_path.with_suffix('.json.backup')
    print(f"Creating backup at {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Add region to each BEL user
    total_users = len(data['leaderboard'])
    print(f"Adding regions to {total_users} BEL users...")
    
    region_counts = {}
    
    for i, user in enumerate(data['leaderboard']):
        # Assign region based on weighted random selection
        region = random.choices(REGIONS, weights=REGION_WEIGHTS)[0]
        user['region'] = region
        
        # Count regions for statistics
        region_counts[region] = region_counts.get(region, 0) + 1
        
        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{total_users} users...")
    
    # Display distribution
    print("\nRegion distribution:")
    for region, count in sorted(region_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_users) * 100
        print(f"  {region}: {count} users ({percentage:.1f}%)")
    
    # Save updated data
    print(f"\nSaving updated data to {data_path}")
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ Region data added successfully!")
    return region_counts

def main():
    """Main function."""
    # Set random seed for reproducible results
    random.seed(42)
    
    # Path to BEL profiles
    script_dir = Path(__file__).parent
    data_path = script_dir.parent / 'data' / 'belProfiles.json'
    
    if not data_path.exists():
        print(f"❌ Error: BEL profiles file not found at {data_path}")
        return
    
    try:
        region_counts = add_regions_to_profiles(data_path)
        
        print(f"\n🎉 Successfully added region data to BEL profiles!")
        print(f"📊 Total regions: {len(region_counts)}")
        print(f"📁 Backup created: {data_path.with_suffix('.json.backup')}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
