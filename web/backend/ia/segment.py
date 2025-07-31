import random
from typing import List, Dict

# Colores fijos asignados por tipo de región
COLOR_MAP = {
    "Acetoblanca": "#0000FF",       # azul
    "Puntillado": "#00FF00",        # verde
    "Mosaico": "#FFA500",           # naranja
    "Vasos atípicos": "#FF0000",    # rojo
    "Instrumento médico": "#800080" # púrpura
}

def generate_non_overlapping_polygon(existing_regions, x_max, y_max, size=30, max_attempts=30):
    """
    Genera un polígono aleatorio pequeño que no se solape significativamente con regiones existentes.
    """
    for _ in range(max_attempts):
        center_x = random.randint(size, x_max - size)
        center_y = random.randint(size, y_max - size)
        polygon = [
            [center_x + random.randint(-size, size), center_y + random.randint(-size, size)]
            for _ in range(random.randint(4, 7))
        ]
        too_close = False
        for region in existing_regions:
            for point in region["points"]:
                dist = ((point[0] - center_x) ** 2 + (point[1] - center_y) ** 2) ** 0.5
                if dist < size * 2:
                    too_close = True
                    break
            if too_close:
                break
        if not too_close:
            return polygon
    return None

def segment_image_minimal(image_path: str) -> Dict:
    """
    Simula segmentación de instrumentos y lesiones con coordenadas, etiquetas y color asociado.
    """
    print(f"[IA] Recibiendo imagen: {image_path}")

    img_width, img_height = 512, 512

    lesion_labels = ["Acetoblanca", "Puntillado", "Mosaico", "Vasos atípicos"]
    instrument_labels = ["Instrumento médico"]

    # Segmentaciones de instrumentos
    segment_regions = []
    for _ in range(random.randint(0, 2)):
        points = generate_non_overlapping_polygon(segment_regions, img_width, img_height, size=50)
        if points:
            label = random.choice(instrument_labels)
            segment_regions.append({
                "label": label,
                "points": points,
                "color": COLOR_MAP[label]
            })

    # Segmentaciones de lesiones
    lesion_regions = []
    selected_lesions = random.sample(lesion_labels, k=random.randint(1, len(lesion_labels)))
    for lesion in selected_lesions:
        num_regions = random.randint(1, 2)
        for _ in range(num_regions):
            points = generate_non_overlapping_polygon(lesion_regions + segment_regions, img_width, img_height, size=30)
            if points:
                lesion_regions.append({
                    "label": lesion,
                    "confidence": round(random.uniform(0.75, 0.99), 2),
                    "points": points,
                    "color": COLOR_MAP[lesion]
                })

    return {
        "status": "imagen_recibida",
        "segment_regions": segment_regions,
        "lesion_regions": lesion_regions
    }
