# Imagen base compatible con Detectron2 (PyTorch 2.1 + CUDA 11.8)
FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

# =====================
# 🔧 Dependencias del sistema
# =====================
RUN apt-get update && apt-get install -y \
    git cmake unzip libgl1-mesa-glx \
    gcc g++ make \
    && rm -rf /var/lib/apt/lists/*

# =====================
# 📦 Actualizar pip y Jupyter
# =====================
RUN pip install --upgrade pip
RUN pip install jupyterlab notebook ipywidgets tqdm

# =====================
# 📊 Ciencia de datos y visualización
# =====================
RUN pip install pandas numpy matplotlib seaborn plotly scikit-learn

# =====================
# 📷 Visión por computador
# =====================
RUN pip install opencv-python scikit-image shapely albumentations pycocotools

# =====================
# 🧠 Modelos de IA
# =====================

# TensorFlow (última compatible con esta base)
RUN pip install tensorflow==2.15.0

# Segment Anything (SAM)
RUN pip install git+https://github.com/facebookresearch/segment-anything.git

# Detectron2 (compatible con torch 2.1 + CUDA 11.8)
RUN pip install detectron2 -f \
 https://dl.fbaipublicfiles.com/detectron2/wheels/cu118/torch2.1/index.html

# Segmentación (U-Net, etc.)
RUN pip install segmentation-models-pytorch

# YOLOv8 (Ultralytics)
RUN pip install ultralytics

# =====================
# ⚙️ Configuración final
# =====================
WORKDIR /app
COPY . /app

EXPOSE 8888

CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--allow-root", "--no-browser"]
