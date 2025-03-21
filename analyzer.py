import ezdxf
import math
import logging
import json
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File path to the DXF file
FILE_PATH = r"C:\Users\atcha\OneDrive\Desktop\DXF FILE\Floor plan.dxf"

# Layer names for detection
WALL_LAYER = "xref-Bishop-Overland-08$0$A-WALL"
FOUNDATION_LAYERS = ["xref-Bishop-Overland-08$0$S-FOOTER", "xref-Bishop-Overland-08$0$S-STEM-WALL"]
SLAB_LAYER = "xref-Bishop-Overland-08$0$S-SLAB"
WALL_PATTERNS = [r'.wall.', r'.partition.', r'.a-wall.', r'.walls.']
FOUNDATION_PATTERNS = [r'.foot.', r'.found.', r'.stem.', r'.footer.', r'.foundation.']
SLAB_PATTERNS = [r'.slab.', r'.floor.', r'.concrete.']
ROOF_PATTERNS = [r'.roof.', r'.ceiling.']

# Labels for identifying components
DOOR_LABELS = ["D", "DOOR", "DR", "RSD", "D1", "D2"]
WINDOW_LABELS = ["W", "WINDOW", "FW", "SW", "FL", "W1", "W2"]

# Configurable parameters
WALL_HEIGHT = 2.4  # meters
WALL_THICKNESS = 0.23  # meters (standard brick wall)
FOUNDATION_DEPTH = 0.3  # meters
SLAB_THICKNESS = 0.15  # meters
WASTE_FACTOR = 1.3  # 30% waste allowance

# Material ratios
BRICKS_PER_SQ_M = 50  # bricks/m² for 230 mm wall
MORTAR_PER_SQ_M = 0.025  # m³/m² for brickwork
MORTAR_MIX = {"cement": 400, "sand": 1600}  # kg/m³, 1:4 mix for mortar
CONCRETE_MIX = {"cement": 320, "sand": 640, "gravel": 960}  # kg/m³, 1:2:3 mix for concrete
STEEL_SLAB_RATIO = 65  # kg/m³
STEEL_FOUNDATION_RATIO = 100  # kg/m³
SAND_DENSITY = 1600  # kg/m³
GRAVEL_DENSITY = 1500  # kg/m³
PLASTER_THICKNESS = 0.015  # meters
PLASTER_CEMENT_RATE = 4.5  # kg/m² (cement-only plaster)
PRIMER_RATE = 0.12  # L/m² per coat
PRIMER_COATS = 2    # Number of primer coats
PAINT_RATE = 0.1  # L/m² per coat
PAINT_COATS = 2

# Tile parameters

