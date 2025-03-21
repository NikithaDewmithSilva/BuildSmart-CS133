from dotenv import load_dotenv
from supabase import create_client, Client
from flask_cors import CORS
import os
import json
from flask import Blueprint, request, jsonify, send_file
import io
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')


# Load environment variables
load_dotenv()

app = Blueprint("app_matplotlib", __name__)  # Convert to Blueprint
CORS(app)

BACKEND_FOLDER = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BACKEND_FOLDER, "output.json")

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)


def load_data():
    """Load the data from Supabase or fallback to local JSON file"""
    try:
        response = supabase.table("material_usage").select(
            "*").order("created_at", desc=True).limit(1).execute()

        if response.data and len(response.data) > 0:
            print("Loading data from Supabase")
            return response.data[0]["data"]
        else:
            print("No data in Supabase, falling back to local file")
            try:
                with open(DATA_FILE, 'r') as file:
                    return json.load(file)
            except FileNotFoundError:
                return {"error": "Data file not found"}
    except Exception as e:
        print(f"Error loading data from Supabase: {str(e)}")
        try:
            with open(DATA_FILE, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return {"error": "Data file not found"}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format in data file"}


def save_data(data):
    """Save the data to Supabase and local file for backup"""
    try:
        # Insert new data to Supabase
        print("Saving data to Supabase")
        response = supabase.table("material_usage").insert({
            "data": data,
        }).execute()

        print("Saving data to local file")
        with open(DATA_FILE, 'w') as file:
            json.dump(data, file, indent=4)
        return True
    except Exception as e:
        print(f"Error saving data: {str(e)}")
        # Try to save locally if Supabase fails
        try:
            with open(DATA_FILE, 'w') as file:
                json.dump(data, file, indent=4)
            return True
        except:
            return False


data = load_data()


@app.route('/')
def index():
    return jsonify({"status": "API is running"})


@app.route('/api/material-chart', methods=['GET'])
def get_material_chart():
    chart_type = request.args.get('type', 'category')

    if chart_type == 'category':
        return generate_category_chart()
    elif chart_type in ['cement', 'sand', 'gravel', 'steel', 'brick', 'paint', 'primer', 'tile']:
        return generate_material_chart(chart_type)
    elif chart_type == 'usage':
        # New chart type to show used vs remaining materials
        return generate_usage_chart()
    else:
        return generate_category_chart()


def generate_category_chart():
    categories = list(data.keys())

    categories = [cat for cat in categories if cat !=
                  "Summary" and not cat.endswith("Usage Tracking")]

    material_counts = [len(data[category]) for category in categories]

    short_categories = [cat.replace(' Material Estimate', '')
                        for cat in categories]

    plt.figure(figsize=(10, 6))
    bars = plt.bar(short_categories, material_counts, color='skyblue')

    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                 f'{int(height)}', ha='center', va='bottom')

    plt.xlabel('Construction Categories')
    plt.ylabel('Number of Materials')
    plt.title('Number of Materials by Construction Category')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100)
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


def generate_material_chart(material_type):
    # Dictionary to map material types to search materials and units
    material_map = {
        'cement': {'terms': ['cement'], 'unit': 'bags', 'color': 'orangered', 'title': 'Cement Usage'},
        'sand': {'terms': ['sand'], 'unit': 'kg', 'color': 'sandybrown', 'title': 'Sand Usage'},
        'gravel': {'terms': ['gravel'], 'unit': 'kg', 'color': 'darkgray', 'title': 'Gravel Usage'},
        'steel': {'terms': ['steel'], 'unit': 'kg', 'color': 'slategray', 'title': 'Steel Usage'},
        'brick': {'terms': ['brick'], 'unit': 'pieces', 'color': 'firebrick', 'title': 'Brick Usage'},
        'paint': {'terms': ['paint'], 'unit': 'liters', 'color': 'royalblue', 'title': 'Paint Usage'},
        'primer': {'terms': ['primer'], 'unit': 'liters', 'color': 'lightblue', 'title': 'Primer Usage'},
        'tile': {'terms': ['tile'], 'unit': 'pieces', 'color': 'cadetblue', 'title': 'Tiles Required'}
    }

    # Extract material quantities across categories
    material_data = {}
    used_material_data = {}

    for category, materials in data.items():
        if category == "Summary" or category.endswith("Usage Tracking"):
            continue

        short_category = category.replace(' Material Estimate', '')

        tracking_category = f"{category.replace(' Material Estimate', '')} Usage Tracking"
        tracking_data = data.get(tracking_category, {})

        for material_name, value in materials.items():
            if isinstance(material_name, str):
                for term in material_map[material_type]['terms']:
                    if term in material_name.lower():
                        if material_type == 'cement' and 'kg' in material_name.lower() and 'bags' not in material_name.lower():
                            continue
                        if material_type == 'brick' and 'required' not in material_name.lower():
                            continue
                        if material_type == 'tile' and 'needed' not in material_name.lower():
                            continue

                        if short_category not in material_data:
                            material_data[short_category] = 0
                            used_material_data[short_category] = 0

                        material_data[short_category] += value

                        # Get used amount from tracking data if available
                        used_key = f"{material_name} Used"
                        if used_key in tracking_data:
                            used_material_data[short_category] += tracking_data[used_key]

    # Plot material usage (estimated vs used)
    categories = list(material_data.keys())
    estimated_values = list(material_data.values())
    used_values = [used_material_data.get(cat, 0) for cat in categories]
    remaining_values = [est - used for est,
                        used in zip(estimated_values, used_values)]

    plt.figure(figsize=(10, 6))

    if not categories:
        plt.text(0.5, 0.5, f"No {material_type} data found",
                 ha='center', va='center')
    else:
        bar_width = 0.35
        x = range(len(categories))

        plt.bar(x, estimated_values, bar_width,
                color=material_map[material_type]['color'], alpha=0.7, label='Estimated')
        plt.bar([i + bar_width for i in x], used_values,
                bar_width, color='green', alpha=0.7, label='Used')

        plt.xlabel('Construction Categories')
        plt.ylabel(
            f'{material_map[material_type]["title"]} ({material_map[material_type]["unit"]})')
        plt.title(
            f'{material_map[material_type]["title"]} - Estimated vs Used')
        plt.xticks([i + bar_width/2 for i in x],
                   categories, rotation=45, ha='right')
        plt.legend()

    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100)
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


