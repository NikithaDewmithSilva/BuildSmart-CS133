import pandas as pd
import json
import re

# Load the Excel file
file_path = r"C:\Users\Yesmi\OneDrive\Desktop\SDGP\GitHub\BuildSmart-CS133\backend\Material-Price-List-2024-New.xlsx"

xls = pd.ExcelFile(file_path)


print("\n=== SHEET NAMES IN THE FILE ===")
for i, sheet in enumerate(xls.sheet_names, 1):
    print(f"{i}. {sheet}")



# List of materials
materials = ["Cement - 50Kg bag", "gravel", "steel", 
             "Floor Tile - Homogeneous Porcelain semi - Glazed", 
             "Emulsion Paint", "River sand", "brick", "Wall filler Primer external"]


material_details = {}

# Iterate through all sheets to search for prices
for sheet in xls.sheet_names:
    df = xls.parse(sheet)
    df = df.ffill(axis=0) 
    
    for material in materials:
        # Search for material name in any column
        material_rows = df[df.astype(str).apply(lambda row: row.str.contains(material, case=False, na=False).any(), axis=1)]
        
        if not material_rows.empty:
            material_details[material] = material_rows

# Display extracted material prices and units
print("\n=== MATERIAL PRICES AND UNITS FOUND ===")
for material, data in material_details.items():
    print(f"\n=== {material.upper()} ===")
    print(data)

# Extract price and unit values (Modify this based on actual column structure)
final_details = {}
for material, df in material_details.items():
    try:
        price_col = df.columns[-1]  # Assuming last column has price
        unit_col = df.columns[-2]  # Assuming second last column has the unit
        price = df[price_col].values[0]  # Extract first found price
        unit = df[unit_col].values[0]  # Extract corresponding unit
        
        # Check for NaN and replace with meaningful text
        if pd.isna(price):
            price = "Price not found"
        if pd.isna(unit):
            unit = "Unit not found"
        
        final_details[material] = {"price": price, "unit": unit}
    except:
        final_details[material] = {"price": "Price not found", "unit": "Unit not found"}

# Display final extracted prices and units
print("\n=== FINAL MATERIAL PRICES AND UNITS ===")
for material, details in final_details.items():
    print(f"{material.capitalize()}: Price = {details['price']}, Unit = {details['unit']}")

# Save final details to a JSON file
json_file_path = r"C:\Users\Yesmi\OneDrive\Desktop\SDGP\GitHub\BuildSmart-CS133\backend\marketPrices.json"
with open(json_file_path, 'w') as json_file:
    json.dump(final_details, json_file, indent=4)

print(f"\n=== FINAL PRICES AND UNITS SAVED TO JSON FILE ===")
print(f"File saved at: {json_file_path}")




















