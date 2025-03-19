import ezdxf
import math
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File path to the DXF file
FILE_PATH = r"C:\Users\atcha\OneDrive\Desktop\DXF FILE\Floor plan.dxf"

# Layer names for detection
WALL_LAYER = "xref-Bishop-Overland-08$0$A-WALL"
FOUNDATION_LAYERS = ["xref-Bishop-Overland-08$0$S-FOOTER", "xref-Bishop-Overland-08$0$S-STEM-WALL"]
SLAB_LAYER = "xref-Bishop-Overland-08$0$S-SLAB"

# Labels for identifying components
DOOR_LABELS = ["D1", "D2", "RSD", "DOOR"]
WINDOW_LABELS = ["FW", "W1", "SW", "FL", "WINDOW"]

# Configurable parameters
WALL_HEIGHT = 2.4  # meters
WALL_THICKNESS = 0.23  # meters (standard brick wall)
FOUNDATION_DEPTH = 0.3  # meters
SLAB_THICKNESS = 0.15  # meters
WASTE_FACTOR = 1.3  # 10% waste allowance

# Material ratios
BRICKS_PER_SQ_M = 50  # bricks/m² for 230 mm wall
MORTAR_PER_SQ_M = 0.025  # m³/m² for brickwork
CONCRETE_MIX = {"cement": 320, "sand": 640, "gravel": 960}  # kg/m³ (1:2:3 mix)
CONCRETE_DENSITY = sum(CONCRETE_MIX.values())  # ~1920 kg/m³, adjust to 2400 kg/m³
STEEL_SLAB_RATIO = 65  # kg/m³
STEEL_FOUNDATION_RATIO = 100  # kg/m³
SAND_DENSITY = 1600  # kg/m³
GRAVEL_DENSITY = 1500  # kg/m³
PLASTER_THICKNESS = 0.015  # meters
PLASTER_CEMENT_RATE = 4.5  # kg/m² (1:3 mix)
PLASTER_SAND_RATE = 13.5  # kg/m²
PRIMER_RATE = 0.12  # L/m²
PAINT_RATE = 0.1  # L/m² per coat
PAINT_COATS = 2

def calculate_area(entity, unit_factor=1.0):
    """Calculate the area of a given entity."""
    try:
        dxftype = entity.dxftype()
        if dxftype == 'LWPOLYLINE' and entity.is_closed and hasattr(entity, 'get_area'):
            return entity.get_area() * unit_factor**2
        elif dxftype == 'CIRCLE' and hasattr(entity.dxf, 'radius'):
            return math.pi * (entity.dxf.radius ** 2) * unit_factor**2
        elif dxftype == 'HATCH' and hasattr(entity, 'paths'):
            area = sum(path.area for path in entity.paths if hasattr(path, 'area')) * unit_factor**2
            if area > 0:
                return area
        elif dxftype == 'LINE':
            start = entity.dxf.start
            end = entity.dxf.end
            length = math.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2) * unit_factor
            return length * WALL_HEIGHT
        elif dxftype == 'POLYLINE' and entity.is_closed:
            points = [pt[:2] for pt in entity.points()]
            area = 0.5 * abs(sum(
                points[i][0] * points[(i + 1) % len(points)][1] -
                points[(i + 1) % len(points)][0] * points[i][1]
                for i in range(len(points))
            )) * unit_factor**2
            return area
        elif dxftype == 'SPLINE' and entity.closed:
            points = [entity.approximate(i / 100)[:2] for i in range(101)]
            area = 0.5 * abs(sum(
                points[i][0] * points[(i + 1) % len(points)][1] -
                points[(i + 1) % len(points)][0] * points[i][1]
                for i in range(len(points))
            )) * unit_factor**2
            return area
        elif dxftype == 'ARC':
            r = entity.dxf.radius * unit_factor
            angle = entity.dxf.end_angle - entity.dxf.start_angle
            if angle < 0:
                angle += 360
            return 0.5 * r**2 * math.radians(angle)
        logger.debug(f"Unsupported entity type or no area: {dxftype}")
        return 0.0
    except Exception as e:
        logger.warning(f"Error calculating area for {dxftype}: {e}")
        return 0.0

