import React, { useRef, useState } from "react";
import axios from "axios";

interface UploadedImage {
  id: string;
  url: string;
  label: string;
}

interface DropzoneCardProps {
  onUpload: (images: UploadedImage[]) => void;
  examId: string;
  patientCode: string;
}

const DropzoneCard: React.FC<DropzoneCardProps> = ({ onUpload, examId, patientCode }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedImage[]>([]);

  const handleUploadFiles = async (fileList: FileList | null) => {
  if (!fileList) return;

  const token = localStorage.getItem("access_token");
  const newFiles: UploadedImage[] = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    if (!examId || !patientCode || !file) {
      console.error("❌ Campos inválidos para subir imagen:", {
        examId,
        patientCode,
        file,
      });
      continue;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("exam_id", String(examId));
    formData.append("patient_code", String(patientCode));

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const res = await axios.post("/api/exams/upload-image/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      newFiles.push({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        label: res.data.filename,
      });
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
    }
  }

  const updatedFiles = [...files, ...newFiles];
  setFiles(updatedFiles);
  onUpload(updatedFiles);
};


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
  const image = files.find((f) => f.id === id);
  if (!image) return;

  try {
    const token = localStorage.getItem("access_token");

    await axios.post("/api/exams/delete-image/", {
      exam_id: examId,
      filename: image.label
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const filtered = files.filter((f) => f.id !== id);
    setFiles(filtered);
    onUpload(filtered);
  } catch (error) {
    console.error("❌ Error al eliminar imagen:", error);
  }
};

  return (
    <div className="card h-100">
      <div
        className="card-body text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: "2px dashed #ccc", padding: "2rem" }}
      >
        <div className="mb-2">
          <i className="ti ti-upload" style={{ fontSize: "2rem" }}></i>
        </div>
        <p className="mb-1">
          Drag & drop files or{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => inputRef.current?.click()}
          >
            Browse
          </span>
        </p>
        <p className="text-muted small">Only images (.jpg, .jpeg, .png)</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          multiple
          hidden
          onChange={(e) => handleUploadFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="card-footer">
          <p className="fw-bold mb-2">Imágenes subidas:</p>
          <ul className="list-group">
            {files.map((file) => (
              <li
                key={file.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {file.label}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(file.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropzoneCard;
