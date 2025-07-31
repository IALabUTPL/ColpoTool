import os
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors
from reportlab.lib.units import cm
from backend.db.queries import get_full_exam_data
from datetime import datetime
from io import BytesIO
import json
from uuid import UUID
from decimal import Decimal

# Función principal
def generate_colposcopy_report(exam_id, output_path='colposcopy_report.pdf'):
    # Obtener los datos completos del 
    data = {
    "exam": {
        "exam_date": "2025-07-07",
        "record_code": "P-001",
        "ccv_history": "No hay antecedentes",
        "examIndication": "Dolor pélvico persistente",
        "fur": "2025-06-01",
        "ets": "Ninguna conocida",
        "has_ets": False,
        "recent_sex": False,
        "contraceptive_method": "Oral",
        "prior_diagnosis": "Ninguna",
        "pap_done": True,
        "pap_date": "2025-06-15",
        "pap_result": "Negativo",
    },
    "images": [
        { "url": "Backend/Exams/1012c349-1ed9-4719-b551-79b53ff6217a/P001_EXAM1_IMG001.jpg" },
        { "url": "Backend/Exams/1012c349-1ed9-4719-b551-79b53ff6217a/P001_EXAM1_IMG002.jpg" }
    ],
    "lesions": [
        {
            "lesion_type": "Área blanca gruesa",
            "severity_level": "Moderada",
            "image_url": "Backend/Exams/1012c349-1ed9-4719-b551-79b53ff6217a/P001_EXAM1_IMG001.jpg"
        }
    ],
    "swede": {
        "acetowhite": "2",
        "borders": "1",
        "vessels": "0",
        "iodine": "1",
        "lesion_size": "2",
        "total_score": "6"
    }
}

    data = get_full_exam_data(exam_id)
    birth_date_str = data["patient"].get("birth_date")
    if birth_date_str:
        try:
            birth_date = datetime.strptime(birth_date_str[:10], "%Y-%m-%d")
            today = datetime.today()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        except Exception as e:
            age = "N/D"
    else:
        age = "N/D"
    # Crear documento PDF
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=1.5 * cm, leftMargin=1.5 * cm,
                            topMargin=1.5 * cm, bottomMargin=1.5 * cm)

    elements = []

    # Estilos de texto
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CenterTitle', alignment=TA_CENTER, fontSize=14, spaceAfter=10))
    styles.add(ParagraphStyle(name='BlockTitle', alignment=TA_LEFT, fontSize=12, spaceAfter=6, textColor=colors.HexColor('#002942')))
    styles.add(ParagraphStyle(name='SubLabel', alignment=TA_LEFT, fontSize=10, spaceAfter=2))
    styles.add(ParagraphStyle(name='TextSmall', alignment=TA_LEFT, fontSize=9))
    styles.add(ParagraphStyle(name='Small', alignment=TA_LEFT, fontSize=9))  # ✅ Línea esencial

    # Aquí continuarás agregando los bloques del reporte...

    def build_table(data, colWidths=None):
        table = Table(data, colWidths=colWidths)
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ]))
        return table

    # 1. TÍTULO
    elements.append(Paragraph("REPORTE COLPOSCÓPICO DIGITAL — ColpoTool", styles['CenterTitle']))
    elements.append(Spacer(1, 12))

    # 2. DATOS GENERALES (3 columnas)
    info_1 = [
        ["Fecha del Examen:", data["exam"]["date"]],
        ["Código del Examen:", data["exam"]["id"]],
        ["Código del Paciente:", data["patient"]["record_code"]],
        ["Nombre del Paciente:", f"{data['patient']['first_name']} {data['patient']['last_name']}"],
        ["Edad:", age],
        ["Cédula:", data["patient"]["dni"]],
        ["Teléfono:", data["patient"]["phone"]],
        ["Dirección:", data["patient"]["address"]],
    ]
    elements.append(build_table(info_1, [6*cm, 10*cm]))


    elements.append(Paragraph("Datos Generales", styles["BlockTitle"]))
    elements.append(build_table(info_1, [5*cm, 4*cm, 5*cm, 2*cm, 3*cm]))
    elements.append(Spacer(1, 8))

    # (Continuará con cada bloque en la siguiente respuesta)
    # 2. INFORMACIÓN PERSONAL DEL PACIENTE
    info_paciente = [
        ["Ocupación:", data["clinical"]["occupation"]],
        ["Estado civil:", data["clinical"]["marital_status"]],
        ["Nivel de instrucción:", data["clinical"]["education_level"]],
        ["Ingreso familiar:", data["clinical"]["family_income"]],
    ]
    elements.append(build_table(info_paciente, [6*cm, 12*cm]))

    elements.append(Paragraph("Datos del Paciente", styles["BlockTitle"]))
    elements.append(build_table(info_paciente, [5*cm, 4*cm, 5*cm, 4*cm, 2*cm]))
    elements.append(Spacer(1, 8))
    # 3. INFORMACIÓN CLÍNICA GENERAL
    bmi = round(float(data["clinical"]["weight"]) / ((float(data["clinical"]["height"]) / 100) ** 2), 2) if data["clinical"]["height"] else "N/A"
    info_clinica = [
        ["Peso (kg):", data["clinical"]["weight"]],
        ["Talla (cm):", data["clinical"]["height"]],
        ["IMC:", str(bmi)],
        ["Presión Arterial:", data["clinical"]["blood_pressure"]],
        ["Grupo Sanguíneo:", data["clinical"]["blood_type"]],
        ["Participa en detección temprana:", "Sí" if data["clinical"]["early_detection"] else "No"],
        ["Diagnóstico previo de CaCU:", "Sí" if data["clinical"]["prior_cc_diagnosis"] else "No"]
    ]
    elements.append(build_table(info_clinica, [6*cm, 10*cm]))

    elements.append(Paragraph("Historial Clínico General", styles["BlockTitle"]))
    elements.append(build_table(info_clinica, [5*cm, 4*cm, 5*cm, 4*cm, 2*cm]))
    elements.append(Spacer(1, 8))
    # 4. HISTORIA GINECOLÓGICA
    gineco = [
        ["Menarquia:", data["clinical"]["menarche_age"], 
        "Inicio vida sexual:", data["clinical"]["age_sex_start"], 
        "N° parejas sexuales:", data["clinical"]["sexual_partners"]],
        ["Duración ciclo menstrual:", data["clinical"]["cycle_days"],
        "Embarazos (G):", data["clinical"]["g"], 
        "Partos (P):", data["clinical"]["p"]],
        ["Abortos (A):", data["clinical"]["a"], 
        "Uso de anticonceptivos:", "Sí" if data["clinical"]["uses_contraceptives"] else "No",
        "Tipo:", data["clinical"]["contraceptive_type"]],
        ["Vida sexual activa:", "Sí" if data["clinical"]["sexual_activity"] else "No", 
        "Vacunación VPH:", "Sí" if data["clinical"]["vaccinated_hpv"] else "No", ""],
        ["Alcohol:", "Sí" if data["clinical"]["alcohol"] else "No", 
        "Tabaco:", "Sí" if data["clinical"]["smoking"] else "No", 
        "Ejercicio:", "Sí" if data["clinical"]["active_life"] else "No"]
    ]
    elements.append(Paragraph("Información Ginecológica y Sexual", styles["BlockTitle"]))
    elements.append(build_table(gineco, [5*cm, 3*cm, 5*cm, 3*cm, 2*cm]))
    elements.append(Spacer(1, 8))

    # 5. INFORMACIÓN DEL EXAMEN COLPOSCÓPICO
    exam = [
        ["Fecha del Examen:", data["exam"]["date"], 
        "FUR:", data["exam"]["fur"], 
        "ETS:", "Sí" if data["exam"]["has_ets"] else "No"],
        # ["Tipo de ETS:", "No registrado", "Relaciones recientes:", "Sí" if data["exam"]["recent_sex"] else "No", ""],  # No existe ese campo, solo puedes mostrar "No registrado" o dejarlo vacío
        ["Relaciones recientes:", "Sí" if data["exam"]["recent_sex"] else "No", "", "", ""],
        ["Motivo de referencia:", data["exam"]["referral_reason"], "", "", "", ""],
        ["Detalle del motivo:", data["exam"]["referral_detail"], "", "", "", ""],
        ["PAP realizado:", "Sí" if data["exam"]["pap_done"] else "No", 
        "Fecha:", data["exam"]["pap_date"], 
        "Resultado:", data["exam"]["pap_result"] or "No aplica"]
    ]
    elements.append(Paragraph("Datos del Examen Actual", styles["BlockTitle"]))
    elements.append(build_table(exam, [5*cm, 4*cm, 5*cm, 4*cm, 2*cm]))
    elements.append(Spacer(1, 8))

    # 6. GALERÍA DE IMÁGENES COLPOSCÓPICAS
    elements.append(Paragraph("Registro Visual del Examen", styles["BlockTitle"]))

    for image in data["images"]:
        original_path = image["url"]
        segmented_path = image["segmented_url"]
        image_type = image["type"]
        uploaded_at = image["uploaded_at"]

        # Título de la imagen
        elements.append(Paragraph(f"Tipo: {image_type} — Fecha: {uploaded_at}", styles["Small"]))

        # Tabla con imagen original y segmentada
        image_row = []

        if os.path.exists(original_path):
            image_row.append(Image(original_path, width=6*cm, height=6*cm))
        else:
            image_row.append(Paragraph("Imagen no disponible", styles["Small"]))

        if segmented_path and os.path.exists(segmented_path):
            image_row.append(Image(segmented_path, width=6*cm, height=6*cm))
        else:
            image_row.append(Paragraph("Segmentación no disponible", styles["Small"]))

        elements.append(Table([image_row], colWidths=[7*cm, 7*cm], hAlign="LEFT"))
        elements.append(Spacer(1, 12))
    #🧪 7. HALLAZGOS COLPOSCÓPICOS MANUALES
    elements.append(Paragraph("Evaluación Visual Clínica", styles["BlockTitle"]))

    findings = data["findings"]

    manual_table = [
        ["Hallazgos normales:", "Sí" if findings["normal_findings"] else "No"],
        ["Epitelio escamoso original:", "Sí" if findings["squamous_epithelium"] else "No"],
        ["Epitelio columnar:", "Sí" if findings["columnar_epithelium"] else "No"],
        ["Zona de transformación normal:", "Sí" if findings["normal_transformation_zone"] else "No"],
        ["Cambios menores:", ", ".join(findings["minor_changes"]) or "Ninguno"],
        ["Cambios mayores:", ", ".join(findings["major_changes"]) or "Ninguno"],
        ["Prueba de yodo:", ", ".join(findings["iodine_test"]) or "Ninguno"],
        ["Colposcopia satisfactoria:", findings["satisfactory_exam"]],
        ["Topografía de la lesión:", findings["lesion_topography"]],
        ["Hallazgos misceláneos:", findings["miscellaneous"]],
        ["Impresión diagnóstica manual:", findings["manual_diagnosis"]]
    ]
    elements.append(build_table(manual_table, [8*cm, 8*cm]))
    elements.append(Spacer(1, 8))
