#!/usr/bin/env python3
"""
Script to remove legacy top-level fields from belProfiles.json
These fields are no longer needed as data is calculated from monthlyData
"""

import json
import os
from pathlib import Path

def remove_legacy_fields():
    """Remove legacy fields from all user profiles"""
    
    # Path to the data file
    data_file = Path(__file__).parent.parent / 'data' / 'belProfiles.json'
    
    if not data_file.exists():
        print(f"❌ Error: {data_file} not found")
        return False
    
    # Create backup first
    backup_file = data_file.with_suffix('.json.backup')
    print(f"📋 Creating backup: {backup_file}")
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print("✅ Backup created successfully")
        
    except Exception as e:
        print(f"❌ Error creating backup: {e}")
        return False
    
    # Fields to remove
    legacy_fields = ['clicks', 'orders', 'revenue', 'convRate', 'aov']
    
    # Track changes
    total_users = len(data.get('leaderboard', []))
    fields_removed = {field: 0 for field in legacy_fields}
    
    print(f"🔄 Processing {total_users} users...")
    
    # Remove legacy fields from each user
    for i, user in enumerate(data.get('leaderboard', [])):
        user_name = user.get('name', f'User {i+1}')
        removed_from_user = []
        
        for field in legacy_fields:
            if field in user:
                del user[field]
                fields_removed[field] += 1
                removed_from_user.append(field)
        
        if removed_from_user:
            print(f"  👤 {user_name}: Removed {', '.join(removed_from_user)}")
    
    # Save the cleaned data
    try:
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print("\n✅ Successfully cleaned belProfiles.json")
        
        # Summary
        print("\n📊 Summary:")
        for field, count in fields_removed.items():
            print(f"  - {field}: removed from {count}/{total_users} users")
        
        # Verify the structure
        print("\n🔍 Verification:")
        sample_user = data['leaderboard'][0] if data['leaderboard'] else {}
        remaining_fields = [k for k in sample_user.keys() if k not in ['monthlyData', 'bankingInfo']]
        print(f"  - Remaining user fields: {remaining_fields}")
        print(f"  - Has monthlyData: {'monthlyData' in sample_user}")
        print(f"  - Has bankingInfo: {'bankingInfo' in sample_user}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error saving cleaned data: {e}")
        print(f"🔄 Restoring from backup...")
        
        # Restore from backup
        try:
            with open(backup_file, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
            
            print("✅ Restored from backup")
            
        except Exception as restore_error:
            print(f"❌ Error restoring backup: {restore_error}")
        
        return False

def verify_cleanup():
    """Verify that the cleanup was successful"""
    
    data_file = Path(__file__).parent.parent / 'data' / 'belProfiles.json'
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        legacy_fields = ['clicks', 'orders', 'revenue', 'convRate', 'aov']
        
        print("\n🔍 Verification Results:")
        
        for i, user in enumerate(data.get('leaderboard', [])):
            user_name = user.get('name', f'User {i+1}')
            found_legacy = [field for field in legacy_fields if field in user]
            
            if found_legacy:
                print(f"  ⚠️  {user_name}: Still has {', '.join(found_legacy)}")
            else:
                print(f"  ✅ {user_name}: Clean")
        
        # Check if any legacy fields remain
        all_clean = True
        for user in data.get('leaderboard', []):
            if any(field in user for field in legacy_fields):
                all_clean = False
                break
        
        if all_clean:
            print("\n🎉 All legacy fields successfully removed!")
        else:
            print("\n⚠️  Some legacy fields still remain")
        
        return all_clean
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        return False

if __name__ == "__main__":
    print("🧹 BEL Profile Data Cleanup Tool")
    print("=" * 50)
    print("This script will remove the following legacy fields:")
    print("  - clicks, orders, revenue, convRate, aov")
    print("These fields are no longer needed as data is calculated from monthlyData.")
    print()
    
    # Confirm with user
    response = input("Do you want to proceed? (y/N): ").strip().lower()
    
    if response in ['y', 'yes']:
        print("\n🚀 Starting cleanup process...")
        
        if remove_legacy_fields():
            print("\n🔍 Running verification...")
            verify_cleanup()
        else:
            print("\n❌ Cleanup process failed")
    else:
        print("\n❌ Cleanup cancelled by user")
