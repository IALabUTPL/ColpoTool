# ⬇️ INICIO DEL ARCHIVO
import os
import sys

import subprocess
import tempfile
import atexit
import urllib.request
import shutil
import tkinter as tk
from tkinter import scrolledtext, PhotoImage
from threading import Thread
import time
import webbrowser
import socket

# Configuración embebida
RESTART_REQUIRED = False
REPO_URL = "https://github.com/israv87/ColpoTool.git"
REPO_BRANCH = "main"
REPO_DIR = "C:/ColpoTool"

BACKEND_PATH = "C:/ColpoTool/web"
FRONTEND_PATH = "C:/ColpoTool/web/frontend"
VENV_PATH = "C:/ColpoTool/web/venv/Scripts/activate.bat"

BACKEND_COMMAND = "python manage.py runserver"
FRONTEND_COMMAND = "npm start"

BACKEND_PORT = 8000
FRONTEND_PORT_BASE = 3000

backend_process = None
frontend_process = None

LOCK_FILE = os.path.join(tempfile.gettempdir(), 'colpotool_launcher.lock')
if os.path.exists(LOCK_FILE):
    print("Otra instancia del launcher ya está en ejecución.")
    sys.exit()
with open(LOCK_FILE, 'w') as f:
    f.write(str(os.getpid()))
atexit.register(lambda: os.remove(LOCK_FILE))

