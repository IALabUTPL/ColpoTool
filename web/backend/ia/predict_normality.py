# backend/ia/predict_normality.py

import random

def predict_normal_or_abnormal(image_path: str) -> str:
    """
    Simulación de predicción: devuelve 'normal' o 'anormal'.
    En futuro puede cargarse un modelo real.
    """
    return random.choice(["normal", "anormal"])