# 🔍 9. INFORME VISUAL DE LESIONES DETECTADAS POR IA
    def default_serializer(obj):
        if isinstance(obj, UUID):
            return str(obj)
        raise TypeError(f"Tipo no serializable: {type(obj)}")

    print("🔎 Data recibida en generate_colposcopy_report:")
    print(json.dumps(data, indent=2, ensure_ascii=False, default=lambda o: str(o)))
      
    lesions = data.get("lesions", [])

    if not lesions:
        elements.append(Paragraph("No se han detectado lesiones en este examen.", styles["Normal"]))
        elements.append(Spacer(1, 8))
    else:
        for idx, lesion in enumerate(lesions, start=1):
            elements.append(Paragraph(f"Lesión {idx}", styles["BlockTitle"]))

            # Tabla con tipo y severidad
            lesion_table = [
                ["Tipo de lesión:", Paragraph(lesion["lesion_type"], styles["Normal"])],
                ["Nivel de severidad:", Paragraph(lesion["severity_level"], styles["Normal"])]
            ]
            elements.append(build_table(lesion_table, [6 * cm, 10 * cm]))
            elements.append(Spacer(1, 4))

            # Imágenes (original y segmentada si existe)
            image_row = []

            original_path = lesion.get("image_url", "")
            if original_path and os.path.exists(original_path):
                image_row.append(Image(original_path, width=6 * cm, height=6 * cm))
            else:
                image_row.append(Paragraph("Imagen original no disponible", styles["Small"]))

            # Imagen segmentada con sufijo -s
            segmented_path = ""
            if original_path.endswith(".jpg"):
                segmented_path = original_path.replace(".jpg", "-s.jpg")
            elif original_path.endswith(".png"):
                segmented_path = original_path.replace(".png", "-s.png")

            if segmented_path and os.path.exists(segmented_path):
                image_row.append(Image(segmented_path, width=6 * cm, height=6 * cm))
            else:
                image_row.append(Paragraph("Imagen segmentada no disponible", styles["Small"]))

            # 👇 Verifica que todos los objetos son válidos antes de meterlos a la tabla
            assert all(not isinstance(x, str) for x in image_row), f"Error: image_row contiene string: {image_row}"

            elements.append(Table([image_row], colWidths=[7 * cm, 7 * cm]))
            elements.append(Spacer(1, 12))

