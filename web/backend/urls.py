import os
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from backend.services.views import (
    index_view,
    login_view,
    dashboard_view,
    dashboard_metrics,
    dashboard_summary,
    create_patient,
    get_patients,
    get_patient_by_id,
    delete_patient,
    get_patient_by_uuid_view,
    search_patients_view,
    create_exam,
    prepare_exam_image_path,
    upload_exam_image,
    get_exam_by_id,
    get_exam_images_view,
    get_exam_by_uuid_view,
    delete_exam_view,
    get_images_by_exam,
    predict_exam_image,  # Usamos la función correcta
    generate_pdf_view,
    register_user_view,
    clinical_dashboard_summary_view, 
    predict_image_normality_view, 
    rate_image_normality_view,delete_exam_image_view,
    get_patient_by_record_code_view,
    get_patient_exams_view
)

urlpatterns = [
    # Panel de administración
    path('admin/', admin.site.urls),

    # 🔐 Autenticación
    path('api/login/', login_view, name='custom_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/dashboard/clinical-summary/', clinical_dashboard_summary_view),
    # Dashboard
    path('api/dashboard/', dashboard_view),
    path('api/dashboard/metrics/', dashboard_metrics),
    path('api/dashboard/summary/', dashboard_summary),

    # Pacientes
    path('api/patients/', get_patients, name='get_patients'),
    path('api/patients/create/', create_patient, name='create_patient'),
    path('api/patients/<uuid:id>/', get_patient_by_id, name='get_patient_by_id'),
    path('api/patients/delete/<uuid:id>/', delete_patient, name='delete_patient'),
    path("api/patients/id/<uuid:uuid>/", get_patient_by_uuid_view),
    path('api/patients/search/', search_patients_view),
    path("api/patients/record/<str:codigo>/", get_patient_by_record_code_view),

    # Exámenes
    path('api/exams/create/', create_exam, name='create_exam'),
    path("api/exams/prepare-image/", prepare_exam_image_path),
    path("api/exams/upload-image/", upload_exam_image),
    path("api/exams/<int:exam_id>/images/", get_exam_images_view),
    path("api/exams/id/<uuid:uuid>/", get_exam_by_uuid_view),
    path('api/exams/delete/<uuid:id>/', delete_exam_view, name='delete_exam'),
    path("api/exams/<uuid:exam_id>/images", get_images_by_exam),
    path('api/exams/predict/', predict_exam_image, name='predict_exam_image'),  # Actualiza la ruta
    path('api/exams/<uuid:exam_id>/pdf/', generate_pdf_view, name='generate_pdf'),
    path('api/patients/search/', search_patients_view),
    path('api/patients/<uuid:patient_id>/exams/', get_patient_exams_view),
    

    path('api/register/', register_user_view),

    path("api/exams/predict_normality/", predict_image_normality_view),
    path("api/exams/rate_normality/", rate_image_normality_view),
    path("api/exams/delete-image/", delete_exam_image_view),

    # Vista raíz
    path('', index_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 📁 Servir archivos estáticos en desarrollo
# Para imágenes colposcópicas almacenadas en /exams/
urlpatterns += static(settings.EXAMS_URL, document_root=settings.EXAMS_ROOT)

# Para imágenes de predicción IA almacenadas en /assets/predictions/
urlpatterns += static('/assets/predictions/', document_root=os.path.join(settings.BASE_DIR, 'assets/predictions'))
# Sirve los archivos media durante el desarrollo (esto es solo para desarrollo)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