def calculate_area(entity, unit_factor=1.0):
    """Calculate the area of a given entity with improved error handling."""
    try:
        dxftype = entity.dxftype()
        
        # LWPolyline handling
        if dxftype == 'LWPOLYLINE':
            if entity.is_closed:
                try:
                    return entity.get_area() * unit_factor**2
                except AttributeError:
                    try:
                        return abs(entity.area) * unit_factor**2
                    except Exception:
                        points = list(entity.vertices())
                        if not points:
                            return 0.0
                        area = 0.0
                        for i in range(len(points)):
                            j = (i + 1) % len(points)
                            area += points[i][0] * points[j][1]
                            area -= points[j][0] * points[i][1]
                        return abs(area) * 0.5 * unit_factor**2
            else:
                length = entity.length() * unit_factor if hasattr(entity, 'length') else 0.0
                if length > 0:
                    return length * WALL_HEIGHT
                else:
                    points = list(entity.vertices())
                    length = 0.0
                    for i in range(len(points)-1):
                        x1, y1 = points[i][0], points[i][1]
                        x2, y2 = points[i+1][0], points[i+1][1]
                        length += math.sqrt((x2-x1)**2 + (y2-y1)**2)
                    return length * WALL_HEIGHT * unit_factor
        
        # Circle handling
        elif dxftype == 'CIRCLE':
            radius = getattr(entity.dxf, 'radius', 0) * unit_factor
            return math.pi * radius**2
            
        # Hatch handling    
        elif dxftype == 'HATCH':
            try:
                area = 0.0
                for path in entity.paths:
                    if hasattr(path, 'area'):
                        area += path.area
                return area * unit_factor**2
            except Exception:
                return 0.0
                
        # Line handling
        elif dxftype == 'LINE':
            start = entity.dxf.start
            end = entity.dxf.end
            length = math.sqrt((end[0]-start[0])**2 + (end[1]-start[1])**2) * unit_factor
            return length * WALL_HEIGHT
            
        # Polyline handling
        elif dxftype == 'POLYLINE':
            try:
                if entity.is_closed:
                    points = [pt[:2] for pt in entity.points()]
                    area = 0.5 * abs(sum(
                        points[i][0] * points[(i+1) % len(points)][1] -
                        points[(i+1) % len(points)][0] * points[i][1]
                        for i in range(len(points))
                    )) * unit_factor**2
                    return area
                else:
                    points = [pt[:2] for pt in entity.points()]
                    length = sum(
                        math.sqrt((points[i+1][0]-points[i][0])**2 + (points[i+1][1]-points[i][1])**2)
                        for i in range(len(points)-1)
                    ) * unit_factor
                    return length * WALL_HEIGHT
            except Exception:
                return 0.0
                
        # Arc handling
        elif dxftype == 'ARC':
            radius = entity.dxf.radius * unit_factor
            start_angle = math.radians(entity.dxf.start_angle)
            end_angle = math.radians(entity.dxf.end_angle)
            if end_angle < start_angle:
                end_angle += 2 * math.pi
            angle = end_angle - start_angle
            arc_length = radius * angle
            return arc_length * WALL_HEIGHT
            
        # SPLINE handling
        elif dxftype == 'SPLINE':
            try:
                if entity.closed:
                    points = [entity.point(t / 100)[:2] for t in range(101)]
                    area = 0.5 * abs(sum(
                        points[i][0] * points[(i+1) % len(points)][1] -
                        points[(i+1) % len(points)][0] * points[i][1]
                        for i in range(len(points))
                    )) * unit_factor**2
                    return area
                else:
                    points = [entity.point(t / 100)[:2] for t in range(101)]
                    length = sum(
                        math.sqrt((points[i+1][0]-points[i][0])**2 + (points[i+1][1]-points[i][1])**2)
                        for i in range(len(points)-1)
                    ) * unit_factor
                    return length * WALL_HEIGHT
            except Exception:
                return 0.0
                
        # ELLIPSE handling
        elif dxftype == 'ELLIPSE':
            try:
                major_axis = entity.dxf.major_axis
                minor_axis = entity.dxf.minor_axis
                a = math.sqrt(major_axis[0]**2 + major_axis[1]**2) * unit_factor
                b = a * entity.dxf.ratio
                return math.pi * a * b
            except Exception:
                return 0.0
                
        return 0.0
        
    except Exception:
        return 0.0

def infer_material(entity): 
    

def get_layer_stats(msp):   


def auto_detect_layers(msp): 
    
def save_results_to_json(results, output_path="output.json"):  
 