# 🧮 10. ESCALA SWEDE

    elements.append(Paragraph("Evaluación con Escala Swede", styles["BlockTitle"]))

    swede = data.get("swede_score")

    if swede:
        swede_table = [
            ["Criterio", "Puntaje"],
            ["Epitelio acetoblanco", swede["score_aceto"]],
            ["Márgenes", swede["score_margin"]],
            ["Vasos atípicos", swede["score_vessels"]],
            ["Test de yodo", swede["score_iodine"]],
            ["Tamaño de la lesión", swede["score_size"]],
            ["Total", swede["total_score"]],
            ["Interpretación", swede.get("interpretation", "No calculada")]
        ]
        elements.append(build_table(swede_table, [10*cm, 6*cm]))
    else:
        elements.append(Paragraph("No se han registrado puntuaciones Swede para este examen.", styles["Normal"]))

    elements.append(Spacer(1, 8))

# 📊 11. ANÁLISIS DE RIESGO

    elements.append(Paragraph("Predicción de Riesgo Multivariable", styles["BlockTitle"]))

    risk = data.get("risk_prediction")

    if risk:
        risk_table = [
            ["Modelo utilizado:", risk["model"]],
            ["Nivel de riesgo:", risk["risk_level"]],
            ["Confianza estimada:", f"{risk['confidence']}%"],
            ["Fecha de evaluación:", risk["created_at"]]
        ]
        elements.append(build_table(risk_table, [6*cm, 10*cm]))
    else:
        elements.append(Paragraph("No se han registrado factores de riesgo para este paciente.", styles["Normal"]))

    elements.append(Spacer(1, 8))

