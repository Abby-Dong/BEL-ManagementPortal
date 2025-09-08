import json

# Read the contactSupport.json file
with open('data/contactSupport.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define question times for tickets that don't have them
question_times = {
    'TICK-2025-014': '2025-08-10 09:45',
    'TICK-2025-015': '2025-08-09 14:20',
    'TICK-2025-016': '2025-08-08 10:15',
    'TICK-2025-017': '2025-08-07 13:45',
    'TICK-2025-018': '2025-08-06 15:30',
    'TICK-2025-019': '2025-08-05 11:20',
    'TICK-2025-020': '2025-08-04 16:45',
    'TICK-2025-021': '2025-08-03 10:30',
    'TICK-2025-022': '2025-08-02 14:15'
}

# Update tickets with missing questionTime
updated_count = 0
for ticket in data['tickets']:
    if 'questionTime' not in ticket and ticket['ticketNumber'] in question_times:
        ticket['questionTime'] = question_times[ticket['ticketNumber']]
        print(f"Updated {ticket['ticketNumber']} with questionTime: {ticket['questionTime']}")
        updated_count += 1

# Write back to file
with open('data/contactSupport.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f'Updated {updated_count} tickets with questionTime fields!')
