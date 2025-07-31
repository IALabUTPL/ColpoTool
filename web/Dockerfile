# Etapa 1: Build de React (frontend)
FROM node:18 AS frontend-builder

WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install && npm run build

# Etapa 2: Backend y servidor final
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean

# Copiar backend completo, sin mover manage.py
COPY backend/ ./backend/
COPY manage.py ./
COPY requirements.txt ./

# Instalar dependencias Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar frontend compilado
COPY --from=frontend-builder /app/frontend/build/ ./backend/static/

# Crear carpeta para los archivos estáticos
RUN mkdir -p /app/staticfiles

# Configuración Django
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Ejecutar collectstatic
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