def infer_material(entity):
    """Infer material type with case-insensitive matching."""
    layer_name = entity.dxf.layer.lower()
    if "wall" in layer_name:
        return "WALL"
    elif any(label.lower() in layer_name for label in DOOR_LABELS):
        return "DOOR"
    elif any(label.lower() in layer_name for label in WINDOW_LABELS):
        return "WINDOW"
    if entity.dxftype() in ['TEXT', 'MTEXT']:
        text = entity.dxf.text.lower()
        if any(label.lower() in text for label in DOOR_LABELS):
            return "DOOR"
        elif any(label.lower() in text for label in WINDOW_LABELS):
            return "WINDOW"
    return None

def process_dxf_file(file_path):
    """Process the DXF file and calculate material estimates."""
    try:
        doc = ezdxf.readfile(file_path)
        msp = doc.modelspace()
        units = doc.header.get('$INSUNITS', 4)  # Default to meters
        unit_factor = 1.0 if units == 4 else 0.0254 if units == 1 else 1.0
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return
    except ezdxf.DXFStructureError as e:
        print(f"Error: Invalid DXF file structure - {e}")
        return

    walls, doors, windows, foundations, slabs = 0, 0, 0, 0, 0
    total_wall_area, total_foundation_area, total_slab_area = 0.0, 0.0, 0.0

    for entity in msp:
        layer = entity.dxf.layer
        area = calculate_area(entity, unit_factor)
        material = infer_material(entity)
        if layer == WALL_LAYER or material == "WALL":
            walls += 1
            total_wall_area += area
        elif layer in FOUNDATION_LAYERS:
            foundations += 1
            total_foundation_area += area
        elif layer == SLAB_LAYER:
            slabs += 1
            total_slab_area += area
        elif material == "DOOR":
            doors += 1
        elif material == "WINDOW":
            windows += 1
        else:
            logger.debug(f"Entity on layer '{layer}' not categorized")

    total_area = total_wall_area + total_foundation_area + total_slab_area
    print("Summary:")
    print(f"Walls: {walls}, Total Wall Area: {total_wall_area:.2f} sq meters")
    print(f"Detected Doors: {doors}")
    print(f"Detected Windows: {windows}")
    print(f"Foundations: {foundations}, Total Foundation Area: {total_foundation_area:.2f} sq meters")
    print(f"Slabs: {slabs}, Total Slab Area: {total_slab_area:.2f} sq meters")
    print(f"Total Area (Walls + Foundations + Slabs): {total_area:.2f} sq meters")

    # Wall Material Estimate
    bricks_needed = int(total_wall_area * BRICKS_PER_SQ_M * WASTE_FACTOR)
    mortar_volume = total_wall_area * MORTAR_PER_SQ_M * WASTE_FACTOR
    cement_needed_wall_kg = mortar_volume * CONCRETE_MIX["cement"] * (2400 / CONCRETE_DENSITY)
    cement_needed_wall_bags = cement_needed_wall_kg / 50
    sand_needed_wall_cubic_m = mortar_volume * CONCRETE_MIX["sand"] * (2400 / CONCRETE_DENSITY) / SAND_DENSITY

    print("\nWall Material Estimate (Including 10% Waste):")
    print(f"Estimated bricks required: {bricks_needed}")
    print(f"Estimated cement required: {cement_needed_wall_bags:.2f} bags (50 kg each, {cement_needed_wall_kg:.2f} kg)")
    print(f"Estimated sand required: {sand_needed_wall_cubic_m:.2f} cubic meters")

    # Foundation Material Estimate
    foundation_volume = total_foundation_area * FOUNDATION_DEPTH * WASTE_FACTOR
    cement_needed_foundation = foundation_volume * CONCRETE_MIX["cement"] * (2400 / CONCRETE_DENSITY)
    cement_needed_foundation_bags = cement_needed_foundation / 50
    gravel_needed_foundation_cubic_m = foundation_volume * CONCRETE_MIX["gravel"] * (2400 / CONCRETE_DENSITY) / GRAVEL_DENSITY
    sand_needed_foundation_cubic_m = foundation_volume * CONCRETE_MIX["sand"] * (2400 / CONCRETE_DENSITY) / SAND_DENSITY
    steel_needed_foundation = foundation_volume * STEEL_FOUNDATION_RATIO

    print("\nFoundation Material Estimate (Including 10% Waste):")
    print(f"Estimated concrete volume: {foundation_volume:.2f} cubic meters")
    print(f"Estimated cement required: {cement_needed_foundation_bags:.2f} bags (50 kg each, {cement_needed_foundation:.2f} kg)")
    print(f"Estimated gravel required: {gravel_needed_foundation_cubic_m:.2f} cubic meters")
    print(f"Estimated sand required: {sand_needed_foundation_cubic_m:.2f} cubic meters")
    print(f"Estimated steel required: {steel_needed_foundation:.2f} kg")

    # Slab Material Estimate
    slab_volume = total_slab_area * SLAB_THICKNESS * WASTE_FACTOR
    cement_needed_slab = slab_volume * CONCRETE_MIX["cement"] * (2400 / CONCRETE_DENSITY)
    cement_needed_slab_bags = cement_needed_slab / 50
    gravel_needed_slab_cubic_m = slab_volume * CONCRETE_MIX["gravel"] * (2400 / CONCRETE_DENSITY) / GRAVEL_DENSITY
    sand_needed_slab_cubic_m = slab_volume * CONCRETE_MIX["sand"] * (2400 / CONCRETE_DENSITY) / SAND_DENSITY
    steel_needed_slab = slab_volume * STEEL_SLAB_RATIO

    print("\nSlab Material Estimate (Including 10% Waste):")
    print(f"Estimated concrete volume: {slab_volume:.2f} cubic meters")
    print(f"Estimated cement required: {cement_needed_slab_bags:.2f} bags (50 kg each, {cement_needed_slab:.2f} kg)")
    print(f"Estimated gravel required: {gravel_needed_slab_cubic_m:.2f} cubic meters")
    print(f"Estimated sand required: {sand_needed_slab_cubic_m:.2f} cubic meters")
    print(f"Estimated steel required: {steel_needed_slab:.2f} kg")

    # Plaster Material Estimate
    plaster_cement_needed_kg = total_wall_area * PLASTER_CEMENT_RATE * WASTE_FACTOR
    plaster_bags = plaster_cement_needed_kg / 25
    plaster_sand_cubic_m = total_wall_area * PLASTER_SAND_RATE * WASTE_FACTOR / SAND_DENSITY

    print("\nPlaster Material Estimate (Including 10% Waste):")
    print(f"Estimated cement required: {plaster_bags:.2f} bags (25 kg each, {plaster_cement_needed_kg:.2f} kg)")
    print(f"Estimated sand required: {plaster_sand_cubic_m:.2f} cubic meters")

    # Primer Material Estimate
    primer_needed = total_wall_area * PRIMER_RATE * WASTE_FACTOR

    print("\nPrimer Material Estimate (Including 10% Waste):")
    print(f"Estimated Amount of Primer: {primer_needed:.2f} liters")

    # Paint Material Estimate
    paint_needed = total_wall_area * PAINT_RATE * PAINT_COATS * WASTE_FACTOR

    print("\nPaint Material Estimate (Including 10% Waste):")
    print(f"Estimated Amount of Paint: {paint_needed:.2f} liters ({PAINT_COATS} coats)")

process_dxf_file(FILE_PATH)