def generate_usage_chart():
    """Generate a chart showing material usage percentages across categories"""
    # Create a dictionary to store usage percentages by category
    usage_percentages = {}

    for category, materials in data.items():
        if category == "Summary" or category.endswith("Usage Tracking"):
            continue

        tracking_category = f"{category.replace(' Material Estimate', '')} Usage Tracking"
        tracking_data = data.get(tracking_category, {})

        if not tracking_data:
            continue

        total_estimated = 0
        total_used = 0

        for material_name, value in materials.items():
            used_key = f"{material_name} Used"
            if used_key in tracking_data:
                total_estimated += value
                total_used += tracking_data[used_key]

        if total_estimated > 0:
            usage_percentage = (total_used / total_estimated) * 100
            short_category = category.replace(' Material Estimate', '')
            usage_percentages[short_category] = usage_percentage

    categories = list(usage_percentages.keys())
    percentages = list(usage_percentages.values())

    plt.figure(figsize=(10, 6))

    if not categories:
        plt.text(0.5, 0.5, "No usage data available", ha='center', va='center')
    else:
        bars = plt.bar(categories, percentages, color='teal')

        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + 1,
                     f'{height:.1f}%', ha='center', va='bottom')

        plt.xlabel('Construction Categories')
        plt.ylabel('Usage Percentage')
        plt.title('Material Usage Percentage by Category')
        plt.xticks(rotation=45, ha='right')
        plt.ylim(0, 110)

    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=100)
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')


@app.route('/api/materials', methods=['GET'])
def get_materials():
    return jsonify(data)


@app.route('/api/update-usage', methods=['POST'])
def update_usage():
    """Update the usage tracking for materials"""
    try:
        update_data = request.json
        category = update_data.get('category')
        material = update_data.get('material')
        used_amount = update_data.get('usedAmount')

        if not all([category, material, used_amount is not None]):
            return jsonify({"error": "Missing required fields"}), 400

        # Ensure used_amount is a number
        try:
            used_amount = float(used_amount)
        except ValueError:
            return jsonify({"error": "Used amount must be a number"}), 400

        tracking_category = f"{category.replace(' Material Estimate', '')} Usage Tracking"
        if tracking_category not in data:
            data[tracking_category] = {}

        used_key = f"{material} Used"
        data[tracking_category][used_key] = used_amount

        if save_data(data):
            return jsonify({"success": True, "message": "Usage updated successfully"})
        else:
            return jsonify({"error": "Failed to save data"}), 500

    except Exception as e:
        return jsonify({"error": f"Error updating usage: {str(e)}"}), 500


@app.route('/api/material-types', methods=['GET'])
def get_material_types():
    # Return a list of available material types for charting
    return jsonify({
        "material_types": [
            {"id": "category", "name": "Categories Overview"},
            {"id": "cement", "name": "Cement Usage"},
            {"id": "sand", "name": "Sand Usage"},
            {"id": "gravel", "name": "Gravel Usage"},
            {"id": "steel", "name": "Steel Usage"},
            {"id": "brick", "name": "Brick Usage"},
            {"id": "paint", "name": "Paint Usage"},
            {"id": "primer", "name": "Primer Usage"},
            {"id": "tile", "name": "Tiles Required"},
            {"id": "usage", "name": "Overall Usage Percentages"}
        ]
    })