def process_dxf_file(file_path):
    """Process the DXF file and calculate material estimates with improved compatibility."""
    try:
        doc = ezdxf.readfile(file_path)
        msp = doc.modelspace()
        
        units = doc.header.get('$INSUNITS', 0)
        unit_factors = {
            0: 1.0, 1: 0.0254, 2: 0.3048, 3: 1.6093, 4: 1.0, 5: 0.01,
            6: 1.0, 7: 0.001, 8: 0.000025, 9: 0.000001, 10: 0.9144, 11: 0.0000254
        }
        unit_factor = unit_factors.get(units, 1.0)
        
        detected_layers = auto_detect_layers(msp)
        
        walls, doors, windows, foundations, slabs, columns = 0, 0, 0, 0, 0, 0
        total_wall_area, total_foundation_area, total_slab_area, roofing_area = 0.0, 0.0, 0.0, 0.0
        
        for entity in msp:
            try:
                layer = entity.dxf.layer if hasattr(entity, 'dxf') else ""
                area = calculate_area(entity, unit_factor)
                material = infer_material(entity)
                
                if layer in detected_layers['WALL'] or material == "WALL":
                    walls += 1
                    total_wall_area += area
                elif layer in detected_layers['FOUNDATION'] or material == "FOUNDATION":
                    foundations += 1
                    total_foundation_area += area
                elif layer in detected_layers['SLAB'] or material == "SLAB":
                    slabs += 1
                    total_slab_area += area
                elif layer in detected_layers['ROOF'] or material == "ROOF":
                    roofing_area += area
                elif layer in detected_layers['DOOR'] or material == "DOOR":
                    doors += 1
                elif layer in detected_layers['WINDOW'] or material == "WINDOW":
                    windows += 1
                elif material == "COLUMN":
                    columns += 1
            except Exception:
                continue
        
        if total_wall_area == 0:
            most_common_layer = max(get_layer_stats(msp).items(), key=lambda x: x[1]['count'])[0]
            for entity in msp:
                if hasattr(entity, 'dxf') and entity.dxf.layer == most_common_layer:
                    if entity.dxftype() in ('LINE', 'LWPOLYLINE'):
                        walls += 1
                        area = calculate_area(entity, unit_factor)
                        total_wall_area += area
        
        if total_foundation_area == 0 and total_slab_area > 0:
            total_foundation_area = total_slab_area * 0.2
        
        if total_slab_area == 0 and total_wall_area > 0:
            total_slab_area = (total_wall_area / WALL_HEIGHT) ** 0.5
        
        if roofing_area == 0:
            roofing_area = total_slab_area * ROOF_PITCH_FACTOR

        total_area = total_wall_area + total_foundation_area + total_slab_area

        print("\nSummary:")
        print(f"Walls: {walls}, Total Wall Area: {total_wall_area:.2f} sq meters")
        print(f"Detected Doors: {doors}")
        print(f"Detected Windows: {windows}")
        print(f"Foundations: {foundations}, Total Foundation Area: {total_foundation_area:.2f} sq meters")
        print(f"Slabs: {slabs}, Total Slab Area: {total_slab_area:.2f} sq meters")
        print(f"Total Floor Area: {total_slab_area:.2f} sq meters")
        print(f"Roofing Area: {roofing_area:.2f} sq meters")
        print(f"Total Area (Walls + Foundations + Slabs): {total_area:.2f} sq meters")

        # Wall Material Estimate
        bricks_needed = int(total_wall_area * BRICKS_PER_SQ_M * WASTE_FACTOR)
        mortar_volume = total_wall_area * MORTAR_PER_SQ_M * WASTE_FACTOR
        cement_needed_wall_kg = mortar_volume * MORTAR_MIX["cement"]
        cement_needed_wall_bags = cement_needed_wall_kg / 50
        sand_needed_wall_cubic_m = mortar_volume * (MORTAR_MIX["sand"] / SAND_DENSITY)

        print("\nWall Material Estimate (Including 30% Waste):")
        print(f"Estimated bricks required: {bricks_needed}")
        print(f"Estimated cement required: {cement_needed_wall_bags:.2f} bags (50 kg each, {cement_needed_wall_kg:.2f} kg)")
        print(f"Estimated sand required: {sand_needed_wall_cubic_m:.2f} cubic meters")

        # Foundation Material Estimate
        foundation_volume = total_foundation_area * FOUNDATION_DEPTH * WASTE_FACTOR
        cement_needed_foundation = foundation_volume * CONCRETE_MIX["cement"]
        cement_needed_foundation_bags = cement_needed_foundation / 50
        gravel_needed_foundation_cubic_m = foundation_volume * (CONCRETE_MIX["gravel"] / GRAVEL_DENSITY)
        sand_needed_foundation_cubic_m = foundation_volume * (CONCRETE_MIX["sand"] / SAND_DENSITY)
        steel_needed_foundation = foundation_volume * STEEL_FOUNDATION_RATIO

        print("\nFoundation Material Estimate (Including 30% Waste):")
        print(f"Estimated concrete volume: {foundation_volume:.2f} cubic meters")
        print(f"Estimated cement required: {cement_needed_foundation_bags:.2f} bags (50 kg each, {cement_needed_foundation:.2f} kg)")
        print(f"Estimated gravel required: {gravel_needed_foundation_cubic_m:.2f} cubic meters")
        print(f"Estimated sand required: {sand_needed_foundation_cubic_m:.2f} cubic meters")
        print(f"Estimated steel required: {steel_needed_foundation:.2f} kg")

        # Slab Material Estimate
        slab_volume = total_slab_area * SLAB_THICKNESS * WASTE_FACTOR
        cement_needed_slab = slab_volume * CONCRETE_MIX["cement"]
        cement_needed_slab_bags = cement_needed_slab / 50
        gravel_needed_slab_cubic_m = slab_volume * (CONCRETE_MIX["gravel"] / GRAVEL_DENSITY)
        sand_needed_slab_cubic_m = slab_volume * (CONCRETE_MIX["sand"] / SAND_DENSITY)
        steel_needed_slab = slab_volume * STEEL_SLAB_RATIO

        print("\nSlab Material Estimate (Including 30% Waste):")
        print(f"Estimated concrete volume: {slab_volume:.2f} cubic meters")
        print(f"Estimated cement required: {cement_needed_slab_bags:.2f} bags (50 kg each, {cement_needed_slab:.2f} kg)")
        print(f"Estimated gravel required: {gravel_needed_slab_cubic_m:.2f} cubic meters")
        print(f"Estimated sand required: {sand_needed_slab_cubic_m:.2f} cubic meters")
        print(f"Estimated steel required: {steel_needed_slab:.2f} kg")

        # Plaster Material Estimate
        plaster_cement_needed_kg = total_wall_area * PLASTER_CEMENT_RATE * WASTE_FACTOR
        plaster_cement_bags = plaster_cement_needed_kg / 25

        print("\nPlaster Material Estimate (Including 30% Waste):")
        print(f"Estimated cement required: {plaster_cement_bags:.2f} bags (25 kg each, {plaster_cement_needed_kg:.2f} kg)")

        # Primer Material Estimate
        primer_needed = total_wall_area * PRIMER_RATE * PRIMER_COATS * WASTE_FACTOR

        print("\nPrimer Material Estimate (Including 30% Waste):")
        print(f"Estimated Amount of Primer: {primer_needed:.2f} liters ({PRIMER_COATS} coats)")

        # Paint Material Estimate
        paint_needed = total_wall_area * PAINT_RATE * PAINT_COATS * WASTE_FACTOR

        print("\nPaint Material Estimate (Including 30% Waste):")
        print(f"Estimated Amount of Paint: {paint_needed:.2f} liters ({PAINT_COATS} coats)")

        # Roofing Material Estimate
        print("\nRoofing Material Estimate (Including 30% Waste):")

        # Floor Tiling Estimate      #nikitha
        floor_area = total_slab_area
        

        # Collect all results in a dictionary
        results = {
            "Summary": {
                "Walls": walls,
                "Total Wall Area": total_wall_area,
                "Detected Doors": doors,
                "Detected Windows": windows,
                "Foundations": foundations,
                "Total Foundation Area": total_foundation_area,
                "Slabs": slabs,
                "Total Slab Area": total_slab_area,
                "Total Floor Area": total_slab_area,
                "Roofing Area": roofing_area,
                "Total Area (Walls + Foundations + Slabs)": total_area
            },
            "Wall Material Estimate (Including 30% Waste)": {
                "Estimated bricks required": bricks_needed,
                "Estimated cement required": {
                    "bags": cement_needed_wall_bags,
                    "kg": cement_needed_wall_kg
                },
                "Estimated sand required": sand_needed_wall_cubic_m
            },
            "Foundation Material Estimate (Including 30% Waste)": {
                "Estimated concrete volume": foundation_volume,
                "Estimated cement required": {
                    "bags": cement_needed_foundation_bags,
                    "kg": cement_needed_foundation
                },
                "Estimated gravel required": gravel_needed_foundation_cubic_m,
                "Estimated sand required": sand_needed_foundation_cubic_m,
                "Estimated steel required": steel_needed_foundation
            },
            "Slab Material Estimate (Including 30% Waste)": {
                "Estimated concrete volume": slab_volume,
                "Estimated cement required": {
                    "bags": cement_needed_slab_bags,
                    "kg": cement_needed_slab
                },
                "Estimated gravel required": gravel_needed_slab_cubic_m,
                "Estimated sand required": sand_needed_slab_cubic_m,
                "Estimated steel required": steel_needed_slab
            },
            "Plaster Material Estimate (Including 30% Waste)": {
                "Estimated cement required": {
                    "bags": plaster_cement_bags,
                    "kg": plaster_cement_needed_kg
                }
            },
            "Primer Material Estimate (Including 30% Waste)": {
                "Estimated Amount of Primer": primer_needed
            },
            "Paint Material Estimate (Including 30% Waste)": {
                "Estimated Amount of Paint": paint_needed
            },
            "Roofing Material Estimate (Including 30% Waste)": {
                "Roofing Area": roofing_area
            },
            "Floor Tiling Estimate (Including 30% Waste)": floor_tiling_estimate
        }
        
        output_path = "output.json"
        save_results_to_json(results, output_path)
        
    except FileNotFoundError:  #nikitha
        
        
# Main execution point
if __name__ == "__main__":
    process_dxf_file(FILE_PATH)