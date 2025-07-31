# backend/services/user_service.py
from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from backend.db.queries import get_user_by_email_and_password  # Reemplaza por tu lógica real si usas variables

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('username')
            password = data.get('password')

            user = get_user_by_email_and_password(email, password)
            if user:
                return JsonResponse({'message': 'Bienvenido', 'user': user})
            else:
                return JsonResponse({'error': 'Credenciales inválidas'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

urlpatterns = [
    path('', login_view),
]
