import os
import sys
import subprocess
import tempfile
import atexit
import urllib.request
import shutil
import tkinter as tk
from tkinter import scrolledtext, PhotoImage, messagebox
from threading import Thread
import time
import webbrowser
import socket

# =========================
# 🔹 Garantizar importación de módulos locales
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)


from utils.git_utils import update_or_clone_repo


# =====================
# CONFIGURACIÓN
# =====================
RESTART_REQUIRED = False
REPO_DIR = "C:/ColpoTool"  # Solo contendrá carpeta web
BACKEND_PATH = os.path.join(REPO_DIR, "web")
FRONTEND_PATH = os.path.join(REPO_DIR, "web", "frontend")
VENV_PATH = os.path.join(REPO_DIR, "web", "venv", "Scripts", "activate.bat")
BACKEND_COMMAND = "python manage.py runserver"
FRONTEND_COMMAND = "npm start"
BACKEND_PORT = 8000
FRONTEND_PORT_BASE = 3000
backend_process = None
frontend_process = None

# =====================
# CONTROL DE INSTANCIA
# =====================
LOCK_FILE = os.path.join(tempfile.gettempdir(), 'colpotool_launcher.lock')
if os.path.exists(LOCK_FILE):
    print("Otra instancia del launcher ya está en ejecución.")
    sys.exit()
with open(LOCK_FILE, 'w') as f:
    f.write(str(os.getpid()))
atexit.register(lambda: os.remove(LOCK_FILE))

# =====================
# FUNCIONES UTILIDAD
# =====================
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

# =====================
# INSTALADORES
# =====================
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
    urllib.request.urlretrieve(git_url, installer_path)
    subprocess.run([installer_path, "/SILENT"], check=True)
    os.remove(installer_path)
    global RESTART_REQUIRED; RESTART_REQUIRED = True

def install_python():
    log("[INFO] Python no está instalado. Descargando instalador...")
    python_url = "https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
    installer_path = os.path.join(os.getcwd(), "python_installer.exe")
    urllib.request.urlretrieve(python_url, installer_path)
    subprocess.run([installer_path, "/quiet", "InstallAllUsers=1", "PrependPath=1"], check=True)
    os.remove(installer_path)
    global RESTART_REQUIRED; RESTART_REQUIRED = True

def install_node():
    log("[INFO] Node.js no está instalado. Descargando instalador...")
    node_url = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    installer_path = os.path.join(os.getcwd(), "node_installer.msi")
    urllib.request.urlretrieve(node_url, installer_path)
    subprocess.run(["msiexec", "/i", installer_path, "/quiet", "/norestart"], check=True)
    os.remove(installer_path)
    global RESTART_REQUIRED; RESTART_REQUIRED = True

def ask_for_reboot():
    answer = messagebox.askyesno("🔄 Reinicio requerido", "Se han instalado herramientas esenciales. Reiniciar ahora?")
    if answer:
        subprocess.run(["shutdown", "/r", "/t", "0"], check=True)

def ensure_all_tools_installed():
    if not is_git_installed(): install_git()
    if not is_python_installed(): install_python()
    if not is_npm_installed(): install_node()

# =====================
# BACKEND / FRONTEND
# =====================
def ensure_virtualenv_exists():
    venv_path = os.path.join(REPO_DIR, "web", "venv")
    activate_script = os.path.join(venv_path, "Scripts", "activate.bat")
    if not os.path.exists(activate_script):
        log("[INFO] Creando entorno virtual...")
        subprocess.run(["python", "-m", "venv", venv_path], check=True)

def install_all_dependencies(log_func):
    pip_path = os.path.join(BACKEND_PATH, "venv", "Scripts", "pip.exe")
    requirements_path = os.path.join(BACKEND_PATH, "requirements.txt")
    subprocess.run([pip_path, "install", "-r", requirements_path], check=True)
    npm_path = shutil.which("npm") or shutil.which("npm.cmd")
    subprocess.run([npm_path, "install"], cwd=FRONTEND_PATH, check=True)

def run_backend(log_func):
    return subprocess.Popen(f'cmd /k "cd /d {BACKEND_PATH} && {VENV_PATH} && {BACKEND_COMMAND}"', creationflags=subprocess.CREATE_NEW_CONSOLE)

def run_frontend(log_func):
    return subprocess.Popen(f'cmd /k "cd /d {FRONTEND_PATH} && {FRONTEND_COMMAND}"', creationflags=subprocess.CREATE_NEW_CONSOLE)

# =====================
# INTERFAZ
# =====================
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
    except: pass

title_label = tk.Label(header_frame, text="ColpoTool Launcher", font=("Helvetica", 16, "bold"), fg="#002942", bg="white")
title_label.pack(side=tk.LEFT)
status_label = tk.Label(root, text="⏳ Verificando entorno...", font=("Segoe UI", 11), fg="#555555", bg="white")
status_label.pack(pady=(0, 5))
log_console = scrolledtext.ScrolledText(root, width=72, height=12, state='disabled', font=("Courier", 9), bg="#f7f7f7")
log_console.pack(padx=15, pady=10)

def initial_setup():
    log("[INFO] Verificando y actualizando repositorio...")
    update_or_clone_repo(log)  # Solo clona web/
    ensure_all_tools_installed()
    if RESTART_REQUIRED:
        ask_for_reboot(); return
    ensure_virtualenv_exists()
    install_all_dependencies(log)
    log("✅ Todo listo. Haz clic en 'Iniciar ColpoTool'")
    status_label.config(text="✅ Sistema listo.", fg="#2ecc71")
    start_button.config(state='normal')

def start_colpotool():
    global backend_process, frontend_process
    frontend_port = find_available_port(FRONTEND_PORT_BASE)
    os.environ["PORT"] = str(frontend_port)
    backend_process = run_backend(log)
    frontend_process = run_frontend(log)
    wait_for_port(BACKEND_PORT)
    wait_for_port(frontend_port)
    webbrowser.open(f"http://localhost:{frontend_port}")
    status_label.config(text="🟢 ColpoTool en ejecución.", fg="#3498db")

def stop_colpotool():
    global backend_process, frontend_process
    if backend_process: backend_process.terminate(); backend_process = None
    if frontend_process: frontend_process.terminate(); frontend_process = None
    status_label.config(text="🛑 ColpoTool detenido.", fg="#e67e22")

button_frame = tk.Frame(root, bg="white")
button_frame.pack(pady=10)
start_button = tk.Button(button_frame, text="✅ Iniciar ColpoTool", font=("Segoe UI", 12, "bold"), bg="#007B95", fg="white", width=20, bd=0, relief="flat", command=lambda: Thread(target=start_colpotool).start())
start_button.pack(side=tk.LEFT, padx=15)
stop_button = tk.Button(button_frame, text="⛔ Detener ColpoTool", font=("Segoe UI", 12, "bold"), bg="#D9534F", fg="white", width=20, bd=0, relief="flat", command=stop_colpotool)
stop_button.pack(side=tk.LEFT, padx=15)
start_button.config(state='disabled')
stop_button.config(state='disabled')

Thread(target=initial_setup).start()
root.mainloop()
