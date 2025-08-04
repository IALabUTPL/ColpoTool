# ColpoTool

**ColpoTool** is a medical application developed for the **detection, recording, and analysis of colposcopic examinations**.  
It is designed to manage patient data and provide tools for organizing and reviewing colposcopy reports in a clinical setting.

This repository contains the **latest version** of the system, including the **launcher executable** for installation and local execution.

---

## 📦 Repository Contents

- **`ColpoToolLauncher.exe`** → Main executable to install and run ColpoTool on Windows.
- **`web/`** → Source code for the backend (Django) and frontend (React).
- **`desktop/`** → Launcher scripts and configuration files.
- **`docs/`** → Technical documentation and user guides (if available).

---

## 🚀 Installation and Execution with Launcher

1. Download the **`ColpoToolLauncher.exe`** file located in the root of this repository.
2. Run the launcher.
3. The system will automatically install all required dependencies.
4. Once installation is complete, the launcher will open **ColpoTool** in your default web browser.

---

## 🖥 Minimum Requirements

- **Operating System:** Windows 10 or higher (64-bit)
- **Processor:** Intel Core i3 or equivalent
- **RAM:** 8 GB recommended
- **Storage:** 3 GB free
- **Internet Connection:** Required

---

## 🧑‍💻 Development Environment Usage

If you want to run ColpoTool directly from the source code for development purposes:

```bash
# 1. Clone the repository
git clone https://github.com/IALabUTPL/ColpoTool.git
cd ColpoTool

# 2. Backend setup (Django)
cd web
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py runserver

# 3. Frontend setup (React)
cd frontend
npm install
npm start
