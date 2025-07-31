import React, { useState } from "react";
import axios from "axios";

interface Region {
  label: string;
  confidence?: number;
  points: number[][];
}
interface AIPredictionSectionProps {
  examId: string;
  imageId: string;
  onRegionsUpdate: (segmentRegions: Region[], lesionRegions: Region[]) => void;
  onNormalityPredict?: () => void; // ✅ Lo hacemos opcional
}

const AIPredictionSection: React.FC<AIPredictionSectionProps> = ({
  examId,
  imageId,
  onRegionsUpdate,
  onNormalityPredict
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingNormality, setLoadingNormality] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setStatus(null);
    onRegionsUpdate([], []);

    try {
      const response = await axios.post("/api/exams/predict/", {
        exam_id: examId,
        image_id: imageId
      });

      const data = response.data;

      if (data.status === "imagen_recibida") {
        onRegionsUpdate(data.segment_regions || [], data.lesion_regions || []);
        setStatus("imagen_recibida");
      } else {
        setStatus("imagen_no_encontrada");
      }
    } catch (error) {
      console.error("Error durante la predicción:", error);
      setStatus("imagen_no_encontrada");
    }

    setLoading(false);
  };

  const handleNormalityClick = async () => {
  setLoadingNormality(true);
  try {
    if (onNormalityPredict) {
      await onNormalityPredict(); // ✅ solo si está definida
    }
  } catch (error) {
    console.error("Error al invocar la predicción de normalidad:", error);
  }
  setLoadingNormality(false);
};


  return (
    <div>
      <div className="mb-3">
        <label className="form-label fw-bold">Modelo utilizado:</label>
        <input
          type="text"
          value="ColpoNet v2.0"
          className="form-control"
          disabled
        />
      </div>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <button
          className="btn btn-success"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Predecir"}
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNormalityClick}
          disabled={loadingNormality}
        >
          {loadingNormality ? "Analizando..." : "¿Normal o anormal?"}
        </button>
      </div>

      {status === "imagen_recibida" && (
        <div className="alert alert-success alert-dismissible fade show">
          ✅ La segmentación fue procesada correctamente por el sistema de IA.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {status === "imagen_no_encontrada" && (
        <div className="alert alert-danger alert-dismissible fade show">
          ❌ No se encontró la imagen o hubo un error durante el procesamiento.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Cerrar"
          ></button>
        </div>
      )}
    </div>
  );
};

export default AIPredictionSection;
