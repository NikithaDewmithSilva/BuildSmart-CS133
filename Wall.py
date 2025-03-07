import ezdxf
import math

# Change to your file path
file_path = r"C:\Users\atcha\OneDrive\Desktop\3-Bedroom-Square-House.dxf"
doc = ezdxf.readfile(file_path)
msp = doc.modelspace()

# Initialize counters
wall_count = 0
total_wall_area = 0

# Function to determine if an entity is a wall
def is_wall(entity):
    """Check if an entity represents a wall based on its layer name."""
    if hasattr(entity, 'dxf') and hasattr(entity.dxf, 'layer'):
        layer_name = entity.dxf.layer.upper()
        return "WALL" in layer_name  # Assumes wall layers are named with "WALL"
    return False

# Function to calculate the area of a closed polyline
def polyline_area(entity):
    """Calculate the area of a closed polyline wall."""
    if entity.is_closed:
        try:
            return entity.area  # Directly supported in ezdxf
        except Exception as e:
            print(f"Error calculating polyline area: {e}")
            return 0
    return 0

# Function to estimate the area of a wall represented by lines
def estimate_wall_area(line1, line2):
    """Estimate the area of a wall from two parallel lines."""
    try:
        x1, y1 = line1.dxf.start.x, line1.dxf.start.y
        x2, y2 = line1.dxf.end.x, line1.dxf.end.y
        x3, y3 = line2.dxf.start.x, line2.dxf.start.y
        x4, y4 = line2.dxf.end.x, line2.dxf.end.y

        # Calculate lengths of the lines
        length1 = math.sqrt((x2 - x1) * 2 + (y2 - y1) * 2)
        length2 = math.sqrt((x4 - x3) * 2 + (y4 - y3) * 2)
        
        # Assume walls are rectangular: take the shorter length as width
        wall_length = min(length1, length2)
        
        # Calculate the perpendicular distance (wall thickness)
        wall_thickness = abs(x1 - x3) + abs(y1 - y3)
        
        return wall_length * wall_thickness  # Approximate area
    except Exception as e:
        print(f"Error estimating wall area: {e}")
        return 0

# Function to calculate area of walls
def calculate_wall_area(entity):
    """Calculate the area of a given wall entity."""
    try:
        if entity.dxftype() == 'LWPOLYLINE':
            return polyline_area(entity)
        elif entity.dxftype() == 'HATCH':
            return sum(path.area for path in entity.paths if hasattr(path, 'area'))
        else:
            return 0  # Unsupported entity type
    except Exception as e:
        print(f"Error calculating area for {entity.dxftype()}: {e}")
        return 0

# Process entities in the model space
wall_lines = []  # Store line entities for estimating wall thickness
for entity in msp:
    if is_wall(entity):
        wall_count += 1
        if entity.dxftype() in ['LWPOLYLINE', 'HATCH']:
            area = calculate_wall_area(entity)
            total_wall_area += area
            print(f"Wall {wall_count}: Area = {area:.2f} sq units")
        elif entity.dxftype() == 'LINE':
            wall_lines.append(entity)  # Collect line entities for later area estimation

# Pair up line entities to estimate wall area
while len(wall_lines) >= 2:
    line1 = wall_lines.pop(0)
    line2 = wall_lines.pop(0)
    area = estimate_wall_area(line1, line2)
    total_wall_area += area
    print(f"Estimated Wall Area from Lines: {area:.2f} sq units")

# Print results
print(f"Number of Walls: {wall_count}")
print(f"Total Wall Area: {total_wall_area:.2f} sq units")  # Units depend on the drawing scale