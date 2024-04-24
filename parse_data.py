import json

# Path to the JSON file
file_path = 'telemetry_test.json'

# Open the file and load the JSON data
with open(file_path, 'r') as f:
    data = json.load(f)

# Dictionary to hold the counts of each board and cell notation for each event type
event_counts = {}

# Process each event in the data
for event in data:
    event_type = event['eventType']
    # Extract board and cell notations
    board_notation = event['details']['largerBoardNotation']
    cell_notation = event['details']['cellNotation']
    move_pair = (board_notation, cell_notation)

    # Initialize the dictionary for the event type if not already present
    if event_type not in event_counts:
        event_counts[event_type] = {}

    # Increment the count for this specific board and cell notation
    if move_pair in event_counts[event_type]:
        event_counts[event_type][move_pair] += 1
    else:
        event_counts[event_type][move_pair] = 1

print(event_counts)