def log(msg, overwrite=False):
    log_console.configure(state='normal')
    if overwrite:
        log_console.delete("end-2l", "end-1l")
    log_console.insert(tk.END, f"{msg}\n")
    log_console.configure(state='disabled')
    log_console.yview(tk.END)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def wait_for_port(port, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        if is_port_in_use(port):
            return True
        time.sleep(1)
    return False

def find_available_port(start_port):
    port = start_port
    while is_port_in_use(port):
        port += 1
        if port > 65535:
            raise RuntimeError("No hay puertos disponibles.")
    return port


def is_git_installed():
    return shutil.which("git") is not None

def is_python_installed():
    return shutil.which("python") is not None or shutil.which("py") is not None

def is_npm_installed():
    return shutil.which("npm") is not None

def install_git():
    log("[INFO] Git no está instalado. Descargando instalador...")
    git_url = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe"
    installer_path = os.path.join(os.getcwd(), "git_installer.exe")
    try:
        urllib.request.urlretrieve(git_url, installer_path)
        log("[INFO] Ejecutando instalación silenciosa de Git...")
        subprocess.run([installer_path, "/SILENT"], check=True)
        os.remove(installer_path)
        global RESTART_REQUIRED
        RESTART_REQUIRED = True
    except Exception as e:
        log(f"[ERROR] No se pudo instalar Git: {e}")
        raise

def install_python():
    log("[INFO] Python no está instalado. Descargando instalador...")
    python_url = "https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
    installer_path = os.path.join(os.getcwd(), "python_installer.exe")
    try:
        urllib.request.urlretrieve(python_url, installer_path)
        log("[INFO] Ejecutando instalación silenciosa de Python...")
        subprocess.run([installer_path, "/quiet", "InstallAllUsers=1", "PrependPath=1"], check=True)
        log("[OK] Python instalado correctamente.")
        os.remove(installer_path)
        global RESTART_REQUIRED
        RESTART_REQUIRED = True
    except Exception as e:
        log(f"[ERROR] No se pudo instalar Python: {e}")
        raise

def install_node():
    log("[INFO] Node.js no está instalado. Descargando instalador...")
    node_url = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    installer_path = os.path.join(os.getcwd(), "node_installer.msi")
    try:
        urllib.request.urlretrieve(node_url, installer_path)
        log("[INFO] Ejecutando instalación silenciosa de Node.js...")
        subprocess.run(["msiexec", "/i", installer_path, "/quiet", "/norestart"], check=True)
        log("[OK] Node.js instalado correctamente.")
        os.remove(installer_path)
        global RESTART_REQUIRED
        RESTART_REQUIRED = True

    except Exception as e:
        log(f"[ERROR] No se pudo instalar Node.js: {e}")
        raise
from tkinter import messagebox

def ask_for_reboot():
    answer = messagebox.askyesno("🔄 Reinicio requerido", 
        "Se han instalado herramientas esenciales (Git, Python o Node.js).\n\nPara completar la configuración, es necesario reiniciar tu sistema.\n\n¿Deseas reiniciar ahora?")
    if answer:
        try:
            log("[INFO] Reiniciando sistema...")
            subprocess.run(["shutdown", "/r", "/t", "0"], check=True)
        except Exception as e:
            log(f"[ERROR] No se pudo reiniciar: {e}")
    else:
        log("[AVISO] Reinicio pendiente. Reinicia manualmente antes de continuar.")
        status_label.config(text="⚠️ Reinicio pendiente", fg="#f39c12")
        start_button.config(state='disabled')
        stop_button.config(state='disabled')

def ensure_all_tools_installed():
    if not is_git_installed():
        install_git()
    if not is_python_installed():
        install_python()
    if not is_npm_installed():
        install_node()


def update_or_clone_repo(log_func):
    try:
        if os.path.isdir(REPO_DIR):
            log_func("[INFO] Repositorio encontrado. Intentando actualizar con 'git pull'...")
            subprocess.run(["git", "-C", REPO_DIR, "pull"], check=True)
            log_func("[OK] Repositorio actualizado.")
        else:
            log_func("[INFO] Repositorio no encontrado. Clonando desde GitHub...")
            subprocess.run(["git", "clone", "--branch", REPO_BRANCH, REPO_URL, REPO_DIR], check=True)
            log_func("[OK] Repositorio clonado.")
    except Exception as e:
        log_func(f"[ERROR] Falló al clonar o actualizar el repositorio: {e}")
        raise

def ensure_virtualenv_exists():
    venv_path = os.path.join(REPO_DIR, "web", "venv")
    activate_script = os.path.join(venv_path, "Scripts", "activate.bat")
    pip_exe = os.path.join(venv_path, "Scripts", "pip.exe")

    if not os.path.exists(activate_script):
        log("[INFO] Creando entorno virtual para backend...")
        subprocess.run(["python", "-m", "venv", venv_path], check=True)
        log("[OK] Entorno virtual creado.")
    else:
        log("[INFO] Entorno virtual ya existe.")

    if not os.path.exists(pip_exe):
        raise FileNotFoundError(f"[ERROR] pip.exe no encontrado en {pip_exe}. La creación del entorno virtual falló.")
    else:
        log("[OK] pip.exe verificado correctamente.")



def install_all_dependencies(log_func):
    try:
        log_func("[INFO] Instalando dependencias del backend...")
        pip_path = os.path.join(BACKEND_PATH, "venv", "Scripts", "pip.exe")
        requirements_path = os.path.join(BACKEND_PATH, "requirements.txt")
        log_func(f"[DEBUG] Usando pip en: {pip_path}")
        subprocess.run([pip_path, "install", "-r", requirements_path], check=True)
        log_func("[OK] Backend listo.")
    except Exception as e:
        log_func(f"[ERROR] Falló instalación backend: {e}")
        raise

    try:
        log_func("[INFO] Instalando dependencias del frontend...")

        # Buscar la ruta completa de npm o npm.cmd, incluso si no está en PATH
        npm_path = shutil.which("npm") or shutil.which("npm.cmd")
        if not npm_path:
            raise FileNotFoundError("npm no se encontró. Es posible que se requiera reiniciar el sistema o que la instalación haya fallado.")

        log_func(f"[DEBUG] Usando npm en: {npm_path}")
        subprocess.run([npm_path, "install"], cwd=FRONTEND_PATH, check=True)
        log_func("[OK] Frontend listo.")
    except Exception as e:
        log_func(f"[ERROR] Falló instalación frontend: {e}")
        raise

def run_backend(log_func):
    return subprocess.Popen(
        f'cmd /k "cd /d {BACKEND_PATH} && {VENV_PATH} && {BACKEND_COMMAND}"',
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

def run_frontend(log_func):
    return subprocess.Popen(
        f'cmd /k "cd /d {FRONTEND_PATH} && {FRONTEND_COMMAND}"',
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

# UI Setup
root = tk.Tk()
root.title("ColpoTool Launcher")
root.geometry("600x420")
root.configure(bg="white")
root.resizable(False, False)

header_frame = tk.Frame(root, bg="white")
header_frame.pack(pady=(20, 5))

logo_path = os.path.join("assets", "colpo.png")
if os.path.exists(logo_path):
    try:
        logo_image = PhotoImage(file=logo_path).subsample(4, 4)
        logo_label = tk.Label(header_frame, image=logo_image, bg="white")
        logo_label.image = logo_image
        logo_label.pack(side=tk.LEFT, padx=(0, 10))
    except Exception as e:
        print("⚠️ Error al cargar logo:", e)

title_label = tk.Label(header_frame, text="ColpoTool Launcher", font=("Helvetica", 16, "bold"), fg="#002942", bg="white")
title_label.pack(side=tk.LEFT)

status_label = tk.Label(root, text="⏳ Verificando entorno...", font=("Segoe UI", 11), fg="#555555", bg="white")
status_label.pack(pady=(0, 5))

log_console = scrolledtext.ScrolledText(root, width=72, height=12, state='disabled', font=("Courier", 9), bg="#f7f7f7")
log_console.pack(padx=15, pady=10)

def initial_setup():
    try:
        for icon in ["⏳", "🕒", "⌛"]:
            status_label.config(text=f"{icon} Verificando entorno...")
            root.update()
            time.sleep(0.3)

        log("[INFO] Verificando y actualizando repositorio...")
        update_or_clone_repo(log)

        if not os.path.isdir(REPO_DIR):
            raise Exception(f"No se encontró el repositorio en la ruta: {REPO_DIR}")

        log("[INFO] Verificando herramientas básicas (Git, Python, Node.js)...")
        ensure_all_tools_installed()

        if RESTART_REQUIRED:
            ask_for_reboot()
            return

        log("[INFO] Verificando entorno virtual...")
        ensure_virtualenv_exists()

        log("[INFO] Instalando dependencias...")
        install_all_dependencies(log)

        log("✅ Todo listo. Haz clic en 'Iniciar ColpoTool' para ejecutar el sistema.")
        status_label.config(text="✅ Sistema listo.", fg="#2ecc71")
        start_button.config(state='normal', disabledforeground="#ffffff")
        stop_button.config(state='disabled')

    except Exception as e:
        status_label.config(text="❌ Error durante la verificación", fg="#e74c3c")
        log(f"[ERROR] {str(e)}")


def start_colpotool():
    global backend_process, frontend_process
    try:
        if is_port_in_use(BACKEND_PORT):
            log(f"[ERROR] El puerto {BACKEND_PORT} ya está en uso.")
            status_label.config(text=f"❌ Puerto {BACKEND_PORT} ocupado", fg="#e74c3c")
            return

        frontend_port = find_available_port(FRONTEND_PORT_BASE)
        os.environ["PORT"] = str(frontend_port)

        log("[INFO] Iniciando servidores...")
        backend_process = run_backend(log)
        frontend_process = run_frontend(log)

        log(f"[INFO] Esperando al backend (puerto {BACKEND_PORT})...")
        if not wait_for_port(BACKEND_PORT):
            raise RuntimeError(f"Backend no respondió en puerto {BACKEND_PORT}.")

        log(f"[INFO] Esperando al frontend (puerto {frontend_port})...")
        if not wait_for_port(frontend_port):
            raise RuntimeError(f"Frontend no respondió en puerto {frontend_port}.")

        url = f"http://localhost:{frontend_port}"
        webbrowser.open(url)
        log(f"[OK] Servidores activos. Abriendo {url}...")
        status_label.config(text="🟢 ColpoTool en ejecución.", fg="#3498db")
        start_button.config(state='disabled')
        stop_button.config(state='normal')
    except Exception as e:
        status_label.config(text="❌ Error al iniciar", fg="#e74c3c")
        log(f"[ERROR] {str(e)}")

def stop_colpotool():
    global backend_process, frontend_process
    if backend_process:
        backend_process.terminate()
        log("[INFO] Backend detenido.")
        backend_process = None
    if frontend_process:
        frontend_process.terminate()
        log("[INFO] Frontend detenido.")
        frontend_process = None
    status_label.config(text="🛑 ColpoTool detenido.", fg="#e67e22")
    start_button.config(state='normal')
    stop_button.config(state='disabled')

def on_enter_start(e): start_button['bg'] = "#009FB7"
def on_leave_start(e): start_button['bg'] = "#007B95"
def on_enter_stop(e): stop_button['bg'] = "#E74C3C"
def on_leave_stop(e): stop_button['bg'] = "#D9534F"

button_frame = tk.Frame(root, bg="white")
button_frame.pack(pady=10)

start_button = tk.Button(
    button_frame,
    text="✅ Iniciar ColpoTool",
    font=("Segoe UI", 12, "bold"),
    bg="#007B95", fg="white",
    activebackground="#005f6a",
    width=20,
    bd=0,
    relief="flat",
    cursor="hand2",
    command=lambda: Thread(target=start_colpotool).start()
)
start_button.pack(side=tk.LEFT, padx=15)
start_button.bind("<Enter>", on_enter_start)
start_button.bind("<Leave>", on_leave_start)

stop_button = tk.Button(
    button_frame,
    text="⛔ Detener ColpoTool",
    font=("Segoe UI", 12, "bold"),
    bg="#D9534F", fg="white",
    activebackground="#b02a25",
    width=20,
    bd=0,
    relief="flat",
    cursor="hand2",
    disabledforeground="#bbbbbb",
    command=stop_colpotool
)
stop_button.pack(side=tk.LEFT, padx=15)
stop_button.bind("<Enter>", on_enter_stop)
stop_button.bind("<Leave>", on_leave_stop)

start_button.config(state='disabled')
stop_button.config(state='disabled')

Thread(target=initial_setup).start()
root.mainloop()
# ⬆️ FIN DEL ARCHIVO
