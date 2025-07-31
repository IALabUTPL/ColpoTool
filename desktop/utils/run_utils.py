import os
import subprocess
import configparser
import threading
import time
import webbrowser
import sys

backend_process = None
frontend_process = None

def get_resource_path(relative_path):
    if getattr(sys, 'frozen', False):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

def load_config():
    config = configparser.ConfigParser()
    config.read(get_resource_path('config.ini'))
    return config

def stream_process_output(process, log_func):
    for line in process.stdout:
        log_func(line.strip())
    process.wait()

def run_backend(log_func):
    global backend_process
    config = load_config()
    backend_cmd = config['COMMANDS']['backend']
    backend_path = config['PATHS']['backend']
    venv_activate = config['ENV'].get('venv_path', '')

    full_command = f'"{venv_activate}" && {backend_cmd}'
    backend_process = subprocess.Popen(
        full_command,
        cwd=backend_path,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    threading.Thread(target=stream_process_output, args=(backend_process, log_func)).start()
    return backend_process

def run_frontend(log_func):
    global frontend_process
    config = load_config()
    frontend_cmd = config['COMMANDS']['frontend']
    frontend_path = config['PATHS']['frontend']

    frontend_process = subprocess.Popen(
        frontend_cmd,
        cwd=frontend_path,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    threading.Thread(target=stream_process_output, args=(frontend_process, log_func)).start()
    return frontend_process

def open_browser(frontend_port):
    url = f"http://localhost:{frontend_port}"
    time.sleep(5)
    webbrowser.open(url)

def stop_all():
    global backend_process, frontend_process

    if backend_process:
        backend_process.terminate()
        backend_process = None

    if frontend_process:
        frontend_process.terminate()
        frontend_process = None
