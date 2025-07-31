// ExamImageWorkspace.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AIPredictionSection from "./forms/AIPredictionSection";
import ManualFindingsSection from "./forms/ManualFindingsSection";
import SwedeForm from "./forms/SwedeeForm";
import AccordionCard from "../shared/AccordionCard";
import ColposcopicFindingsDisplay from "./display/ColposcopicFindingsDisplay";
import { IconZoomIn, IconDownload, IconFileAnalytics } from "@tabler/icons-react";

import { toPng } from 'html-to-image';
import { useRef } from 'react';


interface Region {
  label: string;
  confidence?: number;
  points: number[][];
  color?: string;
}

interface ImageData {
  id: string;
  url: string;
  label: string;
  iaLesion?: string;
  findings?: string[];
  status: string;
}

interface ExamImageWorkspaceProps {
  examId: string;
}
interface SwedeEvaluation {
  acetowhite: string;
  margins: string;
  vessels: string;
  iodine: string;
  size: string;
  score: number;
}


const ExamImageWorkspace: React.FC<ExamImageWorkspaceProps> = ({ examId }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [segmentRegions, setSegmentRegions] = useState<Region[]>([]);
  const [lesionRegions, setLesionRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("prediction");
  const [showModal, setShowModal] = useState(false);
  const [normality, setNormality] = useState<string | null>(null);
  const [visibleLabels, setVisibleLabels] = useState<string[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [manualFindingsData, setManualFindingsData] = useState<any | null>(null);
  const [normalityRating, setNormalityRating] = useState<"correcta" | "incorrecta" | null>(null);
  const [swedeEvaluation, setSwedeEvaluation] = useState<SwedeEvaluation | null>(null);
  const [showSwedePanel, setShowSwedePanel] = useState(false);
  const [showManualPanel, setShowManualPanel] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);




  useEffect(() => {
    const uniqueLabels = [...new Set(lesionRegions.map(r => r.label))];
    setVisibleLabels(uniqueLabels);
  }, [lesionRegions]);

  const toggleLabelVisibility = (label: string) => {
    setVisibleLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/exams/${examId}/images`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImages(response.data);
        if (response.data.length > 0) setSelectedImage(response.data[0]);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [examId]);

  const handleRegionsUpdate = (segments: Region[], lesions: Region[]) => {
    setSegmentRegions(segments);
    setLesionRegions(lesions);
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => (prev === name ? null : name));
  };


  const handleNormalityPredict = async () => {
  if (!selectedImage) return;

  try {
    const response = await axios.post("/api/exams/predict_normality/", {
      image_id: selectedImage.id,
    });

    const result = response.data.prediction;
    setNormality(result);

  } catch (error) {
    console.error("Error al predecir normalidad:", error);
  }
};

const handleDownloadImage = async () => {
  if (imageRef.current === null) return;

  try {
    const dataUrl = await toPng(imageRef.current);
    const link = document.createElement("a");
    link.download = "colposcopia.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error al capturar la imagen:", error);
  }
};



  if (loading) return <div>Cargando imágenes...</div>;
  if (!images.length) return <div>No hay imágenes disponibles para este examen.</div>;

return (
  <div className="row g-4">
    {/* Panel izquierdo */}
    <div className="col-md-3">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">🖼️ Imágenes del examen</h3>
        </div>
        <div className="list-group list-group-flush">
          {images.map((img) => (
            <button
              key={img.id}
              className={`list-group-item list-group-item-action ${selectedImage?.id === img.id ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={`http://localhost:8000/${img.url}`}
                  alt="thumb"
                  width={48}
                  height={48}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
                <div className="text-start">
                  <div className="fw-bold small">ID: {img.id.slice(0, 8)}</div>
                  <div className="text-muted small">Lesión IA: {img.iaLesion || "--"}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

{/* Panel central */}
<div className="col-md-5">
  {selectedImage && (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
  <span className="card-title mb-0">Visualización de Imagen</span>
  <div className="d-flex gap-2">
    <button
      className="btn btn-sm btn-outline-primary"
      title="Ver tamaño original"
      onClick={() => setShowModal(true)}
    >
      <IconZoomIn size={18} />
    </button>
    <button
      className="btn btn-sm btn-outline-primary"
      title="Descargar imagen"
      onClick={handleDownloadImage}
    >
      <IconDownload size={18} />
    </button>
  </div>
</div>

<div className="card-body position-relative text-center" style={{ minHeight: 420 }}>
  <div
    ref={imageRef}
    className="position-relative text-center"
    style={{
      minHeight: 420,
      display: "inline-block",
      width: "100%"
    }}
  >
    <img
      src={`http://localhost:8000/${selectedImage.url}`}
      alt="Vista de imagen"
      className="img-fluid rounded border"
      style={{
        maxHeight: 400,
        objectFit: "contain",
        width: "100%",
        display: "block",
        margin: "0 auto"
      }}
      onError={(e: any) => {
        e.target.onerror = null;
        e.target.src = "/placeholders/placeholder.png";
      }}
    />

    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%"
      }}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid meet"
    >
      {segmentRegions.map((region, index) => (
        <polygon
          key={`seg-${index}`}
          points={region.points.map(p => p.join(",")).join(" ")}
          fill={region.color || "gray"}
          fillOpacity={0.4}
          stroke={region.color || "gray"}
          strokeWidth={1}
        >
          <title>{region.label}</title>
        </polygon>
      ))}
      {lesionRegions
        .filter(region => visibleLabels.includes(region.label))
        .map((region, index) => (
          <polygon
            key={`lesion-${index}`}
            points={region.points.map(p => p.join(",")).join(" ")}
            fill={region.color || "red"}
            fillOpacity={0.3}
            stroke={region.color || "red"}
            strokeWidth={2}
          >
            <title>
              {region.label}{" "}
              {region.confidence ? `(${Math.round(region.confidence * 100)}%)` : ""}
            </title>
          </polygon>
        ))}
    </svg>
  </div>
</div>

     

      {(lesionRegions.length > 0 || normality || manualFindingsData || swedeEvaluation) && (
        <div className="card-footer px-4 py-3">
          <div className="card border mt-2">
            <div className="card-body">
              <h5 className="card-title">🧪 Resultados clínicos y predicción</h5>

              {lesionRegions.length > 0 && (
                <div className="d-flex align-items-left gap-2 flex-wrap mb-3">
                  <strong className="me-2 text-muted">Lesiones detectadas:</strong>
                  {[...new Map(lesionRegions.map(r => [r.label, r.color || "gray"]))].map(
                    ([label, color]) => (
                      <button
                        key={label}
                        className={`btn btn-sm ms-2 mb-2 ${
                          visibleLabels.includes(label)
                            ? "btn-outline-success"
                            : "btn-outline-secondary"
                        }`}
                        style={{
                          borderColor: visibleLabels.includes(label) ? color : "#ccc",
                          color: visibleLabels.includes(label) ? color : "#999",
                          opacity: visibleLabels.includes(label) ? 1 : 0.6,
                          cursor: "pointer"
                        }}
                        onClick={() => toggleLabelVisibility(label)}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )}

              {normality && (
                <div className="mb-3">
                  <strong className="text-muted me-3">Predicción de la imagen:</strong>
                  <span className="fs-6 d-flex align-items-center gap-2">
                    {normality === "normal" ? (
                      <>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28a745", display: "inline-block" }}></span>
                        <span className="text-success fw-bold">NORMAL</span>
                      </>
                    ) : (
                      <>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#dc3545", display: "inline-block" }}></span>
                        <span className="text-danger fw-bold">ANORMAL</span>
                      </>
                    )}
                  </span>
                </div>
              )}

              <div className="d-flex flex-wrap gap-2 mt-3">
                {manualFindingsData && (
                  <div className="position-relative d-inline-block me-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowManualPanel(!showManualPanel)}
                    >
                      Ver hallazgos
                    </button>

                    {showManualPanel && (
                      <div
                        className="card shadow border position-absolute bg-white p-3 mt-2"
                        style={{
                          zIndex: 1000,
                          top: "100%",
                          left: 0,
                          width: "480px",
                          maxWidth: "95vw",
                          maxHeight: "400px",
                          overflowY: "auto",
                          whiteSpace: "normal"
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-muted">Hallazgos manuales</strong>
                          <button
                            className="btn btn-sm btn-light"
                            onClick={() => setShowManualPanel(false)}
                          >
                            ✕
                          </button>
                        </div>
                        <ul className="list-unstyled small mb-0">
                          <li><strong>Normales:</strong> {manualFindingsData.normales?.join(", ") || "Ninguno"}</li>
                          <li><strong>Anormales menores:</strong> {manualFindingsData.anormalesMenores?.join(", ") || "Ninguno"}</li>
                          <li><strong>Anormales mayores:</strong> {manualFindingsData.anormalesMayores?.join(", ") || "Ninguno"}</li>
                          <li><strong>Yodo:</strong> {manualFindingsData.yodo || "No especificado"}</li>
                          <li><strong>Calidad:</strong> {manualFindingsData.calidad || "No especificado"}</li>
                          <li><strong>Impresión diagnóstica:</strong> {manualFindingsData.impresion || "No especificado"}</li>
                          <li><strong>Zonas evaluadas:</strong> {manualFindingsData.zonasEvaluadas?.join(", ") || "Ninguna"}</li>
                          <li><strong>Sugestiva de cáncer:</strong> {manualFindingsData.sospechaCancer ? "Sí" : "No"}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

              {swedeEvaluation && (
  <div className="position-relative d-inline-block me-2">
    <button
      className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
      onClick={() => setShowSwedePanel(true)}
      title="Ver evaluación Swede"
    >
      <IconFileAnalytics size={16} />
      Swede
    </button>

    {showSwedePanel && typeof swedeEvaluation === "object" && (
      <div
        className="card shadow border position-absolute bg-white p-3 mt-2"
        style={{
          zIndex: 1000,
          top: "100%",
          left: 0,
          width: "480px",
          maxWidth: "95vw",
          maxHeight: "400px",
          overflowY: "auto",
          whiteSpace: "normal"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong className="text-muted">Evaluación Swede</strong>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowSwedePanel(false)}
          >
            ✕
          </button>
        </div>

        <ul className="list-unstyled small mb-0">
          {Object.entries(swedeEvaluation).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}


                {normality && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setShowRatingModal(true)}
                  >
                    Calificar predicción
                  </button>
                )}

               
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
  {showRatingModal && (
  <div
    className="card shadow border position-absolute bg-white p-3"
    style={{
      zIndex: 1050,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "360px",
      maxWidth: "90vw",
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-3">
      <strong className="text-muted">¿Le ha parecido correcta esta predicción?</strong>
      <button className="btn btn-sm btn-light" onClick={() => setShowRatingModal(false)}>
        ✕
      </button>
    </div>
    <div className="d-flex justify-content-around">
      <button
        className={`btn btn-sm btn-outline-success`}
        onClick={() => {
          setNormalityRating("correcta");
          setShowRatingModal(false);
          // Aquí podrías llamar a una función para guardar la calificación si es necesario
        }}
      >
        Sí
      </button>
      <button
        className={`btn btn-sm btn-outline-danger`}
        onClick={() => {
          setNormalityRating("incorrecta");
          setShowRatingModal(false);
        }}
      >
        No
      </button>
      <button
        className={`btn btn-sm btn-outline-secondary`}
        onClick={() => {
          setNormalityRating(null);
          setShowRatingModal(false);
        }}
      >
        Igual
      </button>
    </div>
  </div>
)}

{showModal && selectedImage && (
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
    tabIndex={-1}
    onClick={() => setShowModal(false)}
  >
    <div
      className="modal-dialog modal-dialog-centered modal-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Vista ampliada</h5>
          <button className="btn-close" onClick={() => setShowModal(false)} />
        </div>
        <div className="modal-body text-center">
          <img
            src={`http://localhost:8000/${selectedImage.url}`}
            alt="Imagen ampliada"
            className="img-fluid"
            style={{ maxHeight: "80vh", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  </div>
)}


</div>


    {/* Panel derecho */}
    <div className="col-md-4">
      {selectedImage && (
        <>
          <AccordionCard
            title="🤖 Predicción de lesiones (IA)"
            open={activeAccordion === "prediction"}
            onToggle={() => toggleAccordion("prediction")}
          >
            <AIPredictionSection
              examId={examId}
              imageId={selectedImage.id}
              onRegionsUpdate={handleRegionsUpdate}
              onNormalityPredict={handleNormalityPredict}
            />
          </AccordionCard>

          <AccordionCard
            title="📝 Registro de hallazgos colposcópicos"
            open={activeAccordion === "findings"}
            onToggle={() => toggleAccordion("findings")}
          >
            <ManualFindingsSection
              imageId={selectedImage.id}
              onSaveFindings={(data) => {
                console.log("Recibí estos hallazgos manuales:", data);
                setManualFindingsData(data);
              }}
            />
          </AccordionCard>

          <AccordionCard
            title="📊 Evaluación de escala Swede"
            open={activeAccordion === "swede"}
            onToggle={() => toggleAccordion("swede")}
          >
            <SwedeForm imageId={selectedImage.id} onSave={setSwedeEvaluation} />
          </AccordionCard>
        </>
      )}
    </div>
  </div>
);

};

export default ExamImageWorkspace;
