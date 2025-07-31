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

def repo_exists(path):
    return os.path.exists(path) and os.path.isdir(os.path.join(path, '.git'))

def clone_repo(url, branch, path, log_func):
    log_func(f"[INFO] Clonando solo la carpeta 'web/' desde {url} (rama: {branch})...")

    try:
        os.makedirs(path, exist_ok=True)

        subprocess.run(["git", "init"], cwd=path, check=True)
        subprocess.run(["git", "remote", "add", "origin", url], cwd=path, check=True)
        subprocess.run(["git", "config", "core.sparseCheckout", "true"], cwd=path, check=True)

        sparse_path = os.path.join(path, ".git", "info", "sparse-checkout")
        with open(sparse_path, "w") as f:
            f.write("web/\n")

        subprocess.run(["git", "pull", "origin", branch], cwd=path, check=True)

        log_func("[OK] Carpeta 'web/' clonada exitosamente con sparse-checkout.")
    except subprocess.CalledProcessError as e:
        log_func(f"[ERROR] Falló la clonación parcial: {e}")
    except Exception as e:
        log_func(f"[ERROR] Excepción inesperada durante la clonación: {str(e)}")

def pull_repo(path, log_func):
    log_func("[INFO] Actualizando repositorio con git pull...")
    process = subprocess.Popen(
        ["git", "-C", path, "pull"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True
    )
    for line in process.stdout:
        log_func(line.strip())
    process.wait()
    if process.returncode == 0:
        log_func("[OK] Repositorio actualizado correctamente.")
    else:
        log_func("[ERROR] Error al actualizar repositorio.")

def update_or_clone_repo(log_func):
    config = load_config()
    url = config['REPO']['url']
    branch = config['REPO']['branch']
    path = config['REPO']['path']

    if repo_exists(path):
        pull_repo(path, log_func)
    else:
        clone_repo(url, branch, path, log_func)