#📈 12. MÉTRICAS DE PREDICCIÓN (opcional)

    if data.get("metrics"):
        elements.append(Paragraph("Datos Técnicos del Modelo", styles["BlockTitle"]))

        metrics = data["metrics"]
        metrics_table = [
            ["Precisión", metrics["precision"]],
            ["Recall", metrics["recall"]],
            ["F1-Score", metrics["f1"]],
            ["Confianza media", f'{metrics["avg_confidence"]}%'],
            ["Fuente del modelo", metrics["source"]],
            ["Fecha de entrenamiento", metrics["trained_on"]],
        ]
        elements.append(build_table(metrics_table, [6*cm, 10*cm]))
        elements.append(Spacer(1, 8))
#📝 13. CONCLUSIÓN Y PLAN MÉDICO
    elements.append(Paragraph("Resumen Clínico y Plan Médico", styles["BlockTitle"]))

    plan = data["clinical_plan"]

    plan_table = [
    ["Diagnóstico final colposcópico:", Paragraph(plan["diagnosis"], styles["Normal"])],
    ["Procedimientos recomendados:", Paragraph(", ".join(plan["procedures"]), styles["Normal"])],
    ["Recomendaciones médicas:", Paragraph(", ".join(plan["recommendations"]), styles["Normal"])],
    ["Seguimiento sugerido:", Paragraph(plan["follow_up"], styles["Normal"])],
    ["Examinador:", Paragraph(f'{plan["examiner"]} — Código: {plan["code"]}', styles["Normal"])],
]
    elements.append(build_table(plan_table, [6*cm, 10*cm]))
    elements.append(Spacer(1, 12))

    doc.build(elements)
    buffer.seek(0)
    return buffer
