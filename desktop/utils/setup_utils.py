import os
import subprocess
import configparser
import sys

def get_resource_path(relative_path):
    if getattr(sys, 'frozen', False):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

def load_config():
    config = configparser.ConfigParser()
    config.read(get_resource_path('config.ini'))
    return config

def install_backend_dependencies(venv_python, backend_path, log_func):
    requirements_file = os.path.join(backend_path, "requirements.txt")
    if not os.path.exists(requirements_file):
        log_func(f"[ERROR] No se encontró requirements.txt en {backend_path}")
        return

    command = [venv_python, "-m", "pip", "install", "-r", "requirements.txt"]
    log_func("[INFO] Instalando dependencias del backend...")

    process = subprocess.Popen(
        command,
        cwd=backend_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    for line in process.stdout:
        log_func(line.strip())
    process.wait()

    if process.returncode == 0:
        log_func("[OK] Dependencias del backend instaladas correctamente.")
    else:
        log_func("[ERROR] Falló la instalación del backend.")

def install_frontend_dependencies(frontend_path, log_func):
    package_file = os.path.join(frontend_path, "package.json")
    if not os.path.exists(package_file):
        log_func(f"[ADVERTENCIA] No se encontró package.json en {frontend_path}")
        return

    log_func(f"[INFO] Instalando dependencias del frontend en {frontend_path}...")
    process = subprocess.Popen(
        ["npm", "install"],
        cwd=frontend_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    for line in process.stdout:
        log_func(line.strip())
    process.wait()

    if process.returncode == 0:
        log_func("[OK] Dependencias del frontend instaladas correctamente.")
    else:
        log_func("[ERROR] Falló la instalación del frontend.")

def install_all_dependencies(log_func=print):
    config = load_config()

    backend_path = config['PATHS']['backend']
    frontend_path = config['PATHS']['frontend']
    venv_path = config['ENV']['venv_path']

    venv_dir = os.path.dirname(os.path.dirname(venv_path))
    venv_python = os.path.join(venv_dir, "Scripts", "python.exe")

    # Crear entorno virtual si no existe
    if not os.path.exists(venv_python):
        log_func("[INFO] Entorno virtual no encontrado. Creando...")
        result = subprocess.run(
            [sys.executable, "-m", "venv", venv_dir],
            cwd=backend_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        for line in result.stdout.splitlines():
            log_func(line)
        if not os.path.exists(venv_python):
            log_func("[ERROR] No se pudo crear el entorno virtual.")
            return

    # Instalar dependencias
    install_backend_dependencies(venv_python, backend_path, log_func)
    install_frontend_dependencies(frontend_path, log_func)
