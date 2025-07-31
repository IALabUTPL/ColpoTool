import json
import hashlib
from datetime import datetime, timedelta

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken

from backend.db.railway_client import get_connection
from backend.db.queries import (
    get_user_by_username_and_password,
    get_all_patients,
    get_patient_detail,
    get_patient_by_uuid,
    insert_patient_with_clinical_info,
    insert_exam,
    delete_patient_by_id,
    count_users,
    count_patients,
    count_exams,
    count_lesions,
    count_predictions,
    count_models,
    clinical_factor_distribution,
    get_recent_exams,
    search_patients
)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
import os
import uuid
SECRET_KEY = 'colpotool_secret_key'


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({"error": "Debe ingresar usuario y contraseña"}, status=400)

            password_hash = hashlib.md5(password.encode()).hexdigest()
            user = get_user_by_username_and_password(username, password_hash)

            if user:
                class FakeUser:
                    def __init__(self, u):
                        self.id = u["codigo"]
                        self.username = u["username"]
                        self.email = u.get("email", "")
                        self.role_id = u.get("role_id")
                        self.is_authenticated = True

                fake_user = FakeUser(user)
                token = AccessToken.for_user(fake_user)
                token['role_id'] = user['role_id']

                return JsonResponse({
                    "message": "Login exitoso",
                    "token": str(token),
                    "user": user
                })

            return JsonResponse({"error": "Credenciales incorrectas"}, status=401)

        except Exception as e:
            return JsonResponse({"error": f"Error interno: {str(e)}"}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)


@api_view(['GET'])
def dashboard_view(request):
    return Response({
        "message": "Bienvenido al panel",
        "user": {
            "id": getattr(request.user, "id", None),
            "username": getattr(request.user, "username", None),
            "email": getattr(request.user, "email", None),
        }
    })


@api_view(['GET'])
def dashboard_metrics(request):
    result = {
        "users": count_users(),
        "patients": count_patients(),
        "exams": count_exams(),
        "lesions": count_lesions()
    }
    return Response(result)


