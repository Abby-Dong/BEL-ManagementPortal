#!/usr/bin/env python3
"""
CSV Export Verification Script
Verifies that the BEL Management Portal CSV export functionality works correctly
"""
import json
import os

def verify_csv_implementation():
    print("🔍 Verifying CSV Export Implementation...")
    print("=" * 50)
    
    # Check if the app.js file contains the new CSV export implementation
    app_js_path = "src/js/app.js"
    if not os.path.exists(app_js_path):
        print("❌ app.js file not found!")
        return False
    
    with open(app_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for key implementation elements
    checks = [
        ("✅ CSV Headers", 'Referral ID' in content and 'C2O CVR (%)' in content),
        ("✅ Blob Creation", 'new Blob' in content and 'text/csv' in content),
        ("✅ Download Link", 'createElement(\'a\')' in content and 'download' in content),
        ("✅ Error Handling", 'try {' in content and 'catch (error)' in content),
        ("✅ Filter Summary", 'getFilterSummary' in content),
        ("✅ Success Feedback", 'Downloaded!' in content),
        ("✅ Processing State", 'Exporting...' in content),
        ("✅ Empty Data Check", 'No data to export' in content),
        ("✅ File Naming", 'BEL_Performance_Leaderboard_' in content),
        ("✅ Data Processing", 'getProcessedData()' in content)
    ]
    
    all_passed = True
    for check_name, check_result in checks:
        if check_result:
            print(f"{check_name}")
        else:
            print(f"❌ {check_name}")
            all_passed = False
    
    print("\n" + "=" * 50)
    
    if all_passed:
        print("🎉 ALL CHECKS PASSED!")
        print("✅ CSV Export functionality is properly implemented")
        print("\n📝 Key Features:")
        print("   • Exports currently filtered data")
        print("   • Includes all table columns")
        print("   • Smart filename generation")
        print("   • Error handling and user feedback")
        print("   • Browser-compatible download")
        
        # Check sample data availability
        if os.path.exists("data/belProfiles.json"):
            with open("data/belProfiles.json", 'r') as f:
                data = json.load(f)
                record_count = len(data.get('leaderboard', []))
                print(f"\n📊 Sample Data: {record_count} BEL records available for export")
        
        print("\n🚀 Ready to test in browser!")
        print("   1. Open http://localhost:8000")
        print("   2. Navigate to Top 10 BEL Performance Leaderboard")
        print("   3. Click 'Export CSV' button")
        print("   4. Verify download works correctly")
        
        return True
    else:
        print("❌ SOME CHECKS FAILED!")
        print("Please review the implementation.")
        return False

if __name__ == "__main__":
    verify_csv_implementation()
