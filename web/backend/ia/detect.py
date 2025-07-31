import cv2
import numpy as np
import os
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator

def segment_image_with_sam(original_path):
    # Imprimir el inicio del proceso de segmentación
    print(f"[INFO] Recibiendo imagen para segmentar: {original_path}")
    
    # Cargar la imagen
    print("[INFO] Cargando la imagen...")
    img = cv2.imread(original_path)
    if img is None:
        print("[ERROR] No se pudo cargar la imagen.")
        raise FileNotFoundError(f"Image not found: {original_path}")
    
    # Imprimir la forma de la imagen cargada
    print(f"[INFO] Imagen cargada correctamente: shape={img.shape}")

    # Definir la ruta al modelo SAM
    sam_model_path = os.path.join(os.getcwd(), "web", "backend", "ia", "model_checkpoints", "sam_vit_b_01ec64.pth")
    print(f"[INFO] Ruta del modelo SAM: {sam_model_path}")
    
    # Inicializar el modelo SAM
    print("[INFO] Inicializando SAM...")
    sam = sam_model_registry.from_pretrained(sam_model_path)
    mask_generator = SamAutomaticMaskGenerator(sam)

    # Generar máscaras segmentadas para la imagen
    print("[INFO] Generando las máscaras con SAM...")
    try:
        masks = mask_generator.generate(img)
        print(f"[INFO] Se generaron {len(masks)} máscaras.")
    except Exception as e:
        print(f"[ERROR] Error al generar las máscaras: {e}")
        raise
    
    # Verifica si se generó alguna máscara
    if len(masks) == 0:
        print("[ERROR] No se generaron máscaras para la imagen.")
        return None

    # Tomar la primera máscara generada
    mask = masks[0]["segmentation"]
    print(f"[INFO] Se seleccionó la primera máscara generada.")
    
    # Convertir la máscara en una imagen binaria
    print("[INFO] Conviniendo la máscara a imagen binaria...")
    mask = (mask > 0.5).astype(np.uint8) * 255

    # Redimensionar la máscara al tamaño original de la imagen
    print("[INFO] Redimensionando la máscara al tamaño original de la imagen...")
    mask_resized = cv2.resize(mask, (img.shape[1], img.shape[0]))

    # Aplicar la máscara a la imagen original
    print("[INFO] Aplicando la máscara a la imagen original...")
    segmented = cv2.bitwise_and(img, img, mask=mask_resized)

    # Guardar la imagen segmentada con un sufijo '-segmented'
    folder, filename = os.path.split(original_path)
    name, ext = os.path.splitext(filename)
    seg_name = name + "-segmented" + ext
    seg_path = os.path.join(folder, seg_name)
    
    print(f"[INFO] Guardando la imagen segmentada en: {seg_path}")
    try:
        cv2.imwrite(seg_path, segmented)
        print(f"[INFO] Imagen segmentada guardada con éxito en: {seg_path}")
    except Exception as e:
        print(f"[ERROR] Error al guardar la imagen segmentada: {e}")
        raise

    # Devolver la ruta de la imagen segmentada
    return seg_path
