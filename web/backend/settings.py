from pathlib import Path
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
BASE_DIR = Path(__file__).resolve().parent.parent

dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path)

# -------------------
# Configuración base
# -------------------

SECRET_KEY = os.getenv("SECRET_KEY", 'django-insecure-7qja2lhct#$+)hlfejz@9j6y@i=2*q(dfm8!zt$2rc*gacf8q6')  # Usa SECRET_KEY desde .env
DEBUG = os.getenv("DEBUG", "True") == "True"  # Leemos el valor de DEBUG desde .env, si no está se asume "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")  # Permite configurarlo en el .env

# -------------------
# Archivos estáticos y de media
# -------------------

STATIC_URL = '/static/'  # URL para los archivos estáticos
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Directorio donde se recopilarán los archivos estáticos

MEDIA_ROOT = os.path.join(BASE_DIR, "exams")
MEDIA_URL = "/exams/"
# -------------------
# Aplicaciones activas
# -------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',  # Si no se usa JWT, sigue usando DRF
]

# -------------------
# Middleware
# -------------------

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -------------------
# Templates
# -------------------

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'backend', 'static')],  # Directorio para las plantillas estáticas
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# -------------------
# Base de datos
# -------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT"),
        'OPTIONS': {
            'sslmode': 'require',
        }
    }
}
print("▶️ DB_HOST:", os.getenv("DB_HOST"))
print("▶️ DB_NAME:", os.getenv("DB_NAME"))
# -------------------
# Validación de contraseñas (sin cambios)
# -------------------

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# -------------------
# Internacionalización
# -------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -------------------
# Configuración de DRF sin JWT
# -------------------

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],  # Desactivado JWT
}

# -------------------
# Archivos estáticos y media
# -------------------

# Si deseas tener archivos estáticos adicionales fuera de las aplicaciones, agrega a STATICFILES_DIRS
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'backend', 'static'),  # Si necesitas directorios adicionales
]

# Para el manejo de los archivos de examen y predicciones
EXAMS_ROOT = os.path.join(BASE_DIR, 'exams')
EXAMS_URL = '/exams/'

PREDICTIONS_URL = '/assets/predictions/'
PREDICTIONS_ROOT = BASE_DIR / 'assets' / 'predictions'

# -------------------
# Configuraciones adicionales
# -------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = True  # Permitir solicitudes de cualquier origen durante el desarrollo

# -------------------
# URLs de archivos estáticos y de medios
# -------------------

# Sirve archivos estáticos y de medios durante el desarrollo
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Aquí van tus otras rutas
    # path('admin/', admin.site.urls),
]

# Solo en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# -------------------
# Configuración de logging (opcional)
# -------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'ERROR',  # Cambiado de DEBUG a ERROR para reducir la verbosidad
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