@api_view(['GET'])
def dashboard_summary(request):
    try:
        total_patients = count_patients()
        total_exams = count_exams()
        total_predictions = count_predictions()
        total_models = count_models()
        clinical_stats = clinical_factor_distribution()
        recent_exams = get_recent_exams()

        total_clinical = sum([item["value"] for item in clinical_stats]) or 1
        for stat in clinical_stats:
            stat["percentage"] = round((stat["value"] / total_clinical) * 100, 1)

        return Response({
            "totalPatients": total_patients,
            "totalExams": total_exams,
            "totalPredictions": total_predictions,
            "totalModels": total_models,
            "clinicalStats": clinical_stats,
            "recentExams": recent_exams
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def index_view(request):
    return Response({"message": "ColpoTool backend funcionando correctamente"})


@api_view(['GET'])
def get_patients(request):
    try:
        patients = get_all_patients()
        return Response(patients)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_patient_by_id(request, id):
    try:
        patient = get_patient_detail(id)
        if patient:
            return Response(patient)
        else:
            return Response({"error": "Paciente no encontrado."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def search_patients_view(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return Response([], status=200)

    try:
        results = search_patients(query)
        return Response(results, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def create_patient(request):
    try:
        data = request.data
        patient_id = insert_patient_with_clinical_info(data)
        return Response({"message": "Paciente registrado correctamente", "id": patient_id}, status=201)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)



@api_view(['DELETE'])
def delete_patient(request, id):
    try:
        delete_patient_by_id(id)
        return Response({"message": "Paciente eliminado correctamente."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def create_exam(request):
    try:
        print("▶️ create_exam recibido")
        data = request.data
        patient_id = data.get("patient_id")
        
        # Llama a la función insert_exam y recibe el ID generado
        exam_id = insert_exam(data, patient_id)

        # Devuelve también el ID del examen al frontend
        return Response({
            "message": "Examen registrado correctamente.",
            "exam_id": exam_id
        }, status=201)
    except Exception as e:
        print(f"❌ ERROR EN EXAMEN: {e}")
        return Response({"error": str(e)}, status=500)


from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_patient_by_uuid_view(request, uuid):
    try:
        from backend.db.queries import get_patient_with_clinical_data, get_exams_by_patient_uuid

        patient = get_patient_with_clinical_data(uuid)
        if not patient:
            return Response({"error": "Paciente no encontrado"}, status=404)

        exams = get_exams_by_patient_uuid(uuid)
        patient["exams"] = exams

        return Response(patient, status=200)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


from rest_framework.decorators import api_view
from rest_framework.response import Response
import traceback

@api_view(['POST'])
def prepare_exam_image_path(request):
    try:
        data = request.data
        exam_id = data.get("exam_id")
        patient_code = data.get("patient_code")

        if not exam_id or not patient_code:
            return Response({"error": "Faltan exam_id o patient_code"}, status=400)

        # Crear carpeta si no existe
        exam_path = ensure_exam_folder_exists(exam_id)
        # Generar nombre de imagen
        image_name = get_next_image_name(exam_path, patient_code, exam_id)

        return Response({
            "folder": str(exam_path),
            "filename": image_name
        })

    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)

# backend/services/views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from backend.db.queries import insert_exam_image
import os

@csrf_exempt
def upload_exam_image(request):
    if request.method == "POST":
        exam_id = request.POST.get("exam_id")
        patient_code = request.POST.get("patient_code")
        file = request.FILES.get("image")

        if exam_id in [None, "", "undefined"] or patient_code in [None, "", "undefined"] or file is None:
            return JsonResponse({"error": "exam_id, patient_code o imagen inválidos"}, status=400)

        try:
            # Crear carpeta: /Exams/{exam_id}/
            folder_path = os.path.join(settings.MEDIA_ROOT, exam_id)
            os.makedirs(folder_path, exist_ok=True)

            # Contar imágenes existentes para generar nuevo índice
            existing_files = sorted([
                f for f in os.listdir(folder_path)
                if f.startswith(f"{patient_code}_IMG") and f.lower().endswith((".jpg", ".jpeg", ".png"))
            ])
            next_index = len(existing_files) + 1

            # Renombrar imagen: PXXX_IMGYYY.jpg
            filename = f"{patient_code}_IMG{next_index:03d}.jpg"
            file_path = os.path.join(folder_path, filename)

            # Guardar imagen físicamente
            with open(file_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            # Registrar URL relativa en base de datos
            relative_url = f"/exams/{exam_id}/{filename}"
            insert_exam_image(
                exam_id=exam_id,
                image_type="original",
                url=relative_url
            )

            return JsonResponse({"message": "Imagen subida correctamente", "filename": filename})

        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)



# backend/services/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend.db.queries import get_exam_details_by_id

from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend.db.queries import get_exam_details_by_id

@api_view(['GET'])
def get_exam_by_id(request, exam_id):
    try:
        exam = get_exam_details_by_id(exam_id)
        if exam:
            return Response(exam)
        else:
            return Response({"error": "Examen no encontrado."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
from django.http import JsonResponse
from backend.db.queries import get_exam_images_with_versions


@api_view(["GET"])
def get_exam_images_view(request, exam_id):
    try:
        from backend.db.queries import get_exam_images_with_versions

        rows = get_exam_images_with_versions(exam_id)
        images_dict = {}

        for row in rows:
            img_id = row["image_id"]

            # Ruta corregida: comienza con '/exams/...'
            relative_url = f"/exams/{exam_id}/{row['image_url'].split('/')[-1]}"

            if img_id not in images_dict:
                images_dict[img_id] = {
                    "id": img_id,
                    "url": relative_url,
                    "label": img_id,
                    "status": "procesado",
                    "findings": [],
                    "iaLesion": "No detectado",
                    "versions": []
                }

            if row["version_type"]:
                version_filename = row["version_url"].split("/")[-1]
                version_relative_url = f"/exams/{exam_id}/{version_filename}"
                images_dict[img_id]["versions"].append({
                    "version_type": row["version_type"],
                    "url": version_relative_url,
                    "format": row["format"]
                })

        images = list(images_dict.values())
        return JsonResponse(images, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from backend.db.queries import get_exam_by_uuid  # usa la ruta correcta

@csrf_exempt
def get_exam_by_uuid_view(request, uuid):
    if request.method == "GET":
        exam = get_exam_by_uuid(uuid)
        if exam:
            return JsonResponse(exam, safe=False)
        return JsonResponse({"error": "Examen no encontrado."}, status=404)

from rest_framework.decorators import api_view
from django.http import JsonResponse
from backend.db.queries import delete_exam_by_id

@api_view(["DELETE"])
def delete_exam_view(request, id):
    try:
        delete_exam_by_id(id)
        return JsonResponse({"message": "Examen eliminado correctamente"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..db import queries as db
from rest_framework.permissions import AllowAny

@api_view(["GET"])
@permission_classes([AllowAny])
def get_images_by_exam(request, exam_id):
    try:
        images = db.fetch_images_by_exam(exam_id)
        return Response(images, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)



# ---- TU FUNCIÓN DE SEGMENTACIÓN (PUEDE ESTAR AQUÍ O IMPORTADA) ----
import os
import cv2
import numpy as np

# Función para segmentar y marcar lesiones
def segment_image_ancha(original_path):
    print(f"[SEG] Procesando imagen: {original_path}")
    
    # Cargar la imagen
    img = cv2.imread(original_path)
    if img is None:
        print(f"[SEG] ERROR: No se pudo cargar la imagen: {original_path}")
        raise FileNotFoundError(f"Image not found: {original_path}")
    print(f"[SEG] Imagen cargada: shape={img.shape}")
    
    # Obtener dimensiones
    h, w = img.shape[:2]
    
    # Crear máscara para segmentación
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Dibujar un círculo en la imagen (como ejemplo de segmento)
    center = (w // 2, h // 2)  # Centro de la imagen
    axes = (int(w * 0.4), int(h * 0.3))  # Ejes del elipse
    angle = 0
    start_angle = 0
    end_angle = 360
    cv2.ellipse(mask, center, axes, angle, start_angle, end_angle, 255, -1)
    
    # Aplicar la máscara a la imagen
    segmented = cv2.bitwise_and(img, img, mask=mask)
    
    # Crear una imagen con el círculo (lesión detectada) con línea roja más gruesa
    img_with_circle = img.copy()
    cv2.ellipse(img_with_circle, center, axes, angle, start_angle, end_angle, (0, 0, 255), 5)  # Línea roja y más gruesa
    
    # Guardar imagen segmentada
    folder, filename = os.path.split(original_path)
    name, ext = os.path.splitext(filename)
    seg_name = name + "-segmented" + ext
    seg_path = os.path.join(folder, seg_name)
    cv2.imwrite(seg_path, segmented)
    print(f"[SEG] Imagen segmentada guardada en: {seg_path}")
    
    # Guardar imagen con círculo (lesiones)
    lesion_name = name + "-lesions" + ext
    lesion_path = os.path.join(folder, lesion_name)
    cv2.imwrite(lesion_path, img_with_circle)
    print(f"[SEG] Imagen de lesiones guardada en: {lesion_path}")
    
    return seg_path, lesion_path




from rest_framework.decorators import api_view
from django.http import FileResponse, Http404
from backend.utils.pdf.colposcopyReport import generate_colposcopy_report  # ✅ Corrected import

@api_view(['GET'])
def generate_pdf_view(request, exam_id):
    try:
        pdf_buffer = generate_colposcopy_report(exam_id)
        filename = f"reporte_examen_{exam_id}.pdf"
        return FileResponse(pdf_buffer, as_attachment=False, filename=filename, content_type='application/pdf')
    except Exception as e:
        print(f"❌ Error generando PDF: {e}")
        raise Http404("No se pudo generar el PDF.")

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from backend.db.queries import insert_user
import json

@csrf_exempt
def register_user_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        data = json.loads(request.body)

        full_name = data.get('full_name')
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        # Validar campos obligatorios
        if not full_name or not email or not username or not password:
            return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)

        # Insertar usuario
        insert_user({
            'full_name': full_name,
            'email': email,
            'username': username,
            'password': password
        })

        return JsonResponse({'message': 'Usuario creado exitosamente'}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import traceback

@api_view(['GET'])
def clinical_dashboard_summary_view(request):
    try:
        user = request.user

        if not user or user.is_anonymous:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = user.id
        data = get_clinical_dashboard_summary(user_id)
        return Response(data)

    except Exception as e:
        print("🚨 Error interno en clinical_dashboard_summary_view:")
        traceback.print_exc()
        return Response({'error': f'Error interno: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import os
import cv2
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

# Función para segmentar la imagen y dibujar un círculo
def segment_image_with_circle(image_path: str) -> str:
    print(f"[INFO] Procesando imagen: {image_path}")
    
    # Cargar la imagen
    img = cv2.imread(image_path)
    if img is None:
        print("[ERROR] No se pudo cargar la imagen.")
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    # Obtener las dimensiones de la imagen
    h, w = img.shape[:2]
    
    # Definir el centro de la imagen
    center = (w // 2, h // 2)
    radius = min(w, h) // 4  # El radio del círculo será la cuarta parte de la imagen
    
    # Dibujar el círculo en el centro de la imagen
    cv2.circle(img, center, radius, (0, 255, 0), 2)  # (0, 255, 0) es el color verde
    
    # Guardar la imagen con el círculo dibujado
    folder, filename = os.path.split(image_path)
    name, ext = os.path.splitext(filename)
    circled_name = name + "-circled" + ext
    circled_path = os.path.join(folder, circled_name)

    cv2.imwrite(circled_path, img)  # Guardamos la imagen con el círculo
    print(f"[INFO] Imagen con círculo guardada en: {circled_path}")

    return circled_path

from backend.ia.segment import segment_image_minimal  # Nueva función limpia

@api_view(['POST'])
def predict_exam_image(request):
    try:
        exam_id = request.data.get("exam_id")
        image_id = request.data.get("image_id")

        if not exam_id or not image_id:
            return Response({"status": "imagen_no_encontrada"}, status=400)

        # Obtener la ruta de la imagen desde la base de datos
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT url FROM images WHERE id = %s AND exam_id = %s", (image_id, exam_id))
                row = cur.fetchone()
        finally:
            conn.close()

        if not row:
            return Response({"status": "imagen_no_encontrada"}, status=404)

        relative_url = row[0].lstrip("/")
        image_path = os.path.join(settings.BASE_DIR, relative_url)

        if not os.path.exists(image_path):
            return Response({"status": "imagen_no_encontrada"}, status=404)

        # Llamar al archivo segment.py para simular el procesamiento
        segment_image_minimal(image_path)

        result = segment_image_minimal(image_path)
        return Response(result, status=200)


    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"status": "imagen_no_encontrada", "error": str(e)}, status=500)

# backend/services/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from backend.ia.predict_normality import predict_normal_or_abnormal
from backend.db.queries import get_image_by_id  # debe existir esta función

@api_view(['POST'])
def predict_image_normality_view(request):
    image_id = request.data.get("image_id")
    if not image_id:
        return Response({"error": "Falta image_id"}, status=400)

    image_data = get_image_by_id(image_id)
    if not image_data:
        return Response({"error": "Imagen no encontrada"}, status=404)

    image_path = image_data["url"]
    prediction = predict_normal_or_abnormal(image_path)

    return Response({"prediction": prediction}, status=200)

@api_view(['POST'])
def rate_image_normality_view(request):
    image_id = request.data.get("image_id")
    prediction = request.data.get("prediction")
    correct = request.data.get("correct")

    print(f"Evaluación recibida -> Imagen: {image_id}, Predicción: {prediction}, Correcta: {correct}")
    
    # En el futuro: guardar en una tabla `prediction_ratings`
    return Response({"status": "evaluación_guardada"})


from backend.db.queries import delete_exam_image
from backend.db.railway_client import execute_query


@csrf_exempt
@api_view(["POST"])
def delete_exam_image_view(request):
    try:
        data = request.data
        exam_id = data.get("exam_id")
        filename = data.get("filename")

        if not exam_id or not filename:
            return Response({"error": "Faltan exam_id o filename"}, status=400)

        # 1. Eliminar archivo del sistema
        file_path = os.path.join(settings.MEDIA_ROOT, "exams", str(exam_id), filename)
        if os.path.exists(file_path):
            os.remove(file_path)

        # 2. Eliminar de la base de datos
        query, params = delete_exam_image(exam_id, filename)
        execute_query(query, params)

        return Response({"message": "Imagen eliminada correctamente"}, status=200)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_patient_by_record_code_view(request, codigo):
    try:
        from backend.db.queries import get_patient_uuid_by_record_code, get_patient_with_clinical_data, get_exams_by_patient_uuid

        uuid = get_patient_uuid_by_record_code(codigo)
        if not uuid:
            return Response({"error": "Paciente no encontrado"}, status=404)

        patient = get_patient_with_clinical_data(uuid)
        if not patient:
            return Response({"error": "Paciente no encontrado"}, status=404)

        exams = get_exams_by_patient_uuid(uuid)
        patient["exams"] = exams

        return Response(patient, status=200)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from backend.db.queries import (
    search_patients_by_text,
    get_patient_exams,
)

from backend.db.railway_client import execute_query

@api_view(["GET"])
def get_patient_exams_view(request, patient_id):  # ⚠️ CORREGIDO aquí
    try:
        print(f"[INFO] Obteniendo exámenes del paciente: {patient_id}")
        exams = get_patient_exams(patient_id)
        print(f"[INFO] Exámenes encontrados: {len(exams)}")
        return Response(exams, status=status.HTTP_200_OK)
    except Exception as e:
        print("[ERROR get_patient_exams_view]", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
